import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>استرجاع كلمة المرور</CardTitle>
          <CardDescription>أدخل بريدك الإلكتروني لإرسال رابط الاسترجاع عند تفعيل Supabase Auth.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-md border border-input bg-white px-3">
            <MailCheck className="h-4 w-4 text-muted-foreground" />
            <Input className="border-0 px-0 focus:ring-0" placeholder="name@example.dz" />
          </div>
          <Button className="w-full">إرسال رابط الاسترجاع</Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">العودة إلى الدخول</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
