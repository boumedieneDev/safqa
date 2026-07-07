"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SafqaLogo } from "@/components/brand/safqa-logo";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/layout/navigation";

interface SidebarProps {
  title: string;
  subtitle: string;
  navItems: NavItem[];
}

export function Sidebar({ title, subtitle, navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside aria-label={title} className="fixed inset-y-0 right-0 z-30 hidden w-72 flex-col bg-sidebar text-white lg:flex">
      <div className="border-b border-white/10 p-5">
        <div className="space-y-2">
          <SafqaLogo inverted />
          <p className="pr-14 text-xs text-white/65">{subtitle}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                isActive ? "bg-white text-sidebar" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4 text-xs leading-5 text-white/60">
        منصة الشفافية وتحليل المخاطر في الصفقات
      </div>
    </aside>
  );
}
