import {
  BarChart3,
  Bell,
  ClipboardList,
  Building2,
  FileArchive,
  FileCheck2,
  FileText,
  Gauge,
  Home,
  Landmark,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  ScrollText,
  SearchCheck,
  Settings,
  ShieldAlert,
  Sparkles,
  UserPlus,
  UserCircle,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const institutionNav: NavItem[] = [
  { href: "/institution/dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
  { href: "/institution/deals", label: "إدارة الصفقات", icon: ClipboardList },
  { href: "/institution/operators", label: "المتعاملون", icon: Users },
  { href: "/institution/users", label: "مستخدمو المؤسسة", icon: UserPlus },
  { href: "/institution/risk-analysis", label: "تحليل المخاطر", icon: ShieldAlert },
  { href: "/institution/transparency", label: "مؤشر الشفافية", icon: Gauge },
  { href: "/institution/smart-matching", label: "المطابقة الذكية", icon: Sparkles },
  { href: "/institution/reports", label: "التقارير", icon: BarChart3 },
  { href: "/institution/documents", label: "الوثائق", icon: FileArchive },
  { href: "/institution/audit-log", label: "سجل التدقيق", icon: ScrollText },
  { href: "/institution/settings", label: "الإعدادات", icon: Settings },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "لوحة المنصة", icon: LayoutDashboard },
  { href: "/admin/registrations", label: "طلبات التسجيل", icon: ClipboardList },
  { href: "/admin/invitations", label: "الدعوات", icon: UserPlus },
  { href: "/admin/organizations", label: "الجهات العمومية", icon: Building2 },
  { href: "/admin/operators", label: "المتعاملون", icon: Users },
  { href: "/admin/audit", label: "تدقيق المنصة", icon: ScrollText },
];

export const operatorNav: NavItem[] = [
  { href: "/operator/dashboard", label: "لوحة القيادة", icon: Home },
  { href: "/operator/available-deals", label: "الصفقات المتاحة", icon: SearchCheck },
  { href: "/operator/my-applications", label: "مشاركاتي", icon: ListChecks },
  { href: "/operator/my-documents", label: "وثائقي", icon: FileCheck2 },
  { href: "/operator/notifications", label: "الإشعارات", icon: Bell },
  { href: "/operator/profile", label: "الملف الشخصي", icon: UserCircle },
];

export const authQuickLinks = [
  { href: "/institution/dashboard", label: "واجهة المؤسسة", icon: Landmark },
  { href: "/operator/dashboard", label: "واجهة المتعامل", icon: FileText },
];
