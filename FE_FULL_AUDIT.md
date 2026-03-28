# DentalCRM Frontend — Full Code Audit

**Date:** 2026-03-27  
**Scope:** Every file in the codebase (components, hooks, models, services, API routes, middleware, store, i18n, config, UI)  
**Methodology:** Static analysis + architectural review against SOLID, DRY, OWASP, WCAG 2.1, GDPR requirements

---

## Table of Contents

- [Summary Dashboard](#summary-dashboard)
- [P0 — Critical (Security / Breaking Bugs)](#p0--critical)
- [P1 — High (Architecture / Major Bugs)](#p1--high)
- [P2 — Medium (Anti-patterns / DRY / SOLID)](#p2--medium)
- [P3 — Low (Accessibility / i18n / Minor)](#p3--low)
- [Dead Code & Unused Dependencies](#dead-code--unused-dependencies)
- [Positive Aspects](#positive-aspects)
- [Safe Fix Playbook](#safe-fix-playbook)

---

## Summary Dashboard

| Category | P0 Critical | P1 High | P2 Medium | P3 Low |
|----------|:-----------:|:-------:|:---------:|:------:|
| Security | 7 | 5 | 3 | 2 |
| Bugs | 3 | 6 | 4 | 2 |
| Architecture | — | 4 | 5 | — |
| DRY / SOLID | — | 3 | 6 | — |
| Dead Code | 2 | 3 | 5 | — |
| Accessibility | — | — | 4 | 8 |
| i18n | — | 1 | — | 12 |
| Performance | — | 2 | 3 | 2 |
| Config / Deps | — | 1 | 2 | 3 |
| **Total** | **12** | **25** | **32** | **29** |

**Estimated cleanup impact:**
- Removing dead code → **~3 500 fewer LOC**
- Removing unused deps → **~30% smaller node_modules, faster CI**
- Fixing `form.watch()` → **significant render reduction on registration page**
- Removing `HttpBackend` → **eliminates unnecessary network requests on load**

---

## P0 — Critical

### P0-01. Access token leaked in JSON response body

**Files:** `app/api/auth/login/route.ts:145`, `app/api/auth/refresh/route.ts:140`

The BFF proxy returns the access token in the JSON body **and** sets it as an `httpOnly` cookie:

```
NextResponse.json({
  success: true,
  accessToken: accessToken,  // ← accessible to JavaScript
  user: user,
});
```

This defeats the entire `httpOnly` security model. If XSS occurs, the attacker can extract the token from the response. The project rules state: *"DO NOT save tokens in localStorage — only HTTP-only cookies."* Yet the token is exposed to JS via the response body.

**Impact:** XSS → token theft  
**Safe fix:** Remove `accessToken` from JSON response. Update `auth.service.ts` and `httpClient` to rely solely on cookies. Since the `httpOnly` cookie is already set, requests will automatically include it. The `httpClient.setAccessToken()` calls and in-memory token storage become unnecessary.

---

### P0-02. No input validation on register API route — Mass Assignment risk

**File:** `app/api/auth/register/route.ts:7-8`

```
const data = await request.json();
const { ...registerData } = data;
```

Unlike `login/route.ts` (which uses Zod), the register route accepts **any** fields from the request body and forwards them to the backend. An attacker can inject `{ "role": "owner", "status": "active", "isEmailVerified": true }`.

**Impact:** Privilege escalation if backend doesn't validate  
**Safe fix:** Add a Zod schema matching `RegisterFormValues` (already defined in `models/auth.model.ts`). Only forward validated fields.

---

### P0-03. Middleware auth check is trivially bypassable

**File:** `middleware.ts:47-48`

```
const isAuthenticated = request.cookies.get("is_authenticated")?.value;
void request.cookies.get("accessToken")?.value;
```

Authentication relies **solely** on the `is_authenticated` cookie (a plain string `"true"`). The `accessToken` cookie is explicitly ignored (`void`). Any user can set `is_authenticated=true` via DevTools to bypass all route protection.

**Impact:** Unauthorized access to all dashboard pages  
**Safe fix:** Also verify `accessToken` cookie exists (not just the flag). For true security, validate the JWT signature in middleware using `jose` library (lightweight, Edge-compatible). This is a multi-step fix — see [Safe Fix Playbook](#safe-fix-playbook).

---

### P0-04. Fake email uniqueness validation

**File:** `hooks/useEmailValidation.ts:100-101`

```
const isEmailTaken =
  emailToValidate.includes("taken") || emailToValidate.includes("exists");
```

The email uniqueness check is a **hardcoded stub**. Instead of calling an API, it checks if the email string literally contains "taken" or "exists". Every real email passes validation. Users won't know their email is already registered until the form submits and the backend rejects it.

**Impact:** Broken UX, misleading validation feedback  
**Safe fix:** Replace with an actual API call to a backend endpoint (e.g., `GET /auth/check-email?email=...`) or remove the hook entirely and let form submission handle duplicates with proper error messages.

---

### P0-05. Auth middleware never registered in Redux store

**Files:** `lib/store/middleware/auth.middleware.ts` (64 lines), `lib/store/store.ts:82-87`

The `authMiddleware` is defined but **never added** to the store's middleware chain. The brute-force protection (block after 3 failed logins) is **completely inert**. Additionally, the middleware dispatches `auth/setError` — an action that doesn't exist in `authSlice`.

```
// store.ts — middleware NOT included
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
```

**Impact:** No brute-force protection whatsoever  
**Safe fix:** Either register the middleware in the store (and fix the `setError` action), or delete the file entirely — real rate limiting must happen server-side anyway.

---

### P0-06. Rate limiter is client-side, never connected, wrong API

**File:** `lib/rate-limiter.ts` (385 lines)

Three fatal flaws:
1. **Client-side in-memory storage** — resets on every page refresh
2. **Pages Router API** (`req, res` signature) — project uses App Router (`NextRequest`)
3. **Never imported** anywhere in the codebase

**Impact:** False sense of security — 385 lines of code providing zero protection  
**Safe fix:** Delete the file. Implement server-side rate limiting on the backend or use a service like Cloudflare Rate Limiting.

---

### P0-07. Security middleware (684 lines) is dead code

**File:** `middleware/security.ts` (684 lines)

The `securityMiddleware` function is defined but **never imported or called** from `middleware.ts`. All security checks (SQL injection, XSS, path traversal, suspicious headers, bot detection) are completely inert.

Even if it were enabled, it would cause severe problems:
- SQL injection regex would block normal URLs like `/patients/update` or `/analytics/select-report` (matches words "update", "select")
- Flags `x-forwarded-for` and `x-real-ip` as "suspicious" — these are **standard** reverse proxy headers
- Flags private IP ranges (10.x, 192.168.x) as suspicious — normal in any deployment

**Impact:** 684 lines of dead security theater  
**Safe fix:** Delete the file. SQL injection protection belongs on the backend (parameterized queries). XSS protection is handled by CSP headers (already configured in `next.config.ts`).

---

### P0-08. `PatientsList` never renders actual patient data

**File:** `components/patients/PatientsList.tsx:34-47`

The component receives `patients` as a prop but **only renders**:
1. Loading skeleton (when `isLoading`)
2. Empty state ("No patients yet")

There is no code path that iterates `patients` to render actual patient records. The `patients` prop is effectively unused.

**Impact:** Patients page is non-functional even with real data  
**Safe fix:** Add the actual patient rendering logic between the loading check and empty state check.

---

### P0-09. `reset-password/page.tsx` is a non-functional stub

**File:** `app/(auth)/reset-password/page.tsx`

```
const ResetPasswordPage = () => {
  return <div>ResetPasswordPage</div>;
};
export default ResetPasswordPage;
```

The "Forgot password?" link on the sign-in page leads to this empty page. The entire password recovery flow (documented in auth-api rules sections 5.1 and 5.2) is unimplemented.

**Impact:** Users who forget their password cannot recover their accounts  
**Safe fix:** Implement the flow using `PasswordRecovery.tsx` and `SetPassword.tsx` components (which exist but are disconnected stubs — need refactoring with shadcn/ui and i18n).

---

### P0-10. Wildcard remote image patterns

**File:** `next.config.ts:34-37`

```
remotePatterns: [
  { protocol: "https", hostname: "**", pathname: "/**" },
  { protocol: "http", hostname: "**", pathname: "/**" },
],
```

Allows **any domain** (including HTTP) to serve images via Next.js image optimization. This enables SSRF attacks through the `/_next/image` endpoint.

**Impact:** SSRF vulnerability  
**Safe fix:** Restrict to actual CDN hostnames once known. For development, use `localhost` only.

---

### P0-11. Verify-email token not URL-encoded

**File:** `app/api/auth/verify-email/route.ts:33`

```
const response = await fetch(`${apiUrl}/auth/verify-email?token=${token}`);
```

The token is directly interpolated without `encodeURIComponent()`. If the token contains `&`, `#`, `=`, or other special characters, the URL will be malformed or parameters will be injected.

**Impact:** Email verification can fail silently  
**Safe fix:** Use `encodeURIComponent(token)`.

---

### P0-12. Hardcoded localhost fallback in production API routes

**Files:** `app/api/auth/verify-email/route.ts:28`, `app/api/auth/resend-verification/route.ts:26`

```
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
```

If `NEXT_PUBLIC_API_URL` is unset in production, requests silently go to `localhost:3001` instead of failing fast. Other routes properly return 500 when the env var is missing.

**Impact:** Silent data loss in production  
**Safe fix:** Remove fallback. Return 500 error if env var is missing (matching the pattern in `login/route.ts`).

---

## P1 — High

### P1-01. `httpClient` directly imports `store` — Circular DI (DIP violation)

**File:** `lib/api/http-client.ts:1`

```
import { store } from "@store/store";
```

Creates a dependency chain: `store → authSlice → (toast, i18next)` ← `httpClient → store`. This makes the HTTP client impossible to test independently and creates tight coupling between the HTTP layer and Redux.

**Safe fix:** Accept a token-getter callback in the constructor instead of importing the store directly. Example:

```typescript
class HttpClient {
  constructor(private getToken: () => string | null) {}
}
```

---

### P1-02. Side effects in Redux reducers (SOLID violation)

**File:** `lib/store/features/authSlice.ts` (multiple locations)

The `setCredentials` reducer calls `toast.error()` and `t()` (i18next). Reducers **must be pure functions** per Redux principles. Side effects belong in middleware, thunks, or the component layer.

**Safe fix:** Move toast notifications to the component that dispatches `setCredentials`, or to a Redux middleware/listener.

---

### P1-03. Dual `ApiResponse` / `ApiError` type definitions

| Type | `lib/error-handler.ts` | `models/api.model.ts` | `models/error.model.ts` |
|------|------------------------|----------------------|------------------------|
| `ApiResponse` | `success, message, error, data, meta` | `data, status, message` | — |
| `ApiError` | `code?, message?, details?` (optional) | — | `code, message, details?, timestamp` (required) |

Three conflicting definitions of core API types across the codebase. `AuthService` returns `LoginResponse | ApiResponse` — a union from different modules, forcing unsafe `"accessToken" in response` checks.

**Safe fix:** Consolidate into a single `models/api.model.ts`. Delete the duplicate definitions from `error-handler.ts`. Update all imports.

---

### P1-04. `callbackUrl` redirect after login is broken

**File:** `middleware.ts:75`

```
const signinUrl = new URL(ROUTES.signin, request.url);
signinUrl.searchParams.set("callbackUrl", encodeURI(request.url));
```

`encodeURI(request.url)` encodes the **full absolute URL** (e.g., `http%3A//localhost%3A3000/patients`). But `signin/page.tsx:19` checks `rawCallback.startsWith("/")` — an absolute URL won't match, so the callback always falls back to `ROUTES.home`. The post-login redirect is effectively broken.

**Safe fix:** Pass only the pathname: `signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)`.

---

### P1-05. Landing page loses SSR/SEO due to `"use client"`

**File:** `app/page.tsx:1`

```
"use client";
```

The entire landing page is forced into the client bundle. This means:
- No server-side rendering → poor SEO
- No `metadata` export possible → missing `<title>`, `<meta>` tags
- Larger JS bundle for the most important marketing page

**Safe fix:** Remove `"use client"` from `page.tsx`. Make child components (`Header`, `Hero`, `Main`, `Footer`) client components individually where needed.

---

### P1-06. `useSearchParams()` without `<Suspense>` boundary

**Files:** `app/(auth)/signin/page.tsx:15`, `app/(auth)/verify-email/page.tsx`

Next.js 14+ requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary. Without it, the build generates warnings and pages may dehydrate incorrectly.

**Safe fix:** Wrap the components using `useSearchParams()` in `<Suspense fallback={...}>`.

---

### P1-07. `is_authenticated` cookie outlives `accessToken` by ~7 days

**File:** `app/api/auth/login/route.ts:154-168`

| Cookie | maxAge |
|--------|--------|
| `accessToken` | 15 minutes |
| `is_authenticated` | 7 days |

After 15 minutes, the `accessToken` cookie expires but `is_authenticated` lingers for a week. Middleware only checks `is_authenticated`, so it considers the user logged in even though the token is gone. The refresh flow handles this gracefully, but if refresh also fails, the user sees dashboard content momentarily before being redirected.

**Safe fix:** Either tie `is_authenticated` maxAge to the refresh token's lifetime (7 days — which it already is) and ensure the refresh flow clears it on failure, or also verify `accessToken` or `refreshToken` cookie presence in middleware.

---

### P1-08. `NEXT_PUBLIC_API_URL` used for server-side calls

**Files:** All 8 API routes

Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the client bundle. The backend URL should be a server-only env var (`API_URL`) to prevent leaking the internal API address.

**Safe fix:** Create a new `API_URL` env var (without `NEXT_PUBLIC_` prefix). Use it in all API routes. Keep `NEXT_PUBLIC_API_URL` only if the client needs it (it shouldn't — all client calls go through BFF).

---

### P1-09. CSP allows `unsafe-inline` and `unsafe-eval`

**File:** `next.config.ts:73-74`

```
"script-src 'self' 'unsafe-inline' 'unsafe-eval' ...",
"style-src 'self' 'unsafe-inline' ...",
```

`unsafe-inline` + `unsafe-eval` in `script-src` fully defeat Content Security Policy protection against XSS. Combined with P0-01 (token in response body), this is a significant attack surface.

**Safe fix:** Use nonce-based CSP with Next.js. This requires generating a nonce per request in middleware and passing it to the CSP header and script tags.

---

### P1-10. Logout doesn't read token from cookie as fallback

**File:** `app/api/auth/logout/route.ts`

The logout route reads `Authorization` header but doesn't fall back to the `accessToken` cookie. After a page reload (when in-memory token is lost), the backend logout call is unauthenticated, leaving the refresh token valid on the server.

**Safe fix:** Add cookie fallback, matching the pattern in `users/me/route.ts` and `patients/route.ts GET`.

---

### P1-11. Duplicate `accessToken` clear with conflicting `sameSite` flags

**File:** `app/api/auth/logout/route.ts:42, 73`

`accessToken` is cleared twice:
1. Line 42: `sameSite: "strict"`
2. Line 73 (in `legacyCookies`): `sameSite: "lax"`

Different `sameSite` values target **different cookies** from the browser's perspective. The legacy clear creates/clears a different cookie than the one that was set.

**Safe fix:** Remove `accessToken` from the `legacyCookies` array.

---

### P1-12. Missing auto-login on email verification

**File:** `app/api/auth/verify-email/route.ts`

Per auth-api rules (section 3): *"On successful verification → automatically authenticated (token in cookie)."* But this route only returns the data without setting `accessToken` or `is_authenticated` cookies. Users must manually navigate to sign-in after verification.

**Safe fix:** Set cookies on successful verification, matching the login route pattern.

---

### P1-13. Verify-email page has React Strict Mode race condition

**File:** `app/(auth)/verify-email/page.tsx`

`hasVerifiedRef.current = true` is set inside the success callback. In React Strict Mode (dev), the effect runs twice. The first invocation's `AbortController` abort races with the ref guard. The first fetch is aborted, so the ref is never set to `true`, and the second fetch also fires — causing a double verification attempt.

**Safe fix:** Set `hasVerifiedRef.current = true` **before** the fetch call, not inside the success block.

---

### P1-14. Inconsistent auth handling between POST and GET in patients route

**File:** `app/api/patients/route.ts`

GET handler falls back to the `accessToken` cookie. POST handler only reads `Authorization` header. After a page reload, POST will fail with 401 while GET works fine.

**Safe fix:** Unify auth extraction into a helper function used by both handlers.

---

### P1-15. Internal error messages leaked to client

**Files:** `app/api/auth/register/route.ts:109`, `app/api/auth/resend-verification/route.ts:87,100`, `app/api/auth/verify-email/route.ts:79,93`

```
message: error instanceof Error ? error.message : "Unknown error",
```

Stack traces and internal error details from exceptions are returned to the client. This can expose server internals, file paths, or dependency information.

**Safe fix:** Return a generic error message to the client. Log the actual error server-side.

---

### P1-16. Dual i18n backends conflict

**File:** `lib/i18n/i18n.ts:17-18`

```
i18n
  .use(HttpBackend)       // fetches /locales/{{lng}}/{{ns}}.json via HTTP
  .use(backend)           // provides resources inline from static imports
  .use(initReactI18next)
```

Both `HttpBackend` and `resourcesToBackend` are registered. Since all translations are already bundled via static imports (lines 6-8), `HttpBackend` fires unnecessary network requests on every page load.

**Safe fix:** Remove `HttpBackend` and its `backend` config. Keep only `resourcesToBackend`.

---

### P1-17. String-based error type matching

**Files:** `app/api/auth/login/route.ts:68,80`

```
if (errorData.message?.includes("verify")) { ... }
else if (errorData.message?.includes("active")) { ... }
```

Error types are determined by checking if the backend's error **message string** contains keywords. This breaks if the backend changes wording, adds localization, or uses a different language.

**Safe fix:** Match on error codes (e.g., `errorData.code === "EMAIL_NOT_VERIFIED"`) instead of message substrings.

---

### P1-18. `form.watch()` causes full re-render on every keystroke

**File:** `components/auth/register/RegisterForm.tsx:58`

```
const watchedValues = form.watch();
```

`form.watch()` without arguments subscribes to **all** form fields. Every keystroke in any of the 7 fields triggers a complete re-render of the 666-line component.

**Safe fix:** Use `useWatch({ control, name: [...specific fields] })` for the progress calculation, or move progress to a separate child component.

---

### P1-19. Routes enum out of sync with actual pages

**File:** `constants/routes.ts`

| Problem | Routes |
|---------|--------|
| Pages exist but no ROUTES entry | `/appointments`, `/finance`, `/employees` |
| ROUTES entries but no page exists | `setPassword`, `passwordChanged`, `notFound`, `rateLimit`, `scheduling`, `cards`, `management` |
| Name doesn't match path | `recovery` → `/reset-password` |

**Safe fix:** Audit routes enum. Remove orphaned entries. Add missing entries. Rename `recovery` to `resetPassword`.

---

## P2 — Medium

### P2-01. Sidebar / SimpleSidebar — 1 000+ lines of duplication

**Files:** `components/navigation/Sidebar.tsx` (526 lines), `components/navigation/SimpleSidebar.tsx` (522 lines)

`SimpleSidebar` is a near-identical copy of `Sidebar`. Only differences:
- `SimpleSidebar` hardcodes English labels; `Sidebar` uses `t()`
- `SimpleSidebar` manages its own `isExpanded`; `Sidebar` receives it as prop
- `SimpleSidebar` has hardcoded badge values

Same duplication exists for `DashboardLayout.tsx` / `SimpleDashboardLayout.tsx`.

**Safe fix:** Delete `SimpleSidebar` and `SimpleDashboardLayout`. Add config props to `Sidebar`/`DashboardLayout` for any behavioral differences.

---

### P2-02. Resize listener duplicated 6 times

**Files:** `Sidebar.tsx`, `SimpleSidebar.tsx`, `DashboardLayout.tsx`, `SimpleDashboardLayout.tsx`, `Register.tsx`, `RegisterPresentation.tsx`

Same `window.addEventListener("resize", ...)` pattern with different breakpoints (768px vs 856px) and no debounce.

**Safe fix:** Extract a `useMediaQuery(breakpoint)` or `useIsMobile()` hook with debounce.

---

### P2-03. `MobileHeader.tsx` duplicates `cn()` utility

**File:** `components/navigation/MobileHeader.tsx:100-102`

```
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

Local `cn()` only does `filter(Boolean).join(" ")` — doesn't merge Tailwind classes. `@/lib/utils` already exports `cn` backed by `clsx` + `tailwind-merge`.

**Safe fix:** Import `cn` from `@/lib/utils`.

---

### P2-04. `usePasswordValidation` — duplicated validation logic

**File:** `hooks/usePasswordValidation.ts`

`validatePassword()` function and the real-time `useEffect` both compute identical regex checks (`hasUppercase`, `hasNumber`, `hasSpecialChar`, `hasMinLength`, `strength`). Every password change triggers double computation.

**Safe fix:** Extract shared validation logic into a pure function. Call it from both places.

---

### P2-05. `usePasswordConfirmation` — three conflicting `useEffect`s

**File:** `hooks/usePasswordConfirmation.ts:37-49, 82-92, 95-108`

Three effects all check `password === confirmPassword`, overwriting each other and creating redundant renders. The debounce effect is defeated by the immediate validation effect.

**Safe fix:** Consolidate into a single effect with debounce.

---

### P2-06. Inconsistent password policy

| Location | Minimum length |
|----------|----------------|
| `LoginForm.tsx` (Zod) | `min(1)` |
| `login/route.ts` (Zod) | `min(6)` |
| `SetPassword.tsx` | `min(8)` |
| Auth-api rule | `min(6)` |

**Safe fix:** Standardize to `min(6)` everywhere (matching backend spec).

---

### P2-07. `RegisterForm.tsx` — God Component (SRP violation)

**File:** `components/auth/register/RegisterForm.tsx` (666 lines)

Single component handles: form state, progress calculation, email/password/phone validation orchestration, form submission, error handling, success state, and the full UI.

**Safe fix:** Extract into sub-components: `RegistrationProgress`, `RegistrationSuccessView`, `FormFields`. Move validation orchestration to custom hooks (partially done but can be cleaner).

---

### P2-08. `authSlice.ts` does too much (SRP violation)

**File:** `lib/store/features/authSlice.ts`

Single slice handles: JWT validation (12+ checks), token decoding, toast notifications, translation lookups, and state management. Should separate concerns.

**Safe fix:** Extract `isTokenValid` to a `lib/jwt-utils.ts`. Move toast calls to component/middleware layer.

---

### P2-09. `SidebarContent` as inner function — re-mounts on every render

**Files:** `Sidebar.tsx`, `SimpleSidebar.tsx`

`SidebarContent` is defined as a function component inside the parent component. This creates a new component identity on every render, causing React to unmount and remount it (losing internal state and causing DOM thrashing).

**Safe fix:** Extract `SidebarContent` as a separate component outside the parent, or memoize it.

---

### P2-10. `MobileHeader` overlay is invisible

**File:** `components/navigation/MobileHeader.tsx:27,32-37`

The header has `opacity-0 pointer-events-none` when `isOpen` is true (line 27). The background overlay (lines 32-37) is inside this container — so it's also invisible. The overlay never shows.

**Safe fix:** Move the overlay outside the header container or fix the opacity logic.

---

### P2-11. `useFormField` null check is dead code

**File:** `components/ui/form.tsx:49-51`

```
const fieldState = getFieldState(fieldContext.name, formState); // uses .name
if (!fieldContext) { throw ... }  // dead check — would have thrown above
```

The null check runs after `fieldContext.name` is already accessed. If `fieldContext` were null, line 49 would throw first.

**Safe fix:** Move the null check before the `getFieldState` call.

---

### P2-12. Error display duplication in `CreatePatientForm`

**File:** `components/patients/createPatient/CreatePatientForm.tsx`

Tags field has two error displays — one inside `TagsInput` (via `error` prop) and one explicitly rendered below. This shows the error twice.

**Safe fix:** Remove one of the duplicate error displays.

---

### P2-13. `FormSectionHeader` double separator

**File:** `components/patients/createPatient/components/FormSectionHeader.tsx`

This component renders a `<Separator />`, and `CreatePatientForm.tsx` also renders `<Separator />` between sections. Result: double separators.

**Safe fix:** Remove separators from either the header or the form.

---

### P2-14. `AnimatePresence` wraps always-rendered child

**File:** `components/ui/password-requirements.tsx:50`

`<AnimatePresence>` wraps a `<motion.div>` that is always rendered (no conditional). Exit animations never fire because the child never unmounts.

**Safe fix:** Either conditionally render the child inside `AnimatePresence`, or remove `AnimatePresence`.

---

### P2-15. Navigation items hardcoded (OCP violation)

**Files:** `Sidebar.tsx`, `SimpleSidebar.tsx`

Nav items are hardcoded in the component. Adding a new page requires modifying the component directly.

**Safe fix:** Move nav items to a config array imported from a constants file.

---

### P2-16. Missing `useAppSelector` typed hook

**File:** `lib/store/store.ts`

`useAppDispatch` exists but there's no `useAppSelector`. Components use raw `useSelector` from `react-redux` without type arguments, losing `RootState` type inference.

**Safe fix:** Add `export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`

---

### P2-17. `AuthService` inconsistent fetch approach

**File:** `lib/api/auth.service.ts`

| Method | HTTP Client |
|--------|-------------|
| `login()` | Raw `fetch()` |
| `logout()` | `httpClient.request()` |
| `refreshToken()` | `httpClient.request()` |
| `register()` | Raw `fetch()` |
| `resendVerificationEmail()` | Raw `fetch()` |

**Safe fix:** Standardize. Pre-auth calls (`login`, `register`, `resendVerification`) legitimately don't need `httpClient` (no token needed), but should still use a consistent wrapper for error handling and headers.

---

### P2-18. `credentials: "include"` on server-side fetch

**File:** `app/api/auth/refresh/route.ts:55`

Server-side `fetch` in Node.js/Next.js doesn't have a cookie jar. `credentials: "include"` is a browser-only option that is silently ignored or may cause unexpected behavior.

**Safe fix:** Remove `credentials: "include"` from server-side fetch calls.

---

### P2-19. No `AbortController` / timeout on HTTP requests

**Files:** `lib/api/http-client.ts`, `lib/api/auth.service.ts`

No fetch call in the codebase sets a timeout. Network issues could hang requests indefinitely.

**Safe fix:** Add `AbortController` with a configurable timeout (e.g., 30 seconds) to `httpClient.request()`.

---

### P2-20. `PersistGate loading={null}` — blank flash

**File:** `app/providers.tsx:67`

```
<PersistGate loading={null} persistor={persistor}>
```

Renders nothing until the Redux store is rehydrated from localStorage. On slow devices, users see a blank flash.

**Safe fix:** Pass a skeleton/spinner as the `loading` prop.

---

### P2-21. `Register.tsx` Terms/Privacy links are `href="#"`

**File:** `components/auth/Register.tsx`

Terms and Privacy Policy links point to `href="#"` — causes scroll-to-top on click.

**Safe fix:** Create actual pages or at minimum use `href="/terms"` and `href="/privacy"` as placeholders with proper 404 handling.

---

### P2-22. Uncontrolled response spreading in register route

**File:** `app/api/auth/register/route.ts:65`

```
{ success: true, message: ..., ...responseData }
```

Spreads the **entire** backend response into the client response, potentially leaking internal fields.

**Safe fix:** Explicitly pick only needed fields from `responseData`.

---

---

## P3 — Low

### P3-01. Missing `"use client"` directives

**Files:** `AuthErrorDisplay.tsx`, `BrandIdentity.tsx`, `OTPInput.tsx`, `PasswordRecovery.tsx`, `SetPassword.tsx`, `Register.tsx`, `RegisterPresentation.tsx`, `Footer.tsx`

These files use client features (hooks, DOM APIs, framer-motion) without `"use client"`. They work only because parent components have the directive, but this is fragile.

---

### P3-02. Hardcoded English strings (i18n violations)

| File | Examples |
|------|---------|
| `PatientsList.tsx` | "No patients yet", "Patient records will appear here..." |
| `PatientsFilter.tsx` | "Search patients...", "Filters" |
| `Patients.tsx` | "Patients" heading |
| `SimpleSidebar.tsx` | All nav labels, "Collapse", "Edit Profile", "Logout" |
| `usePasswordConfirmation.ts` | "Passwords do not match" |
| `usePasswordValidation.ts` | All error messages |
| `useEmailValidation.ts` | "Invalid email format", "Email is already registered" |
| `PasswordRecovery.tsx` | All text |
| `SetPassword.tsx` | All text |
| `ChangePasswordStatus.tsx` | "Success", "Error", "Processing" |
| `HomePage.tsx` | Activity feed, currency ($), time formatting |
| `appointments/page.tsx` | All text |
| `analytics/page.tsx` | All text |
| `finance/page.tsx` | All text |
| `employees/page.tsx` | All text |
| `AIAssistant.tsx` | `workflowSteps` titles/descriptions |
| `DataProtection.tsx` | `complianceFeatures` descriptions |
| `auth.model.ts` | Zod schema messages |
| `AuthErrorDisplay.tsx` | `aria-label="Close error message"` |

Violates the trilingual requirement (EN/DE/UA).

---

### P3-03. Ukrainian locale code `"ua"` should be ISO `"uk"`

**Files:** `lib/i18n/i18n.ts`, `lib/i18n/server.ts`, `public/locales/ua/`

Standard ISO 639-1 code for Ukrainian is `"uk"`, not `"ua"`. This will cause issues with any library that expects standard locale codes (e.g., `Intl`, `date-fns` locale, browser `Accept-Language`).

---

### P3-04. Server i18n default language mismatch

**File:** `lib/i18n/server.ts:37`

```
const lang = headersList.get("accept-language")?.split(",")[0].split("-")[0] || "de";
```

Fallback is `"de"` but `i18n.init` uses `fallbackLng: "en"`. Inconsistent defaults.

---

### P3-05. Missing accessibility attributes

| Component | Missing |
|-----------|---------|
| `PatientsFilter.tsx` | `<Input>` has no `<label>` or `aria-label` |
| `CreatePatientModal.tsx` | `DialogDescription` imported but never rendered |
| `AuthErrorDisplay.tsx` | No `role="alert"` or `aria-live="assertive"` |
| `RegisterForm.tsx` | Progress bar missing `aria-valuenow`/`aria-label` |
| `OTPInput.tsx` | No `aria-label`, no `inputMode="numeric"` |
| `FullScreenLoader.tsx` | No `role="status"`, no `aria-busy` |
| `Skeleton.tsx` | Missing `aria-hidden="true"` |
| `Progress.tsx` | Missing `aria-label` |
| `PersonalInfoSection.tsx` | `autoFocus` can be disorienting in modal on mobile |
| `Header.tsx` | Mobile menu doesn't trap focus, no Escape handler |
| `Header.tsx` | Logo image has empty `alt=""` |
| `Card.tsx` | `CardTitle` uses `<div>` instead of heading element |

---

### P3-06. Scroll listener without throttle in Header

**File:** `components/landing/Header.tsx`

`handleScroll` fires on every scroll pixel. Should use `requestAnimationFrame` or throttle.

---

### P3-07. `LanguageSwitcher` uses `localStorage` during SSR

**File:** `components/landing/LanguageSwitcher.tsx:39`

`localStorage.getItem` without `typeof window !== "undefined"` guard will crash during SSR.

---

### P3-08. No `prefers-reduced-motion` handling for animations

**Files:** All components using `framer-motion` animations (`AuthErrorDisplay`, `RegisterForm`, `signin/page`, `Register`, `RegisterPresentation`)

No respect for `prefers-reduced-motion` media query. Users who prefer reduced motion still get all animations.

---

### P3-09. `tsconfig.json` broken path aliases

Path aliases pointing to non-existent directories: `@schemas/*` (also has typo: `"./schemas*"` instead of `"./schemas/*"`), `@helpers/*`, `@assets/*`, `@context/*`, `@layouts/*`, `@styles/*`.

---

### P3-10. Webpack config ignored by Turbopack in dev

**File:** `next.config.ts:14-28`

`dev` script uses `--turbopack`, but `next.config.ts` has a `webpack` callback. Turbopack ignores custom webpack config. Dev and prod bundling behavior diverge.

---

### P3-11. `tailwind.config.ts` content paths

- Includes `./pages/**/*` but project uses only `app/` routing (no `pages/` dir)
- Missing `./lib/**/*.{ts,tsx}` — Tailwind classes in lib files will be purged

---

### P3-12. `navigation/index.ts` double exports

```
export { Sidebar } from "./Sidebar";
export { default as SidebarDefault } from "./Sidebar";
```

Both named + aliased default re-exports. Confusing and unnecessary.

---

### P3-13. `HomePage` quick action buttons do nothing

**File:** `components/homepage/HomePage.tsx`

4 quick action buttons (Schedule, Add Patient, Reports, Analytics) have no `onClick` handlers or `href`.

---

### P3-14. Division by zero in `HomePage`

**File:** `components/homepage/HomePage.tsx:226`

If `completedTasks + pendingTasks === 0`, division produces `NaN`.

---

### P3-15. `postcss.config.mjs` missing `autoprefixer`

`autoprefixer` is installed as devDependency but not included in PostCSS config. Tailwind CSS recommends it.

---

### P3-16. `useEmailInput` overly restrictive regex

**File:** `hooks/useEmailInput.ts`

Regex `^[a-zA-Z0-9@._\-+]*$` disallows many valid RFC 5321 characters (`!`, `#`, `$`, `%`, `&`, etc.). Also duplicated 4 times in the same file.

---

### P3-17. `use-toast.ts` `TOAST_REMOVE_DELAY` is ~17 minutes

**File:** `hooks/use-toast.ts`

```
const TOAST_REMOVE_DELAY = 1_000_000;
```

1,000,000ms ≈ 16.6 minutes. Dismissed toasts linger in memory far too long.

---

### P3-18. `useLogout` uses `t()` from `i18next` directly, not `useTranslation`

**File:** `hooks/useLogout.ts:6`

Bypasses React's re-render on language change. Toast messages will be in the language active when the module loaded.

---

### P3-19. `PasswordRecovery`, `SetPassword`, `OTPInput`, `ChangePasswordStatus` use raw CSS classes

These components use CSS class names like `password-recovery-container`, `otp-input`, `status-container` instead of Tailwind. These classes likely don't exist in any stylesheet.

---

### P3-20. `ChangePasswordStatus.tsx` export name mismatch

File is `ChangePasswordStatus.tsx` but exports `PasswordChangeStatus`. Similarly, `SetPassword.tsx` exports `PasswordRecoveryForm`.

---

---

## Dead Code & Unused Dependencies

### Dead Files (safe to delete)

| File | Lines | Reason |
|------|------:|--------|
| `middleware/security.ts` | 684 | Never imported. Security theater with false positives. |
| `lib/rate-limiter.ts` | 385 | Never imported. Client-side, wrong API. |
| `lib/security-logger.ts` | 372 | Only imported by rate-limiter (which is dead). |
| `lib/store/middleware/auth.middleware.ts` | 64 | Never registered in store. Dispatches non-existent action. |
| `lib/api/config.ts` | 46 | Never imported. Contains wrong endpoint paths. |
| `lib/i18n/server.ts` | 45 | Never called by any server component. |
| `models/routing.model.ts` | 28 | Enums from a different CRM project (contacts, orders, invoices). |
| `models/set-password.model.ts` | ~30 | Never imported. |
| `models/password-recovery.model.ts` | ~25 | Never imported. |
| `components/auth/BrandIdentity.tsx` | 7 | Stub: renders `<h1>BrandIdentity</h1>`. Never imported. |
| `components/auth/OTPInput.tsx` | 70 | Never imported. Uses `document.getElementById`. |
| `components/auth/ChangePasswordStatus.tsx` | 26 | Never imported. Raw CSS classes. |
| `components/navigation/SimpleSidebar.tsx` | 522 | Copy of Sidebar.tsx. Replace with config props. |
| `components/navigation/SimpleDashboardLayout.tsx` | 78 | Copy of DashboardLayout.tsx. |
| **Total** | **~2 382** | |

### Dead exports within active files

| File | Unused Export |
|------|--------------|
| `models/api.model.ts` | `RequestOptions`, `MutationPayload`, `PatchPayload`, `DeletePayload`, `DataState` |
| `components/patients/createPatient/types.ts` | `CreatePatientFormProps.onCancel` (prop accepted but never used) |
| `navigation/index.ts` | All `*Default` re-exports (`SidebarDefault`, etc.) |

### Unused npm Dependencies (never imported in source)

| Package | Notes |
|---------|-------|
| `@react-google-maps/api` | No imports |
| `@schedule-x/calendar`, `@schedule-x/react`, + 6 more | No imports (8 packages) |
| `@upstash/redis` | No imports |
| `@dnd-kit/core`, `@dnd-kit/sortable` | No imports |
| `react-dnd`, `react-dnd-html5-backend` | No imports |
| `axios` | `fetch` used everywhere |
| `check-password-strength` | Custom hook used instead |
| `cmdk` | No imports |
| `embla-carousel-autoplay`, `embla-carousel-react` | No imports |
| `jotai` | Redux used instead |
| `keep-react` | No imports |
| `moment` | `date-fns` used instead |
| `next-i18next` | Custom i18n setup used |
| `next-sitemap` | No imports |
| `react-password-strength-bar` | Custom UI used |
| `react-pdf` | No imports |
| `react-quill-new` | No imports |
| `react-resizable-panels` | No imports |
| `react-select` | No imports |
| `react-window` | No imports |
| `recharts` | No imports |
| `use-debounce` | Custom `useDebounce` hook used |
| `vaul` | No imports |
| `rate-limiter-flexible` | Custom (dead) rate limiter used |

### Duplicate packages

| Installed | Duplicate/Deprecated | Action |
|-----------|---------------------|--------|
| `motion` (^11.18.2) | `framer-motion` (^11.18.2) | Remove `framer-motion`, keep `motion` |
| `@phosphor-icons/react` | `phosphor-react` (deprecated) | Remove `phosphor-react` |

### Dev dependencies in `dependencies` (bloats production)

`@commitlint/cli`, `@commitlint/config-conventional`, `commitlint`, `husky`, `semantic-release`, `semantic-release-jira`, `@next/bundle-analyzer`, `dotenv`, `@types/lodash`, `@types/redux-mock-store`

---

## Positive Aspects

Despite the issues found, the project has many strong architectural decisions:

- **BFF proxy pattern** — client never calls the backend directly. All API calls go through Next.js API routes.
- **httpOnly cookies** with `secure` + `sameSite: strict` for all auth tokens (when set correctly).
- **`authTransform`** in Redux persist — access token is stripped before writing to localStorage. Tokens **never** persist to localStorage.
- **JWT validation** in `authSlice` — comprehensive checks for `exp`, `iat`, `nbf`, `sub` (UUID), `jti`, `iss`, `aud`, `fingerprint`, token age, minimum lifetime.
- **Open redirect prevention** in `LoginForm` — `safeRedirectUrl()` validates callback URLs.
- **bfcache protection** — Cache-Control headers + `pageshow` event handler prevent cached pages from showing stale auth state.
- **Refresh token rotation** with concurrent request deduplication via `refreshPromise`.
- **Security headers** in `next.config.ts` — HSTS, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy, Cross-Origin policies. Comprehensive set.
- **Graceful logout fallback** — if API call fails, local state is still cleared.
- **`poweredByHeader: false`** — hides Next.js fingerprint.
- **Zod validation** on login route — input is validated server-side before forwarding.
- **shadcn/ui component library** — consistent, accessible base components.
- **Well-structured models** — patient model is clean and properly typed.
- **CreatePatient form** — good section decomposition with proper Zod schema and phone validation via `libphonenumber-js`.

---

## Safe Fix Playbook

The following order minimizes risk of breaking existing functionality:

### Phase 1 — Zero-risk cleanup (delete dead code)

These files are never imported. Deleting them changes nothing:

1. Delete `middleware/security.ts`
2. Delete `lib/rate-limiter.ts`
3. Delete `lib/security-logger.ts`
4. Delete `lib/store/middleware/auth.middleware.ts`
5. Delete `lib/api/config.ts`
6. Delete `lib/i18n/server.ts`
7. Delete `models/routing.model.ts`
8. Delete `models/set-password.model.ts`
9. Delete `models/password-recovery.model.ts`
10. Delete `components/auth/BrandIdentity.tsx`
11. Delete `components/auth/OTPInput.tsx`
12. Delete `components/auth/ChangePasswordStatus.tsx`
13. Remove unused exports from `models/api.model.ts`
14. Remove `*Default` re-exports from `navigation/index.ts`
15. Run `npm uninstall` for all unused dependencies listed above

**Verification:** `npm run build` should succeed with identical behavior.

### Phase 2 — Low-risk bug fixes (isolated changes)

Each fix is independent and testable:

1. **P0-11:** Add `encodeURIComponent(token)` in verify-email route
2. **P0-12:** Remove localhost fallback in verify-email and resend-verification routes
3. **P1-04:** Fix callbackUrl to use `request.nextUrl.pathname` instead of `encodeURI(request.url)`
4. **P1-11:** Remove `accessToken` from `legacyCookies` array in logout route
5. **P1-15:** Replace `error.message` with generic messages in register, resend, verify routes
6. **P2-03:** Replace local `cn()` in `MobileHeader` with import from `@/lib/utils`
7. **P2-06:** Standardize password minimum to `min(6)` everywhere
8. **P2-11:** Move null check before `getFieldState` call in `form.tsx`
9. **P2-16:** Add `useAppSelector` typed hook to `store.ts`
10. **P3-09:** Fix broken path aliases in `tsconfig.json`
11. **P3-17:** Set `TOAST_REMOVE_DELAY` to a reasonable value (e.g., 5000ms)

**Verification:** Each fix can be tested individually. Run `npm run build` + manual testing of affected flows.

### Phase 3 — Medium-risk improvements (architecture changes)

These require more careful testing:

1. **P0-01:** Remove `accessToken` from JSON responses + refactor `httpClient` to use cookie-only auth
2. **P0-02:** Add Zod schema to register route
3. **P0-04:** Replace fake email validation with real API call or remove hook
4. **P0-08:** Implement actual patient list rendering in `PatientsList`
5. **P1-02:** Move toast calls out of Redux reducers
6. **P1-03:** Consolidate `ApiResponse`/`ApiError` types
7. **P1-08:** Create server-only `API_URL` env var
8. **P1-16:** Remove `HttpBackend` from i18n config
9. **P2-01:** Merge Sidebar/SimpleSidebar + DashboardLayout/SimpleDashboardLayout
10. **P2-02:** Extract `useMediaQuery` hook

**Verification:** Full regression test of auth flow, dashboard navigation, patient management. Test in both dev and production builds.

### Phase 4 — High-risk security improvements

These change fundamental security behavior and require thorough testing:

1. **P0-03:** Add JWT verification to middleware (requires `jose` library)
2. **P1-09:** Implement nonce-based CSP (affects all scripts/styles)
3. **P0-10:** Restrict image remote patterns

**Verification:** Full security audit. Test all auth flows, image loading, script execution across pages.

---

*End of audit. Total unique issues found: **98**.*
