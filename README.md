# WellFed 🥗

**WellFed** is a nutrition-focused food tracking web app that empowers you to make informed dietary choices. Search and explore foods from a public database, build your own custom foods, construct meals and recipes, and monitor the nutritions that matter most to you - all in one place.

🔗 **Live demo:** [https://wellf3d.vercel.app/](https://wellf3d.vercel.app/)

---

## Features

### 📊 Personalised Nutrition Tracking

Choose exactly which nutrients you want to keep an eye on - whether that's carbohydrates, protein, fat, fibre, or micronutrients. WellFed surfaces only the data relevant to your goals.

### 🔍 Food Database Search & Favourites

Search from a public food database to find nutritional information on commonly consumed foods. Save items to your favourites list for quick access when logging meals.

### 🍎 Custom Foods & Side-by-Side Comparison

Create your own food entries with full nutritional detail. Compare any set of foods against each other on a standardised quantity basis to make smarter dietary decisions at a glance.

### 🍽️ Meal & Recipe Builder

Construct meals and recipes from individual food items, then compare their nutritional profiles side by side - ideal for planning balanced menus or evaluating recipe variations.

---

## Tech Stack

| Layer                    | Technology                |
| ------------------------ | ------------------------- |
| **Language**             | TypeScript                |
| **Frontend Framework**   | Next.js (App Router)      |
| **UI Components**        | Shadcn UI                 |
| **Database**             | PostgreSQL (via Supabase) |
| **Backend-as-a-Service** | Supabase                  |
| **Authentication**       | Supabase Auth             |
| **ORM**                  | Prisma ORM                |

---

## Project Purpose

WellFed was built as a personal project to demonstrate:

- **Independent learning of new technologies**: hands-on exploration of Next.js App Router, Supabase as a backend platform, and Prisma ORM, all learned and applied from scratch throughout the project.
- **Full database design and development**: a complete end-to-end process from schema design and data modelling through to migrations and query optimisation using Prisma and PostgreSQL.
- **User-centred design**: UI and feature decisions driven by real user needs, with an emphasis on clarity, usability, and meaningful feedback.
- **Authentication**: secure, session-based user authentication implemented via Supabase Auth, supporting protected routes and per-user data.
- **Iterative development**: built incrementally with continuous refinement of both the codebase and the user experience across 78+ commits.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lilyquynhha/wellfed.git
   cd wellfed
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
   DATABASE_URL=your_supabase_database_connection_string
   ```

4. **Apply database migrations**

   ```bash
   pnpm prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   The app will be running at [http://localhost:3000](http://localhost:3000).
