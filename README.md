# 🦷 DentalCRM Frontend

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**B2B SaaS platform for dental clinics** | **Status: In Development**

</div>

---

## 📋 Overview

DentalCRM is a modern SaaS platform designed for dental practice management. The project is currently in early development with authentication and core infrastructure implemented.

---

## ✨ Features

### ✅ Implemented

- **Authentication System**

  - User registration (organization owner)
  - Login with JWT tokens
  - Email verification
  - Password recovery (forgot/reset)
  - Resend verification email
  - Token refresh mechanism

- **Security**

  - Security headers (CSP, HSTS, X-Frame-Options, etc.)
  - Security middleware (SQL injection, XSS protection)
  - Input validation (Zod schemas)
  - CSRF protection (SameSite cookies)
  - Rate limiting infrastructure (pending API integration)
  - Security logging infrastructure (pending API integration)

- **UI/UX**

  - Landing page
  - Design system (shadcn/ui components)
  - Responsive layouts
  - Dashboard layout with sidebar navigation
  - Form validation and error handling

- **Internationalization**

  - i18n setup (i18next)
  - Multi-language support (EN, DE, UA)
  - Translation files structure

- **Patient Management** (Partial)
  - Patient list components
  - Patient API integration
  - Basic filtering UI

### 🚧 In Development

- Patient management (CRUD operations)
- Dashboard home page
- Appointment scheduling
- Analytics dashboard
- Financial management
- Employee management

### 📋 Planned

- AI-powered features
- Advanced reporting
- Document management
- Mobile applications
- Third-party integrations

---

## 🛠 Technology Stack

### Core

- **Next.js 15.1** - App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### State Management

- **Redux Toolkit** - Global state
- **Redux Persist** - State persistence

### UI & Styling

- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations

### Forms & Validation

- **React Hook Form** - Form management
- **Zod** - Schema validation

### Internationalization

- **i18next** - i18n framework
- **react-i18next** - React bindings

### Additional

- **Axios** - HTTP client
- **date-fns** - Date utilities
- **JWT** - Authentication tokens

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x+
- npm/yarn/pnpm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd dentalcrmFE

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

---

## 📁 Project Structure

```
app/
├── (auth)/              # Auth routes (signin, register, etc.)
├── (dashboard)/         # Dashboard routes (home, patients, etc.)
└── api/                 # API routes (auth, patients)

components/
├── ui/                  # shadcn/ui components
├── auth/                # Authentication components
├── landing/             # Landing page components
├── navigation/          # Layout components
└── patients/            # Patient management components

lib/
├── api/                 # API services
├── store/               # Redux store
├── i18n/                # i18n configuration
└── utils.ts             # Utilities
```

---

## 🔒 Security

- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Security middleware (SQL injection, XSS detection)
- ✅ Input validation (Zod)
- ✅ CSRF protection
- 🚧 Rate limiting (infrastructure ready, integration pending)
- 🚧 Security logging (infrastructure ready, integration pending)

---

## 🌍 Internationalization

- Languages: English (EN), German (DE), Ukrainian (UA)
- Framework: i18next with react-i18next
- Translation files: `public/locales/{lang}/common.json`

---

## 📝 License

Proprietary - All rights reserved

---

<div align="center">

**Made with ❤️ for dental professionals**

</div>
