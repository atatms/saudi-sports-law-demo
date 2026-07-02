# saudi-sports-law-demo — GitHub Pages

هذا الفرع (`main`) يُستخدم لنشر الموقع عبر GitHub Pages.

## ما يُعرض على الرابط
- **التطبيق (وظيفة):** الصفحة الرئيسية — https://atatms.github.io/saudi-sports-law-demo/
  نسخة الويب من تطبيق التوظيف الذكي (iOS / Android) المبني بـ Expo + React Native.
- **منصة الأبحاث (السابقة):** نُقلت إلى مجلد `research/` — https://atatms.github.io/saudi-sports-law-demo/research/
- **لعبة الفضل بن علي:** بأسلوب فلابي بيرد برسومات واقعية، قابلة للتثبيت على الجوال (PWA) وتعمل بدون إنترنت — https://atatms.github.io/saudi-sports-law-demo/flappy/

## مصدر الكود
- كود التطبيق الكامل (المصدر) موجود في الفرع `claude/ios-android-job-app-dsihs2` داخل مجلد `job-app/`.
- الملفات في جذر هذا الفرع هي ناتج البناء الجاهز للويب (`expo export`)؛ لا تُعدّل يدوياً.

## إعادة بناء نسخة الويب
```bash
cd job-app           # من فرع التطبيق
npm install
npx expo export --platform web   # الناتج في job-app/dist
# ثم انسخ محتويات dist إلى جذر main
```
