// تخزين محلي بسيط للمهام في ملف JSON — لا شيء يغادر الجهاز
import fs from 'node:fs';
import path from 'node:path';

export class Store {
  constructor(dataDir) {
    this.file = path.join(dataDir, 'tasks.json');
    fs.mkdirSync(dataDir, { recursive: true });
    this.tasks = this.#load();
  }

  #load() {
    try {
      return JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } catch {
      return {};
    }
  }

  #save() {
    fs.writeFileSync(this.file, JSON.stringify(this.tasks, null, 2));
  }

  list() {
    return Object.values(this.tasks).sort((a, b) => b.createdAt - a.createdAt);
  }

  get(id) {
    return this.tasks[id];
  }

  create({ id, title, mode, model }) {
    const task = {
      id,
      title,
      mode,
      model,
      sessionId: null,
      status: 'running',
      costUsd: 0,
      createdAt: Date.now(),
      messages: [],
    };
    this.tasks[id] = task;
    this.#save();
    return task;
  }

  update(id, patch) {
    const t = this.tasks[id];
    if (!t) return;
    Object.assign(t, patch);
    this.#save();
    return t;
  }

  // يحفظ سجل المحادثة المعروض (نصوص وأدوات) لإعادة عرضه عند فتح المهمة
  appendMessage(id, msg) {
    const t = this.tasks[id];
    if (!t) return;
    t.messages.push(msg);
    if (t.messages.length > 500) t.messages = t.messages.slice(-500);
    this.#save();
  }
}
