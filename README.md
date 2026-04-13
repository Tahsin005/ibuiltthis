# iBuiltThis

> A premier community platform for creators, makers, and developers to showcase their apps, AI tools, SaaS products, and creative projects to the world.

![Next.js](https://img.shields.io/badge/Next.js-16%2B-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Overview

**iBuiltThis** acts as a launchpad for developers to share authentic builds, gain genuine feedback, and discover what others in the community are constructing. Designed with a sleek, ultra-modern, off-white minimalistic aesthetic and engineered using cutting-edge React server concepts.

## Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Authentication & Orgs**: [Clerk](https://clerk.dev/) (Edge-level proxy middleware)
*   **Database**: PostgreSQL hosted via [Neon](https://neon.tech)
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
*   **Icons & Toasts**: Lucide React, Sonner Notifications

## Key Features

*   **Product Discoverability**: Explore pending and fully approved community launches via a dedicated `/explore` interface.
*   **Optimistic Voting System**: Upvote and downvote products with instant, latency-free `<Suspense>` bounded active-state transitions.
*   **Organization Scoping**: Support for team launches via native Clerk Organization implementations (`/org-setup`).
*   **Edge-Secured Routing**: Next.js proxy middleware explicitly intercepts unauthenticated interactions on protected pipelines (`/submit`, `/admin`, `/my-products`).
*   **Admin Dashboard**: A specialized, metadata-protected admin portal for regulating user-submitted products through "Approve", "Reject", and "Delete" actions.
*   **Partial Prerendering Compatibility**: Strictly architected to comply with Next.js 16's new `cacheComponents` static-shell optimizations without stalling dynamic authentication blocks.

## Running Locally

### 1. Clone & Setup
```bash
git clone git@github.com:Tahsin005/ibuiltthis.git
cd ibuiltthis
npm install
```

### 2. Configure Environments
Create a local `.env.local` based on your `.env.example` mapping out your Postgres connection string and Clerk Authentication keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

DATABASE_URL=postgresql://user:password@hostname/database
```

### 3. Initialize Database
Push the schema to your Neon PostgreSQL instance:
```bash
npx drizzle-kit push
```

### 4. Boot up development server
```bash
npm run dev
```
Access the local environment running elegantly via Turbopack at `http://localhost:3000`.
