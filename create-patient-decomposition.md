# Create Patient Modal — Полная декомпозиция

> Дата: 2026-03-26  
> Автор: AI Analysis  
> Принципы: SOLID · DRY · Single Responsibility · Accessibility · i18n

---

## Оглавление

1. [Файловая структура](#1-файловая-структура)
2. [Архитектура и поток данных](#2-архитектура-и-поток-данных)
3. [Локализация — ключи i18n](#3-локализация--ключи-i18n)
4. [Слой 1 — Типы и модели](#4-слой-1--типы-и-модели)
5. [Слой 2 — Zod-схема валидации](#5-слой-2--zod-схема-валидации)
6. [Слой 3 — BFF API route (POST)](#6-слой-3--bff-api-route-post)
7. [Слой 4 — patients.service.ts](#7-слой-4--patientsservicets)
8. [Слой 5 — TagsInput](#8-слой-5--tagsinput)
9. [Слой 6 — DatePickerField (переиспользуемый)](#9-слой-6--datepickerfield-переиспользуемый)
10. [Слой 7 — Секции формы](#10-слой-7--секции-формы)
11. [Слой 8 — CreatePatientForm](#11-слой-8--createpatientform)
12. [Слой 9 — CreatePatientModal](#12-слой-9--createpatientmodal)
13. [Слой 10 — Интеграция в Patients.tsx](#13-слой-10--интеграция-в-patientstsx)
14. [UI/UX — Responsive Layout](#14-uiux--responsive-layout)
15. [Порядок реализации](#15-порядок-реализации)

---

## 1. Файловая структура

```
components/
└── patients/
    ├── Patients.tsx                                ← ИЗМЕНИТЬ: заменить кнопку
    └── createPatient/
        ├── CreatePatientModal.tsx                  ← СОЗДАТЬ: Dialog-обёртка + trigger
        ├── CreatePatientForm.tsx                   ← СОЗДАТЬ: RHF Form + submit logic
        ├── schema.ts                               ← СОЗДАТЬ: Zod-схема
        ├── types.ts                                ← СОЗДАТЬ: локальные типы формы
        ├── sections/
        │   ├── PersonalInfoSection.tsx             ← СОЗДАТЬ: firstName, lastName, dob, gender
        │   ├── ContactSection.tsx                  ← СОЗДАТЬ: phone, email
        │   └── AddressSection.tsx                  ← СОЗДАТЬ: street, city, zip, country
        └── components/
            ├── TagsInput.tsx                       ← СОЗДАТЬ: кастомный тегов-инпут
            └── FormSectionHeader.tsx               ← СОЗДАТЬ: переиспользуемый заголовок секции

components/
└── ui/
    └── date-picker-field.tsx                       ← СОЗДАТЬ: переиспользуемый date picker

models/
└── patient.model.ts                                ← ИЗМЕНИТЬ: добавить CreatePatientDto

lib/api/
└── patients.service.ts                             ← ИЗМЕНИТЬ: добавить createPatient()

app/api/patients/
└── route.ts                                        ← ИЗМЕНИТЬ: добавить POST handler

public/locales/
├── en/common.json                                  ← ИЗМЕНИТЬ: добавить patients.create.*
├── de/common.json                                  ← ИЗМЕНИТЬ
└── ua/common.json                                  ← ИЗМЕНИТЬ
```

---

## 2. Архитектура и поток данных

```
Patients.tsx
└── <CreatePatientModal onPatientCreated={refetch}>
    │
    ├── [trigger] Button "New Patient"
    │
    └── <Dialog open={open} onOpenChange={setOpen}>
        └── <DialogContent>
            ├── <DialogHeader>
            └── <CreatePatientForm
                    onSuccess={handleSuccess}
                    onCancel={handleClose}
                >
                ├── useForm (react-hook-form + zodResolver)
                ├── <PersonalInfoSection control={control} />
                ├── <ContactSection control={control} />
                ├── <AddressSection control={control} />
                └── <TagsInput ... />

──────────────────────────────────────────────
submit (onSubmit) →
  1. cleanEmptyStrings(data) — убрать "" → undefined
  2. PatientsService.createPatient(dto) →
     POST /api/patients (Next.js BFF) →
     POST /patients (Backend)
  3. onSuccess(newPatient) → Patients.tsx обновляет список
  4. toast success / error
  5. form.reset() + onOpenChange(false)
```

### Принципы SOLID в архитектуре

| Принцип | Где применён |
|---------|-------------|
| **S** — Single Responsibility | Каждая секция отвечает только за свою группу полей. `CreatePatientForm` — только за submit-логику. `CreatePatientModal` — только за открытие/закрытие диалога. |
| **O** — Open/Closed | `FormSectionHeader` и `DatePickerField` — переиспользуемые компоненты. Новые секции добавляются без изменения существующих. |
| **L** — Liskov | Все секции принимают унифицированный интерфейс `{ control: Control<FormData> }` |
| **I** — Interface Segregation | `TagsInput` не получает весь `control` — получает только `value` + `onChange` |
| **D** — Dependency Inversion | `CreatePatientForm` не вызывает `PatientsService` напрямую — получает `onSuccess` коллбэк; логика вызова в самом `onSubmit` |

### DRY — что переиспользуется

- `FormSectionHeader` — заголовок секции (иконка + название) используется в 3 секциях
- `DatePickerField` — выносим в `components/ui/` т.к. будет нужен в appointments, employees и т.д.
- i18n-ключи `common.cancel`, `common.save` — уже существуют, не дублируем

---

## 3. Локализация — ключи i18n

### Новые ключи для добавления в `common.json` (en / de / ua)

```json
{
  "patients": {
    "title": "Patients",
    "new-patient": "New Patient",
    "create": {
      "title": "New Patient",
      "description": "Fill in the patient's information. Required fields are marked with *",
      "submit": "Create Patient",
      "submitting": "Creating...",
      "success": "Patient created successfully",
      "error": "Failed to create patient",
      "sections": {
        "personal": "Personal Information",
        "contact": "Contact Details",
        "address": "Address",
        "tags": "Tags"
      },
      "fields": {
        "first-name": "First Name",
        "first-name-placeholder": "Anna",
        "last-name": "Last Name",
        "last-name-placeholder": "Kovalchuk",
        "date-of-birth": "Date of Birth",
        "date-of-birth-placeholder": "Select date",
        "gender": "Gender",
        "gender-placeholder": "Select gender",
        "gender-male": "Male",
        "gender-female": "Female",
        "gender-other": "Other",
        "phone": "Phone",
        "phone-placeholder": "+380991234567",
        "email": "Email",
        "email-placeholder": "patient@example.com",
        "address-street": "Street",
        "address-street-placeholder": "123 Main St",
        "address-city": "City",
        "address-city-placeholder": "Kyiv",
        "address-zip": "ZIP Code",
        "address-zip-placeholder": "01001",
        "address-country": "Country",
        "address-country-placeholder": "Ukraine",
        "tags": "Tags",
        "tags-placeholder": "Add tag and press Enter",
        "tags-hint": "Press Enter or comma to add. Max 20 tags.",
        "tags-counter": "{{count}}/20"
      },
      "validation": {
        "first-name-required": "First name is required",
        "first-name-max": "First name must be at most 100 characters",
        "first-name-whitespace": "First name cannot be only whitespace",
        "last-name-required": "Last name is required",
        "last-name-max": "Last name must be at most 100 characters",
        "last-name-whitespace": "Last name cannot be only whitespace",
        "dob-required": "Date of birth is required",
        "dob-format": "Date must be in YYYY-MM-DD format",
        "dob-future": "Date of birth cannot be in the future",
        "gender-invalid": "Please select a valid gender",
        "phone-format": "Must be international format: +380991234567",
        "phone-max": "Phone number is too long",
        "email-invalid": "Please enter a valid email address",
        "email-max": "Email must be at most 255 characters",
        "street-max": "Street must be at most 255 characters",
        "city-max": "City must be at most 100 characters",
        "zip-max": "ZIP code must be at most 20 characters",
        "country-max": "Country must be at most 100 characters",
        "tag-max": "Each tag must be at most 50 characters",
        "tags-max": "Maximum 20 tags allowed"
      }
    }
  }
}
```

### Использование в компонентах

```typescript
// В каждом компоненте секции
const { t } = useTranslation("common");

// Пример
t("patients.create.fields.first-name")       // "First Name"
t("patients.create.validation.dob-required") // "Date of birth is required"
t("patients.create.sections.personal")       // "Personal Information"
t("common.cancel")                           // "Cancel" — УЖЕ СУЩЕСТВУЕТ
```

---

## 4. Слой 1 — Типы и модели

### `models/patient.model.ts` — добавить

```typescript
export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;              // строго YYYY-MM-DD
  gender?: "male" | "female" | "other";
  phone?: string;                   // международный формат
  email?: string;
  addressStreet?: string;
  addressCity?: string;
  addressZip?: string;
  addressCountry?: string;
  tags?: string[];
}

export interface CreatePatientResponse {
  success: boolean;
  data: Patient;
  meta: {
    timestamp: string;
    path: string;
  };
}
```

### `components/patients/createPatient/types.ts` — локальные типы формы

```typescript
import type { CreatePatientFormData } from "./schema";
import type { Patient } from "@/models/patient.model";
import type { Control } from "react-hook-form";

// Единый интерфейс для всех секций — I из SOLID
export interface FormSectionProps {
  control: Control<CreatePatientFormData>;
}

export interface CreatePatientFormProps {
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
}

export interface CreatePatientModalProps {
  onPatientCreated?: (patient: Patient) => void;
}
```

---

## 5. Слой 2 — Zod-схема валидации

### `components/patients/createPatient/schema.ts`

```typescript
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js"; // уже в package.json

// Вынесены переиспользуемые рефайны — DRY
const nonWhitespaceString = (maxLen: number) =>
  z.string()
    .max(maxLen)
    .refine((v) => !v || v.trim().length > 0, { message: "whitespace" });

export const createPatientSchema = z.object({
  firstName: z
    .string()
    .min(1, "first-name-required")
    .max(100, "first-name-max")
    .refine((v) => v.trim().length > 0, "first-name-whitespace"),

  lastName: z
    .string()
    .min(1, "last-name-required")
    .max(100, "last-name-max")
    .refine((v) => v.trim().length > 0, "last-name-whitespace"),

  dateOfBirth: z
    .string()
    .min(1, "dob-required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dob-format")
    .refine((v) => {
      if (!v) return true;
      return new Date(v) <= new Date();
    }, "dob-future"),

  gender: z.enum(["male", "female", "other"]).optional(),

  phone: z
    .string()
    .max(30, "phone-max")
    .refine(
      (v) => !v || isValidPhoneNumber(v),
      "phone-format"
    )
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .email("email-invalid")
    .max(255, "email-max")
    .optional()
    .or(z.literal("")),

  addressStreet:  nonWhitespaceString(255).optional(),
  addressCity:    nonWhitespaceString(100).optional(),
  addressZip:     nonWhitespaceString(20).optional(),
  addressCountry: nonWhitespaceString(100).optional(),

  tags: z
    .array(z.string().min(1).max(50, "tag-max"))
    .max(20, "tags-max")
    .default([]),
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
```

> **Замечание по ключам**: сообщения об ошибках в схеме — это ключи `patients.create.validation.*`.  
> В `FormMessage` компоненте нужно оборачивать через `t("patients.create.validation." + error.message)`.

---

## 6. Слой 3 — BFF API route (POST)

### `app/api/patients/route.ts` — добавить POST

```typescript
export async function POST(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
  }

  // Authorization: берём из incoming заголовка (httpClient уже добавляет Bearer)
  const authorizationHeader = request.headers.get("authorization");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(`${apiUrl}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    // Проверка Content-Type перед .json() — бэкенд может вернуть HTML при 502
    const contentType = backendResponse.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await backendResponse.json()
      : { message: `Backend error ${backendResponse.status}` };

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data?.message ?? "Failed to create patient" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create patient error:", error);
    return NextResponse.json(
      { success: false, message: "Backend service unavailable" },
      { status: 503 }
    );
  }
}
```

---

## 7. Слой 4 — patients.service.ts

### Добавить `createPatient` в `PatientsService`

```typescript
async createPatient(dto: CreatePatientDto): Promise<CreatePatientResponse> {
  const response = await httpClient.request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  // Бэкенд возвращает message: string[] при 400 — Array.isArray важен
  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message ?? "Failed to create patient";
    throw new Error(message);
  }

  return data as CreatePatientResponse;
},
```

---

## 8. Слой 5 — TagsInput

### `components/patients/createPatient/components/TagsInput.tsx`

**Интерфейс:**
```typescript
interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
  maxTags?: number;    // default: 20
  disabled?: boolean;
}
```

**Поведение:**
- `Enter` или `,` → добавить тег (trim + toLowerCase + дедупликация)
- `Backspace` на пустом input → удалить последний тег
- Клик на `×` у тега → удалить тег
- `maxTags` достигнут → input `disabled`
- Счётчик `{count}/20` в правом нижнем углу
- Каждый тег — `<Badge variant="secondary">` из `components/ui/badge.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [tag1 ×] [tag2 ×] [tag3 ×]                          │
│ ___ input placeholder ___                    3/20    │
└─────────────────────────────────────────────────────┘
```

---

## 9. Слой 6 — DatePickerField (переиспользуемый)

### `components/ui/date-picker-field.tsx`

> Выносим в `components/ui/` — **O из SOLID**: компонент будет нужен в Appointments, Employees.

**Интерфейс:**
```typescript
interface DatePickerFieldProps {
  value: string;              // YYYY-MM-DD или ""
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;          // default: 1900
  toYear?: number;            // default: current year
  error?: boolean;
}
```

**Поведение:**
- `Popover` + `Calendar` из `components/ui/` (уже есть оба)
- Кнопка-триггер показывает форматированную дату (`format(date, "dd MMM yyyy")`)
- При выборе → форматировать в `YYYY-MM-DD` через `date-fns/format`
- Иконка `CalendarIcon` из `lucide-react`
- Закрывать `Popover` после выбора

---

## 10. Слой 7 — Секции формы

### Общий компонент `FormSectionHeader.tsx`

```typescript
// DRY: один компонент для заголовков всех секций
interface FormSectionHeaderProps {
  icon: LucideIcon;
  title: string;
}
```

**Вид:**
```
● Personal Information    ← icon (16px) + текст text-sm font-medium text-muted-foreground
─────────────────────────
```

---

### `PersonalInfoSection.tsx`

```
Props: FormSectionProps { control }

Layout (responsive):
┌─────────────────┬─────────────────┐
│ First Name *    │ Last Name *      │  ← grid-cols-1 sm:grid-cols-2 gap-4
└─────────────────┴─────────────────┘
┌─────────────────────────────────────┐
│ Date of Birth *   [calendar picker] │  ← DatePickerField
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Gender   [Select: Male/Female/Other]│  ← shadcn Select
└─────────────────────────────────────┘
```

**Поля:**
- `firstName` — Input, required, `autoFocus`
- `lastName` — Input, required
- `dateOfBirth` — `DatePickerField`, required, `toYear={currentYear}`, `fromYear={1900}`
- `gender` — shadcn `Select`, optional

---

### `ContactSection.tsx`

```
Props: FormSectionProps { control }

Layout:
┌─────────────────┬─────────────────┐
│ Phone           │ Email           │  ← grid-cols-1 sm:grid-cols-2 gap-4
└─────────────────┴─────────────────┘
```

**Поля:**
- `phone` — Input, `type="tel"`, `placeholder="+380991234567"`, optional
- `email` — Input, `type="email"`, optional

---

### `AddressSection.tsx`

```
Props: FormSectionProps { control }

Layout:
┌─────────────────────────────────────┐
│ Street                              │  ← full width
└─────────────────────────────────────┘
┌─────────────────┬─────────────────┐
│ City            │ ZIP Code        │  ← grid-cols-1 sm:grid-cols-2 gap-4
└─────────────────┴─────────────────┘
┌─────────────────────────────────────┐
│ Country                             │  ← full width
└─────────────────────────────────────┘
```

**Поля:** `addressStreet`, `addressCity`, `addressZip`, `addressCountry` — все Input, все optional.

---

## 11. Слой 8 — CreatePatientForm

### `CreatePatientForm.tsx`

**Ответственность (S из SOLID):**
- Инициализация `react-hook-form` с `zodResolver`
- Сборка секций в скроллируемый контейнер
- `onSubmit`: очистка данных → вызов сервиса → колбэк → toast
- Передача кнопок в footer через `DialogFooter` (пропс)

```typescript
interface CreatePatientFormProps {
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
  formId: string; // для связи form + submit button вне компонента
}
```

### Логика submit

```typescript
const onSubmit = async (formData: CreatePatientFormData) => {
  // 1. Убрать пустые строки → undefined (бэкенд отклоняет "" для опциональных полей)
  const dto: CreatePatientDto = {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    dateOfBirth: formData.dateOfBirth,
    ...(formData.gender && { gender: formData.gender }),
    ...(formData.phone?.trim() && { phone: formData.phone.trim() }),
    ...(formData.email?.trim() && { email: formData.email.trim() }),
    ...(formData.addressStreet?.trim() && { addressStreet: formData.addressStreet.trim() }),
    ...(formData.addressCity?.trim() && { addressCity: formData.addressCity.trim() }),
    ...(formData.addressZip?.trim() && { addressZip: formData.addressZip.trim() }),
    ...(formData.addressCountry?.trim() && { addressCountry: formData.addressCountry.trim() }),
    ...(formData.tags?.length && { tags: formData.tags }),
  };

  try {
    const response = await PatientsService.createPatient(dto);
    toast({ title: t("patients.create.success") });
    onSuccess(response.data);
  } catch (error) {
    toast({
      title: t("patients.create.error"),
      description: error instanceof Error ? error.message : undefined,
      variant: "destructive",
    });
  }
};
```

### Структура JSX

```tsx
<Form {...form}>
  <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
    <div className="space-y-6 px-6 py-4">

      {/* Секция 1 */}
      <FormSectionHeader icon={User} title={t("patients.create.sections.personal")} />
      <PersonalInfoSection control={form.control} />

      <Separator />

      {/* Секция 2 */}
      <FormSectionHeader icon={Phone} title={t("patients.create.sections.contact")} />
      <ContactSection control={form.control} />

      <Separator />

      {/* Секция 3 */}
      <FormSectionHeader icon={MapPin} title={t("patients.create.sections.address")} />
      <AddressSection control={form.control} />

      <Separator />

      {/* Секция 4 */}
      <FormSectionHeader icon={Tag} title={t("patients.create.sections.tags")} />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TagsInput
                value={field.value}
                onChange={field.onChange}
                placeholder={t("patients.create.fields.tags-placeholder")}
                hint={t("patients.create.fields.tags-hint")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  </form>
</Form>
```

---

## 12. Слой 9 — CreatePatientModal

### `CreatePatientModal.tsx`

**Ответственность (S из SOLID):**
- Управление `open` состоянием диалога
- Рендер триггер-кнопки
- Рендер `DialogContent` со `ScrollArea`
- Связь `formId` между `<form>` внутри и `<button type="submit" form={formId}>` в footer

```typescript
export const CreatePatientModal: FC<CreatePatientModalProps> = ({
  onPatientCreated,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("common");
  const formId = "create-patient-form";

  const handleSuccess = (patient: Patient) => {
    setOpen(false);
    onPatientCreated?.(patient);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Кнопка-триггер с точными стилями из Patients.tsx */}
        <Button variant="outline" className="flex items-center gap-2 px-6 py-4">
          <Plus className="h-4 w-4" />
          {t("patients.new-patient")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>{t("patients.create.title")}</DialogTitle>
          <DialogDescription>{t("patients.create.description")}</DialogDescription>
        </DialogHeader>

        {/* ScrollArea: форма скроллится, footer фиксирован */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <CreatePatientForm
            formId={formId}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("patients.create.submitting")}
              </>
            ) : (
              t("patients.create.submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

> **Примечание**: `isSubmitting` нужно пробросить из `CreatePatientForm` наверх.  
> Для этого используем `useFormState` или `ref`-коллбэк.  
> Вариант: `CreatePatientForm` принимает `onSubmittingChange?: (v: boolean) => void`  
> и вызывает его в `onSubmit` до/после запроса.

---

## 13. Слой 10 — Интеграция в Patients.tsx

```typescript
// ИЗМЕНИТЬ Patients.tsx

export const Patients: FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await PatientsService.getPatients();
      setPatients(response.data);    // ← FIX P0-4: сохраняем данные
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePatientCreated = useCallback((newPatient: Patient) => {
    // Prepend — не нужен рефетч: новый пациент сразу в списке
    setPatients((prev) => [newPatient, ...prev]);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <CreatePatientModal onPatientCreated={handlePatientCreated} />
      </div>
      <PatientsFilter />
      <PatientsList patients={patients} isLoading={isLoading} />
    </div>
  );
};
```

> **Бонус**: здесь же исправляется **P0-4** из project-audit — данные теперь сохраняются в state и передаются в `PatientsList`.

---

## 14. UI/UX — Responsive Layout

### Desktop (≥640px)
```
┌──────────────────────────────────────────────────┐
│  New Patient                                  ✕  │  ← DialogHeader
│  Fill in the patient's information...            │
├──────────────────────────────────────────────────┤
│  ● Personal Information                          │
│  ─────────────────────────────────────────────   │
│  First Name *          Last Name *               │  ← 2 cols
│  [_________________]   [_________________]       │
│                                                  │
│  Date of Birth *                                 │  ← full width
│  [📅 Select date      ]                          │
│                                                  │
│  Gender                                          │
│  [Select gender ▾     ]                          │
│                                                  │
│  ● Contact Details                               │
│  ─────────────────────────────────────────────   │
│  Phone                 Email                     │  ← 2 cols
│  [_________________]   [_________________]       │
│                                                  │
│  ● Address                                       │
│  ─────────────────────────────────────────────   │
│  Street                                          │
│  [__________________________________________]    │
│  City                  ZIP                       │  ← 2 cols
│  [_________________]   [_________________]       │
│  Country                                         │
│  [__________________________________________]    │
│                                                  │
│  ● Tags                                          │
│  ─────────────────────────────────────────────   │
│  [tag1 ×] [tag2 ×]                       2/20   │
│  [Add tag and press Enter               ]        │
├──────────────────────────────────────────────────┤
│                      [Cancel]  [Create Patient]  │  ← DialogFooter
└──────────────────────────────────────────────────┘
```

### Mobile (<640px)
- Все поля — `grid-cols-1` (стекаются вертикально)
- `DialogContent` занимает `max-h-[90vh]` с `overflow-y-auto`
- Footer: кнопки `flex-col-reverse` (Cancel снизу) — уже задано в `DialogFooter` из shadcn

### Состояния полей

| Состояние | Стиль |
|-----------|-------|
| Default | `border-input` |
| Focus | `ring-1 ring-ring` (встроено в Input) |
| Error | `border-destructive` + `FormMessage` красным текстом |
| Disabled | `opacity-50 pointer-events-none` |
| Required `*` | `after:content-['*'] after:text-destructive after:ml-1` на `FormLabel` |

---

## 15. Порядок реализации

```
Шаг 1:  public/locales/{en,de,ua}/common.json  ← добавить patients.create.*
Шаг 2:  models/patient.model.ts                ← CreatePatientDto, CreatePatientResponse
Шаг 3:  components/patients/createPatient/types.ts
Шаг 4:  components/patients/createPatient/schema.ts
Шаг 5:  app/api/patients/route.ts             ← добавить POST
Шаг 6:  lib/api/patients.service.ts           ← добавить createPatient()
Шаг 7:  components/ui/date-picker-field.tsx   ← переиспользуемый DatePicker
Шаг 8:  components/patients/createPatient/components/FormSectionHeader.tsx
Шаг 9:  components/patients/createPatient/components/TagsInput.tsx
Шаг 10: components/patients/createPatient/sections/PersonalInfoSection.tsx
Шаг 11: components/patients/createPatient/sections/ContactSection.tsx
Шаг 12: components/patients/createPatient/sections/AddressSection.tsx
Шаг 13: components/patients/createPatient/CreatePatientForm.tsx
Шаг 14: components/patients/createPatient/CreatePatientModal.tsx
Шаг 15: components/patients/Patients.tsx       ← интеграция + FIX P0-4
```

---

## Зависимости

| Пакет | Статус | Использование |
|-------|--------|--------------|
| `react-hook-form` | ✅ установлен | `useForm`, `Controller`, `FormProvider` |
| `@hookform/resolvers` | ✅ установлен | `zodResolver` |
| `zod` | ✅ установлен | Схема валидации |
| `libphonenumber-js` | ✅ установлен | `isValidPhoneNumber` |
| `date-fns` | ✅ установлен | Форматирование даты |
| `react-i18next` | ✅ установлен | `useTranslation` |
| `lucide-react` | ✅ установлен | Иконки: `Plus`, `User`, `Phone`, `MapPin`, `Tag`, `CalendarIcon`, `Loader2` |
| `@radix-ui/react-dialog` | ✅ установлен | Через `components/ui/dialog.tsx` |
| `@radix-ui/react-select` | ✅ установлен | Через `components/ui/select.tsx` |

> **Новых зависимостей устанавливать не нужно.**
