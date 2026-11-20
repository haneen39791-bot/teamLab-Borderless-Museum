# الصور المستخدمة حالياً

تم ربط الصور مباشرة بأماكنها في `index.html` و`en.html` عبر خاصية `data-img`.

| الملف | المكان في الموقع |
|---|---|
| `img1.jpg` | خلفية الواجهة الرئيسية (Hero) — تُضبط من `style.css` |
| `museum.jpg` | صورة قسم «عن المتحف» |
| `Athletics-Forest.jpe` | غابة الألعاب الحركية |
| `Future-Park.jpe` | حديقة المستقبل |
| `Forest-of-Lamps.jpe` | غابة المصابيح |
| `Sketch-Ocean.jpe` | محيط الرسومات |
| `EN-TEA-HOUSE.jpe` | بيت الشاي |
| `Untitled.jpe` | العمل التفاعلي الأول |
| `Multi-Jumping-Universe.webp` | العمل التفاعلي الثاني |
| `Aerial-Climbing.webp` | العمل التفاعلي الثالث |
| `Window-to-the-Universe.avif` | العمل التفاعلي الرابع |
| `gallery-01.webp` … `gallery-08.webp` | معرض الصور (الصورة 2 تم إصلاح مسارها) |
| `Logo.png` | شعار المتحف |

> ملاحظة: خلفية الواجهة الرئيسية هي `img1.jpg` وتُضبط عبر قاعدة `.hero` في `assets/css/style.css`؛ بقية الصور تُضبط عبر `data-img` في `index.html` و`en.html`.

## لإضافة صور جديدة
- ضع الملف في هذا المجلد، ثم عدّل المسار في `data-img` داخل `index.html` و`en.html`، أو استخدم الاسم نفسه لملف موجود ليظهر تلقائياً.
- الصيغ المدعومة: `jpg`, `jpeg`, `jpe`, `png`, `webp`, `avif`, `svg`.
- إذا لم توجد الصورة، يظهر المكان النائب تلقائياً ولا يتعطل الموقع.
