export const demoPassword = "SafqaDemo2026!";

export const demoAccounts = [
  {
    email: "superadmin@safqa.test",
    password: demoPassword,
    name: "سليم منصور",
    role: "مشرف المنصة",
    roleKey: "super_admin",
    destination: "/admin/dashboard",
    description: "يراجع طلبات التسجيل، يدير الجهات والمتعاملين، ويتابع الدعوات.",
  },
  {
    email: "admin@safqa.test",
    password: demoPassword,
    name: "أمينة بن سالم",
    role: "مدير المؤسسة",
    roleKey: "institution_admin",
    destination: "/institution/dashboard",
    description: "يرى كل لوحات المؤسسة، الصفقات، المخاطر، الشفافية، والتقارير.",
  },
  {
    email: "procurement@safqa.test",
    password: demoPassword,
    name: "كمال عابد",
    role: "مسؤول الصفقات",
    roleKey: "procurement_officer",
    destination: "/institution/deals",
    description: "يدير إنشاء الصفقات والوثائق ومتطلبات المشاركة.",
  },
  {
    email: "evaluator@safqa.test",
    password: demoPassword,
    name: "نادية مرابط",
    role: "لجنة التقييم",
    roleKey: "evaluation_committee",
    destination: "/institution/deals",
    description: "يراجع العروض ويضيف التقييمات الفنية والمالية.",
  },
  {
    email: "auditor@safqa.test",
    password: demoPassword,
    name: "مراد قاسمي",
    role: "مدقق داخلي",
    roleKey: "auditor",
    destination: "/institution/audit-log",
    description: "يركز على سجل التدقيق والتنبيهات ومراجعة المخاطر.",
  },
  {
    email: "decision@safqa.test",
    password: demoPassword,
    name: "سعاد خليفة",
    role: "صاحب القرار",
    roleKey: "decision_maker",
    destination: "/institution/dashboard",
    description: "يتابع المؤشرات والقرارات النهائية وتقارير الأداء.",
  },
  {
    email: "operator@safqa.test",
    password: demoPassword,
    name: "يوسف منصوري",
    role: "متعامل اقتصادي",
    roleKey: "operator_user",
    destination: "/operator/dashboard",
    description: "يرى الصفقات المتاحة، يرفع الملفات، ويتابع مشاركاته.",
  },
];

export const publicVisitorFeatures = [
  "تعريف المنصة وفكرة الشفافية وتحليل المخاطر.",
  "عرض مختصر للصفقات المنشورة دون تفاصيل داخلية.",
  "معرفة الوثائق العامة ومسار المشاركة بشكل عام.",
  "لا تظهر درجات المخاطر الداخلية، تقييم العروض، ملفات المتعاملين، أو سجل التدقيق.",
];
