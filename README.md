# 🦷 DentalCRM - Next-Generation Dental Practice Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, secure, and intelligent SaaS platform designed specifically for dental clinics**

[![Status](https://img.shields.io/badge/status-in%20development-yellow?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/license-proprietary-red?style=flat-square)](https://github.com)
[![Security](https://img.shields.io/badge/security-hardened-green?style=flat-square)](https://github.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Security](#-security)
- [Internationalization](#-internationalization)
- [Development Status](#-development-status)
- [Contributing](#-contributing)

---

## 🎯 Overview

**DentalCRM** is a comprehensive B2B SaaS platform revolutionizing dental practice management. Built with modern web technologies and designed with security, scalability, and user experience at its core, this system empowers dental clinics to streamline operations, manage patient relationships, and prepare for AI-powered automation.

### 🎯 Mission

To provide dental professionals with an intelligent, secure, and user-friendly platform that automates administrative tasks while maintaining the highest standards of data protection and compliance.

### 🚀 Vision

A future-ready platform that combines cutting-edge technology with healthcare industry best practices, enabling dental clinics to focus on what matters most: patient care.

---

## ✨ Key Features

### 🔐 **Authentication & Security** ✅

- ✅ **Complete Authentication System**: Login, registration, email verification, password recovery
- ✅ **JWT-based Authentication**: Secure token-based authentication with HTTP-only cookies
- ✅ **Enterprise-Grade Security**: Comprehensive security headers, rate limiting, and secure authentication
- ✅ **Multi-Tenant Architecture**: Foundation for organization-based data isolation
- 🚧 **GDPR-Compliant Architecture**: Full compliance with European data protection regulations (in development)
- 🚧 **Data Anonymization**: Advanced pseudonymization for AI processing (planned)

### 👥 **Patient Management** 🚧

- 🚧 Comprehensive patient database with advanced search and filtering
- 🚧 Patient status tracking (new, active, VIP, archived)
- 🚧 Secure document storage and retrieval
- 🚧 Multi-language patient records support

### 📅 **Appointment Scheduling** 🚧

- 🚧 Interactive calendar with drag-and-drop functionality
- 🚧 Automated reminders and notifications
- 🚧 Resource management and conflict detection
- 🚧 Mobile-responsive scheduling interface

### 📊 **Analytics & Reporting** 🚧

- 🚧 Real-time dashboard with key performance indicators
- 🚧 Financial analytics and reporting
- 🚧 Patient flow analytics
- 🚧 Customizable reports

### 🌍 **Internationalization** 🚧

- 🚧 Multi-language support (English, German, Ukrainian) - infrastructure ready
- 🚧 RTL-ready architecture
- 🚧 Localized date, time, and currency formats
- 🚧 Dynamic language switching

### 🎨 **Modern UI/UX** 🚧

- ✅ Premium design system with consistent components (shadcn/ui)
- ✅ Mobile-first responsive design
- ✅ Smooth animations and transitions
- 🚧 Accessibility-first approach (WCAG 2.1) - in progress

### 🤖 **AI Integration** 📋

- 📋 AI-powered visit record generation (planned)
- 📋 Intelligent appointment recommendations (planned)
- 📋 Automated documentation assistance (planned)
- 📋 Human-in-the-loop workflow for safety (planned)

**Legend:**

- ✅ **Implemented** - Feature is complete and functional
- 🚧 **In Development** - Feature is currently being developed
- 📋 **Planned** - Feature is planned for future implementation

---

## 🛠 Technology Stack

### **Frontend Framework**

- **Next.js 15.1** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### **State Management**

- **Redux Toolkit** - Predictable state container
- **Redux Persist** - State persistence
- **React Query** (planned) - Server state management

### **Styling & UI**

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library

### **Form Management**

- **React Hook Form** - Performant form library
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### **Internationalization**

- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next
- **next-i18next** - Next.js integration

### **Authentication & Security**

- **JWT** - Token-based authentication
- **HTTP-only Cookies** - Secure token storage
- **Rate Limiting** - API protection
- **Security Headers** - OWASP-compliant headers

### **Development Tools**

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

### **Additional Libraries**

- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Zod** - Schema validation
- **React PDF** - PDF generation
- **Recharts** - Data visualization

---

## 🏗 Architecture

### **Application Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
├─────────────────────────────────────────────────────────┤
│  (auth) Routes          │  (dashboard) Routes            │
│  - Sign In             │  - Dashboard                   │
│  - Registration        │  - Patients                    │
│  - Password Recovery   │  - Appointments                │
│  - Email Verification  │  - Analytics                   │
│                        │  - Finance                     │
└─────────────────────────────────────────────────────────┘
│                    API Routes Layer                      │
│  - Authentication      │  - Data Services               │
│  - Middleware          │  - Error Handling              │
└─────────────────────────────────────────────────────────┘
│                    State Management                      │
│  - Redux Store         │  - Auth Slice                  │
│  - Persistence         │  - Feature Slices             │
└─────────────────────────────────────────────────────────┘
│                    Service Layer                         │
│  - API Client          │  - HTTP Client                 │
│  - Auth Service        │  - Error Handler               │
└─────────────────────────────────────────────────────────┘
```

### **Multi-Tenant Architecture**

- **Organization-Based Isolation**: Complete data separation at the application level
- **Automatic Filtering**: All queries automatically filtered by `organizationId`
- **Secure Context**: Organization context derived from authenticated user
- **Scalable Design**: Single database with logical separation

### **Security Architecture**

- **Defense in Depth**: Multiple layers of security
- **OWASP Compliance**: Following OWASP Top 10 guidelines
- **Security Headers**: Comprehensive HTTP security headers
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Server and client-side validation
- **Secure Authentication**: JWT with HTTP-only cookies

---

## 📁 Project Structure

```
dentalcrmFE/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── signin/              # Sign in page
│   │   ├── register/            # Registration page
│   │   ├── verify-email/        # Email verification
│   │   ├── reset-password/      # Password recovery
│   │   └── resend-verification/ # Resend verification
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── home/                # Dashboard home
│   │   ├── patients/            # Patient management
│   │   ├── appointments/        # Appointment scheduling
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── finance/             # Financial management
│   │   └── employees/          # Employee management
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   └── patients/           # Patient endpoints
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── auth/                   # Authentication components
│   ├── landing/                # Landing page components
│   ├── navigation/             # Navigation components
│   ├── patients/               # Patient management components
│   └── appointments/           # Appointment components
│
├── lib/                         # Core libraries
│   ├── api/                    # API services
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── patients.service.ts # Patient service
│   │   ├── config.ts           # API configuration
│   │   └── http-client.ts     # HTTP client
│   ├── store/                  # Redux store
│   │   ├── features/           # Redux slices
│   │   ├── middleware/         # Custom middleware
│   │   └── store.ts            # Store configuration
│   ├── i18n/                   # Internationalization
│   │   ├── i18n.ts             # i18n configuration
│   │   └── server.ts           # Server-side i18n
│   ├── utils.ts                # Utility functions
│   ├── error-handler.ts        # Error handling
│   └── security-logger.ts      # Security logging
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useDebounce.ts          # Debounce hook
│   ├── useEmailValidation.ts   # Email validation
│   └── usePasswordValidation.ts # Password validation
│
├── models/                      # TypeScript models
│   ├── auth.model.ts           # Authentication models
│   ├── patient.model.ts        # Patient models
│   └── api.model.ts            # API models
│
├── constants/                   # Application constants
│   └── routes.ts               # Route definitions
│
├── public/                      # Static assets
│   ├── locales/                # Translation files
│   │   ├── en/                 # English translations
│   │   ├── de/                 # German translations
│   │   └── ua/                 # Ukrainian translations
│   └── images/                 # Image assets
│
├── middleware.ts                # Next.js middleware
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18.x or later
- **npm** 9.x or later (or **yarn** / **pnpm**)
- **Git** for version control

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/your-org/dentalcrmFE.git
cd dentalcrmFE
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type Checking
npm run type-check   # Run TypeScript type checking
```

---

## 🔒 Security

### **Security Features**

- ✅ **OWASP Top 10 Compliance**
- ✅ **Comprehensive Security Headers** (CSP, HSTS, X-Frame-Options, etc.)
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Input Validation** - Server and client-side validation
- ✅ **Secure Authentication** - JWT with HTTP-only cookies
- ✅ **XSS Protection** - Content Security Policy
- ✅ **CSRF Protection** - SameSite cookie policy
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Security Logging** - Audit trail for security events

### **Security Headers**

The application implements comprehensive security headers including:

- **Content Security Policy (CSP)** - XSS protection
- **Strict-Transport-Security (HSTS)** - Force HTTPS
- **X-Frame-Options** - Clickjacking protection
- **X-Content-Type-Options** - MIME sniffing protection
- **Referrer-Policy** - Referrer information control
- **Permissions-Policy** - Browser API restrictions

### **GDPR Compliance**

- Data minimization principles
- User consent management
- Right to access and deletion
- Data portability
- Privacy by design architecture

---

## 🌍 Internationalization

The application supports multiple languages with full i18n implementation:

- **English (EN)** - Primary language
- **German (DE)** - Secondary language
- **Ukrainian (UA)** - Secondary language

### **Translation Structure**

Translations are stored in `public/locales/{lang}/common.json` and loaded dynamically at runtime.

### **Usage Example**

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("landing.hero-title")}</h1>;
}
```

---

## 🚧 Development Status

### **Current Status: Early Development Phase**

This project is in **early development**. Currently, only the authentication and registration module is fully implemented. All other features are in planning or early development stages.

#### ✅ **Completed Features**

- [x] **Authentication System** - Complete authentication flow
  - [x] User registration (organization owner)
  - [x] Login with JWT tokens
  - [x] Email verification
  - [x] Password recovery (forgot/reset password)
  - [x] Resend verification email
  - [x] Secure token management (HTTP-only cookies)
- [x] **Security Foundation**
  - [x] Security headers implementation
  - [x] Rate limiting infrastructure
  - [x] Input validation
- [x] **UI Foundation**
  - [x] Design system setup (shadcn/ui)
  - [x] Landing page
  - [x] Responsive layout structure
  - [x] Basic navigation components

#### 🚧 **In Development**

- [ ] **Patient Management Module**
  - [ ] Patient CRUD operations (UI in progress)
  - [ ] Patient search and filtering
  - [ ] Patient status management
- [ ] **Dashboard**
  - [ ] Dashboard layout and navigation
  - [ ] Dashboard home page
- [ ] **Internationalization**
  - [ ] i18n infrastructure (partially ready)
  - [ ] Translation files completion
  - [ ] Language switcher implementation

#### 📋 **Planned Features**

- [ ] **Appointment Scheduling System**
  - [ ] Interactive calendar
  - [ ] Drag-and-drop functionality
  - [ ] Automated reminders
- [ ] **Analytics & Reporting**
  - [ ] Analytics dashboard
  - [ ] Financial reporting
  - [ ] Patient flow analytics
- [ ] **Financial Management**
  - [ ] Billing system
  - [ ] Payment processing
  - [ ] Financial reports
- [ ] **Employee Management**
  - [ ] Employee CRUD
  - [ ] Role management
  - [ ] Permissions system
- [ ] **Document Management**
  - [ ] Secure document storage
  - [ ] Document retrieval
  - [ ] File upload/download
- [ ] **AI Integration** (Future)
  - [ ] AI-powered visit record generation
  - [ ] Intelligent recommendations
  - [ ] Automated documentation
- [ ] **Mobile Application** (Future)
  - [ ] iOS app
  - [ ] Android app
- [ ] **Third-party Integrations** (Future)
  - [ ] Calendar integrations
  - [ ] Payment gateways
  - [ ] Email services

### **Roadmap**

- **Q1 2024**: Core features completion
- **Q2 2024**: AI integration (beta)
- **Q3 2024**: Advanced analytics
- **Q4 2024**: Mobile applications

---

## 🎨 Design System

The application uses a custom design system built on top of Tailwind CSS and shadcn/ui:

### **Color Palette**

- **Primary**: Deep charcoal black (`hsl(0 0% 9%)`)
- **Trust Colors**: Green palette for security indicators
- **Gradients**: Purple-cyan-teal for premium effects
- **Neutral**: Gray scale for text and backgrounds

### **Typography**

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, clean sans-serif with strong hierarchy
- **Body**: Optimized for readability

### **Component Library**

Built with **shadcn/ui** components, providing:

- Accessible components
- Customizable styling
- TypeScript support
- Dark mode ready

---

## 📊 Performance

### **Optimization Strategies**

- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Next.js Image component with WebP/AVIF
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategy** - Optimized cache headers
- **Lazy Loading** - Component and image lazy loading

### **Performance Metrics**

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

---

## 🤝 Contributing

### **Development Guidelines**

1. **Code Style**: Follow ESLint and Prettier configurations
2. **TypeScript**: Strict type checking enabled
3. **Commits**: Follow Conventional Commits specification
4. **Testing**: Write tests for new features
5. **Documentation**: Update documentation for API changes

### **Branch Strategy**

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### **Pull Request Process**

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit pull request
6. Code review and approval
7. Merge to `develop`

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

Built with ❤️ by a dedicated team of developers passionate about healthcare technology.

---

## 📞 Contact & Support

For questions, support, or collaboration inquiries, please contact the development team.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **shadcn** - For the beautiful component library
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework

---

<div align="center">

**Made with ❤️ for dental professionals worldwide**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)

</div>
