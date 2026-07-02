// مشغّل العميل — يغلّف Claude Agent SDK ويحوّل مجرى الرسائل إلى أحداث للواجهة
import { query } from '@anthropic-ai/claude-agent-sdk';
import path from 'node:path';
import fs from 'node:fs';
import { systemPromptFor } from './prompts.mjs';

// أدوات القراءة الآمنة تنفذ دون استئذان؛ الباقي يمر عبر نافذة الإذن في الواجهة
const SAFE_TOOLS = ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch', 'TodoWrite', 'Task'];

export class AgentRunner {
  constructor({ workspaceRoot }) {
    this.workspaceRoot = workspaceRoot;
    this.active = new Map(); // taskId -> { abort, pendingPermissions: Map }
  }

  workspaceFor(taskId) {
    const dir = path.join(this.workspaceRoot, taskId);
    fs.mkdirSync(path.join(dir, 'output'), { recursive: true });
    return dir;
  }

  isRunning(taskId) {
    return this.active.has(taskId);
  }

  stop(taskId) {
    const entry = this.active.get(taskId);
    if (entry) entry.abort.abort();
  }

  answerPermission(taskId, requestId, allow) {
    const entry = this.active.get(taskId);
    const resolve = entry?.pendingPermissions.get(requestId);
    if (resolve) {
      entry.pendingPermissions.delete(requestId);
      resolve(allow);
    }
  }

  /**
   * يشغّل دورة كاملة (مهمة جديدة أو متابعة جلسة سابقة) ويبث الأحداث عبر emit.
   * يعيد { sessionId, costUsd } عند الاكتمال.
   */
  async run({ taskId, prompt, mode, model, effort, resumeSessionId, autoApprove, emit }) {
    if (this.active.has(taskId)) throw new Error('task-already-running');

    const abort = new AbortController();
    const entry = { abort, pendingPermissions: new Map(), autoApprove: !!autoApprove };
    this.active.set(taskId, entry);

    const cwd = this.workspaceFor(taskId);
    let sessionId = resumeSessionId || null;
    let costUsd = 0;
    let permCounter = 0;

    const canUseTool = async (toolName, input, opts) => {
      if (entry.autoApprove || SAFE_TOOLS.includes(toolName)) {
        return { behavior: 'allow', updatedInput: input };
      }
      const requestId = `perm_${++permCounter}`;
      emit({
        type: 'permission_request',
        taskId,
        requestId,
        toolName,
        title: opts.title || `يريد الوكيل استخدام ${toolName}`,
        description: opts.description || '',
        input: safePreview(input),
      });
      const allow = await new Promise((resolve) => {
        entry.pendingPermissions.set(requestId, resolve);
        opts.signal.addEventListener('abort', () => resolve(false), { once: true });
      });
      emit({ type: 'permission_closed', taskId, requestId });
      return allow
        ? { behavior: 'allow', updatedInput: input }
        : { behavior: 'deny', message: 'رفض المستخدم هذه الخطوة. اسأله عن البديل الذي يريده.' };
    };

    const options = {
      cwd,
      model,
      effort: effort || 'high',
      systemPrompt: systemPromptFor(mode),
      permissionMode: 'default',
      allowedTools: SAFE_TOOLS,
      canUseTool,
      abortController: abort,
      settingSources: [],
      maxTurns: 200,
      env: { ...process.env },
      includePartialMessages: false,
    };
    if (resumeSessionId) options.resume = resumeSessionId;

    try {
      const q = query({ prompt, options });
      for await (const msg of q) {
        switch (msg.type) {
          case 'system':
            if (msg.subtype === 'init') {
              sessionId = msg.session_id;
              emit({ type: 'init', taskId, sessionId, model: msg.model });
            }
            break;

          case 'assistant': {
            if (msg.parent_tool_use_id) break; // رسائل الوكلاء الفرعيين لا تعرض مباشرة
            for (const block of msg.message?.content || []) {
              if (block.type === 'text' && block.text?.trim()) {
                emit({ type: 'text', taskId, text: block.text });
              } else if (block.type === 'thinking') {
                emit({ type: 'thinking', taskId });
              } else if (block.type === 'tool_use') {
                emit({
                  type: 'tool_use',
                  taskId,
                  toolName: block.name,
                  input: safePreview(block.input),
                });
              }
            }
            break;
          }

          case 'result': {
            costUsd = msg.total_cost_usd || 0;
            emit({
              type: 'result',
              taskId,
              ok: msg.subtype === 'success' && !msg.is_error,
              subtype: msg.subtype,
              text: msg.subtype === 'success' ? msg.result : (msg.result || msg.subtype),
              costUsd,
              durationMs: msg.duration_ms,
              numTurns: msg.num_turns,
            });
            break;
          }
        }
      }
    } finally {
      this.active.delete(taskId);
      emit({ type: 'files', taskId, files: listOutputFiles(cwd) });
      emit({ type: 'done', taskId });
    }
    return { sessionId, costUsd };
  }
}

function safePreview(input) {
  try {
    const s = JSON.stringify(input);
    return s.length > 1200 ? s.slice(0, 1200) + '…' : s;
  } catch {
    return String(input);
  }
}

export function listOutputFiles(cwd) {
  const out = path.join(cwd, 'output');
  const files = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else {
        const st = fs.statSync(full);
        files.push({ path: path.relative(out, full), size: st.size, mtime: st.mtimeMs });
      }
    }
  };
  walk(out);
  return files.sort((a, b) => b.mtime - a.mtime);
}
