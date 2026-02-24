# البشت العربي الأصيل

منصة تجارة إلكترونية متكاملة لبيع البشوت الخليجية الفاخرة، مبنية باستخدام Next.js (App Router)، Tailwind CSS، Prisma، وMySQL مع واجهات عربية بالكامل وتصميم مستوحى من الفخامة الخليجية.

## المتطلبات

- Node.js 18 فما فوق
- قاعدة بيانات MySQL

## الإعداد

1. تثبيت الاعتمادات:

```bash
npm install
```

2. إنشاء ملف البيئة `.env` وإضافة بيانات الاتصال بقاعدة البيانات:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/albisht_store"
ADMIN_PASSWORD="Admin@123"
```

3. تهيئة Prisma وتشغيل المايجريشن:

```bash
npx prisma migrate dev --name init
npx prisma db seed   # لإضافة بيانات أولية (فئات، منتجات، مستخدم أدمن)
```

4. تشغيل خادم التطوير:

```bash
npm run dev
```

## المسارات المهمة

- المتجر العام: `http://localhost:3000/`
- صفحة الفئات: `http://localhost:3000/categories`
- السلة: `http://localhost:3000/cart`
- إتمام الطلب: `http://localhost:3000/checkout`
- لوحة تحكم الأدمن: `http://localhost:3000/admin`

## التقنيات

- Next.js 16 (App Router) + React 19
- Tailwind CSS مع تصميم مخصص بالألوان الذهبية والبنية
- Prisma ORM + MySQL
- API Routes لإدارة المنتجات، الفئات، الطلبات، والتواصل
- منطق سلة مشتريات باستخدام React Context و LocalStorage
