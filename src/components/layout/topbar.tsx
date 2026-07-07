import { Bell, Search } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  portalLabel: string;
}

export function Topbar({ portalLabel }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/92 backdrop-blur">
      <div className="flex min-h-16 items-center gap-4 px-4 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground">{portalLabel}</p>
          <p className="truncate text-sm font-bold text-foreground">نظام إدارة الصفقات والشفافية</p>
        </div>
        <div className="hidden w-full max-w-sm items-center gap-2 rounded-md border border-border bg-slate-50 px-3 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input className="border-0 bg-transparent px-0 shadow-none focus:ring-0" placeholder="بحث سريع..." />
        </div>
        <Button variant="ghost" size="icon" title="الإشعارات">
          <Bell className="h-5 w-5" />
        </Button>
        <SignOutButton />
      </div>
    </header>
  );
}
