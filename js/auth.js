/* ===========================================================
   auth.js — المصادقة (اسم المستخدم + الرقم السري)
   يُخزَّن الرقم السري كتجزئة SHA-256 + ملح، لا يُحفظ نصيًا.
   الجلسة تُحفظ في sessionStorage.
   ملاحظة: هذه حماية محلية مناسبة لأداة شخصية على جهازك،
   وليست بديلاً عن مصادقة خادم في بيئة متعددة المستخدمين.
   =========================================================== */
(function (global) {
  'use strict';

  const SESSION_KEY = 'rjt_session';

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function hash(password, salt) {
    const enc = new TextEncoder();
    const data = enc.encode(salt + '::' + password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return toHex(digest);
  }

  function randomSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return toHex(arr);
  }

  const Auth = {
    hasAccount() { return !!Store.getAccount(); },

    isLoggedIn() {
      const acc = Store.getAccount();
      if (!acc) return false;
      return sessionStorage.getItem(SESSION_KEY) === acc.username;
    },

    async register({ username, password, displayName, academicEmail, personalEmail }) {
      if (!username || !password) throw new Error('اسم المستخدم والرقم السري مطلوبان');
      if (password.length < 4) throw new Error('الرقم السري قصير جدًا (4 أحرف على الأقل)');
      const salt = randomSalt();
      const passHash = await hash(password, salt);
      Store.setAccount({
        username: username.trim(),
        salt, passHash,
        displayName: (displayName || username).trim(),
        academicEmail: (academicEmail || '').trim(),
        personalEmail: (personalEmail || '').trim(),
        apiKey: ''
      });
      sessionStorage.setItem(SESSION_KEY, username.trim());
      return true;
    },

    async login({ username, password }) {
      const acc = Store.getAccount();
      if (!acc) throw new Error('لا يوجد حساب بعد، أنشئ حسابًا أولًا');
      if (acc.username !== (username || '').trim()) throw new Error('اسم المستخدم أو الرقم السري غير صحيح');
      const h = await hash(password, acc.salt);
      if (h !== acc.passHash) throw new Error('اسم المستخدم أو الرقم السري غير صحيح');
      sessionStorage.setItem(SESSION_KEY, acc.username);
      return true;
    },

    async changePassword(oldPassword, newPassword) {
      const acc = Store.getAccount();
      if (!acc) throw new Error('لا يوجد حساب');
      const h = await hash(oldPassword, acc.salt);
      if (h !== acc.passHash) throw new Error('الرقم السري الحالي غير صحيح');
      if (!newPassword || newPassword.length < 4) throw new Error('الرقم السري الجديد قصير جدًا');
      const salt = randomSalt();
      const passHash = await hash(newPassword, salt);
      Store.updateAccount({ salt, passHash });
      return true;
    },

    logout() {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  global.Auth = Auth;
})(window);
