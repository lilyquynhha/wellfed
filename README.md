# WellFed

WellFed is a full-stack web application for tracking nutritional information of foods, recipes, and meals. Users can search a public food database, create their own private foods, build meals and recipes from those foods, and monitor nutrients that matter to them.

This project is being developed as both a practical nutrition tool and a learning project to gain hands-on experience designing, building, testing, and deploying a production-style full-stack application.

## Project Goals

The primary purpose of WellFed is to demonstrate the ability to design and implement a complete software project from initial idea through deployment while following industry-standard development practices.

Throughout this project I aim to:

- Design a normalized PostgreSQL database from scratch
- Build a secure backend using PostgreSQL Row Level Security (RLS)
- Learn modern full-stack development with Next.js
- Gain experience with Supabase Authentication and PostgreSQL
- Use Prisma ORM for schema management and database migrations
- Design scalable application architecture
- Write automated tests for database security policies
- Practice iterative software development
- Strengthen debugging and troubleshooting skills
- Produce maintainable, well-documented code

Rather than focusing only on the final application, this repository documents the engineering decisions, trade-offs, and lessons learned throughout development.

# Features

## Authentication

- Email/password authentication
- Email verification
- Automatic profile creation after first sign in
- Protected routes
- Public routes

## Food Management

- Search public foods
- Create private foods
- Update private foods
- Delete private foods
- Favourite public foods
- Multiple serving options per food
- Custom serving cost overrides

## Creations

- Create recipes
- Create meals
- Search owned creations
- Add ingredients from foods
- Modify ingredients
- Automatic nutrition calculation

## Nutrition Tracking

- Track selected nutrients
- Configure tracked nutrients
- View nutritional breakdown

## Search

- PostgreSQL Full Text Search
- Partial text matching
- Ranking using `ts_rank`
- Pagination
- Dedicated search functions for different use cases

# Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Supabase, Supabase Auth
- PostgreSQL, RLS
- Prisma ORM
- Vitest

# Database Highlights

- PostgreSQL
- Explicit join tables
- Soft deletion
- Full Text Search (`tsvector`)
- Partial unique indexes
- Row Level Security
- Custom SQL functions (RPC)
- Generated columns
- Prisma migrations

# Running Locally

## Prerequisites

- Node.js
- pnpm
- Supabase project
- PostgreSQL (managed by Supabase)

## Installation

Clone the repository

```bash
git clone <repository-url>
cd wellfed
```

Install dependencies

```bash
pnpm install
```

Create an environment file

```text
.env.local
```

Configure the required environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

DATABASE_URL=
DIRECT_URL=
SHADOW_DATABASE_URL=
```

Run database migrations

```bash
pnpm prisma migrate deploy
```

Run the development server

```bash
pnpm dev
```

Open

```
http://localhost:3000
```

# Project Structure

```
app/
    Application routes

components/
    Reusable UI components

lib/
    Shared utilities
    Supabase clients
    Prisma helpers

prisma/
    Prisma schema
    SQL migrations
    Seed scripts

tests/
    RLS policy tests
```

# Security

WellFed uses PostgreSQL Row Level Security extensively.

Users can only access data they are authorized to view.

Examples include:

- Users can only modify their own profile.
- Users can only manage their own private foods.
- Users can only modify their own recipes.
- Public foods are read-only except for administrators.
- Administrative operations are protected through RLS policies.

Database permissions are enforced by PostgreSQL rather than relying solely on application code.

# Testing

The project includes automated tests covering Row Level Security policies.

Tests verify both allowed and denied operations, including:

- authenticated users
- anonymous users
- administrators
- resource ownership

# Known Limitations

Current limitations include:

- Search does not yet support typo correction (trigram search).
- Search ranking is relatively simple.
- No barcode scanning.
- No image upload.
- Limited performance optimisation for very large datasets.

# Future Improvements

Potential future enhancements include:

- Trigram search for typo tolerance
- Search suggestions and autocomplete
- Barcode scanner
- Food labels and categories
- Nutrition goals
- Daily food logging
- Charts and analytics
- Recipe sharing
- Performance optimisation