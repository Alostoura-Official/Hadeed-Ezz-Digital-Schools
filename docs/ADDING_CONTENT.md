# دليل إضافة وتحديث المحتوى

## إضافة كتاب
أضف ملف PDF إلى `books/` ثم أضف سجلًا في `data/books.json`:
```json
{
  "id": "grade1-electrical-unit1",
  "title": "أساسيات الكهرباء - الوحدة الأولى",
  "subject": "الكهرباء",
  "level": "الصف الأول",
  "type": "كتاب دراسي",
  "description": "الوحدة الأولى",
  "url": "https://raw.githubusercontent.com/Alostoura-Official/Hadeed-Ezz-Digital-Schools/main/books/electrical-unit-1.pdf"
}
```
يجب أن يكون `id` فريدًا، وأن يكون رابط `url` مباشرًا وصحيحًا لملف PDF. إذا احتوى اسم الملف على مسافات أو حروف خاصة، يفضّل استخدام اسم لاتيني بسيط مثل `grade1-electrical-unit1.pdf`.

## إضافة مصطلح
أضف عنصرًا إلى `data/terms.json`:
```json
{
  "en": "Limit Switch",
  "pronunciation": "ليميت سويتش",
  "ar": "مفتاح نهاية مشوار",
  "category": "تحكم"
}
```

## إضافة درس
أضف عنصرًا إلى `data/lessons.json`:
```json
{
  "id": "limit-switch-intro",
  "category": "تحكم",
  "title": "مقدمة عن Limit Switch",
  "content": "اكتب شرح الدرس هنا. يمكن استخدام أسطر جديدة داخل النص."
}
```
اجعل قيمة `id` فريدة حتى لا تتعارض علامة الإنجاز مع درس آخر.

## إضافة تعريف
أضف عنصرًا إلى `data/definitions.json`:
```json
{
  "term": "Limit Switch",
  "definition": "مفتاح يُستخدم لاستشعار وصول جزء متحرك إلى موضع محدد."
}
```

## إضافة سؤال
أضف عنصرًا إلى `data/quiz.json`:
```json
{
  "question": "ما وظيفة Limit Switch؟",
  "options": ["استشعار موضع محدد", "تخزين ملفات", "قياس الكتلة فقط", "تبريد الهواء"],
  "answer": 0,
  "explanation": "يستخدم لاستشعار وصول جزء إلى موضع محدد."
}
```
`answer` هو رقم الاختيار الصحيح ويبدأ من صفر: أول اختيار `0`، الثاني `1`، وهكذا. يجب أن تكون قيمة `answer` أقل من عدد عناصر `options`.

## إرشادات تنظيم
- احتفظ بنسخة من الملفات قبل التغييرات الكبيرة.
- استخدم أسماء ملفات واضحة وفريدة.
- لا تضع معلومات شخصية للطلاب داخل ملفات JSON.
- اختبر الموقع عبر GitHub Pages بعد كل تحديث، خصوصًا روابط PDF.
