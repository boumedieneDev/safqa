import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("أدخل بريدًا إلكترونيًا صحيحًا"),
  password: z.string().min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل"),
});

export const dealDraftSchema = z.object({
  title: z.string().min(5, "عنوان الصفقة مطلوب"),
  reference: z.string().min(3, "رقم الصفقة مطلوب"),
  type: z.string().min(1, "نوع الصفقة مطلوب"),
  sector: z.string().min(1, "المجال مطلوب"),
  estimatedValue: z.coerce.number().positive("القيمة التقديرية يجب أن تكون موجبة"),
  submissionDeadline: z.string().min(1, "آخر أجل للتقديم مطلوب"),
});

export const applicationDraftSchema = z.object({
  operatorName: z.string().min(2),
  proposedAmount: z.coerce.number().positive(),
  proposedDurationDays: z.coerce.number().int().positive(),
  notes: z.string().optional(),
});
