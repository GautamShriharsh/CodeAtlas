# 🗺️ CodeAtlas

> Map your codebase. Summarize every commit. An AI-powered repository cartographer built for modern development teams.

CodeAtlas connects directly to your GitHub workspaces, converting deep, complex git diffs into clean, human-readable structural summaries using the Gemini Pro API. With integrated vector semantic indexing, you can query your repository's entire architecture naturally over an interactive chat canvas.

<!-- ![CodeAtlas Banner Placeholder](public/assets/banner.png) -->

---

## ⚡ Core Architecture

- **🧠 Semantic Codebase Indexing:** Deep-scans repository structural files, calculates vector file embeddings, and exposes an internal Q&A chat engine over your entire codebase.
- **✨ Commit Summaries:** Automatically packages codebase changes into crisp, atomic, high-fidelity summaries. Controlled manually via targeted query cache hooks to eliminate race-conditions and rate-limit triggers.
- **💳 Token Credit Allocation:** Active rate-limiting dashboard pipelines mapped against a dynamic check-credit configuration layer powered by Stripe checkout tracking.
- **🔒 Stealth Aesthetic Layout:** A ultra-premium, high-contrast dark-mode interface built on pure charcoal, pitch-black frames, and frosted glassmorphism layers inspired by Linear.
---

## 🛠️ The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React, Tailwind CSS |
| **Backend Architecture** | tRPC (Type-safe APIs), Next.js Serverless Routes |
| **Authentication System** | Clerk OAuth (GitHub Integration) |
| **Database & ORM** | PostgreSQL, Prisma Client |
| **AI Integration** | Google Gemini API |
| **State Management** | TanStack React Query (Custom cache-targeting hooks) |
| **Component UI Elements** | shadcn/ui, Framer Motion, Lucide Icons |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GautamShriharsh/codeatlas.git
cd codeatlas
```

### 2. Install dependencies

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the required environment variables.

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# GitHub
GITHUB_TOKEN=

# Google AI
GEMINI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Other required variables...
```

### 4. Start the development server

Using Bun:

```bash
bun dev
```

Or using npm:

```bash
npm run dev
```

### 5. Open your browser

Visit:

```text
http://localhost:3000
```