# Portfolio Website + Admin CMS

A personal portfolio site with a built-in content management system (CMS). The public site shows your bio, projects, experience, and contact form. The admin panel lets you edit everything from the browser without touching code.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Supabase (database, auth, storage) · Vercel (hosting)

---

## Table of contents

1. [What this project is](#what-this-project-is)
2. [How it works](#how-it-works)
3. [Features](#features)
4. [Project structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Local setup (step by step)](#local-setup-step-by-step)
7. [Supabase setup (step by step)](#supabase-setup-step-by-step)
8. [Environment variables](#environment-variables)
9. [Editing content (admin guide)](#editing-content-admin-guide)
10. [Deploy to Vercel (step by step)](#deploy-to-vercel-step-by-step)
11. [Troubleshooting](#troubleshooting)

---

## What this project is

This is a **full-stack portfolio website** with two parts:

| Part | URL | Who uses it |
|------|-----|-------------|
| **Public site** | `/` | Visitors — your portfolio |
| **Admin CMS** | `/admin` | You — edit text, images, projects, etc. |

You do **not** need to edit React files to update your portfolio. Log in at `/login`, use the admin sidebar, save changes, and they appear on the live site.

---

## How it works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Public site    │     │  Next.js app     │     │  Supabase       │
│  (visitors)     │────▶│  Server + Client │────▶│  PostgreSQL     │
└─────────────────┘     └──────────────────┘     │  Auth           │
                                                 │  Storage        │
┌─────────────────┐     ┌──────────────────┐     └─────────────────┘
│  Admin CMS      │────▶│  Server Actions  │──────────▲
│  (/admin)       │     │  + Middleware    │          │
└─────────────────┘     └──────────────────┘          │
        │                                                │
        └── Login via Supabase Auth ────────────────────┘
```

1. **Public pages** load content from Supabase (bio, about, skills, projects, etc.).
2. **Admin routes** (`/admin/*`) are protected by middleware — you must log in at `/login`.
3. **Saving in admin** runs server actions that write to Supabase and revalidate the homepage.
4. **Images** (hero photo, about photo, project icons) upload to Supabase Storage bucket `portfolio`.
5. **Contact form** saves messages to the database and optionally sends email via Resend.

---

## Features

### Public site sections

- **Hero** — Name, profile photo, typing roles, short intro, CTA buttons
- **About** — Separate intro photo, location, education, rich-text story
- **Skills & Tools** — Technical skills and tools in bordered boxes
- **Projects** — Expandable cards with custom uploaded icons and rich text
- **Experience** — Timeline with rich-text descriptions
- **Education** — Degree cards
- **Contact** — Message form + message buttons (LinkedIn, WhatsApp, etc.)
- **WhatsApp** — Floating button (link set in admin)
- **Footer** — Copyright

### Admin CMS (`/admin`)

| Page | What you edit |
|------|----------------|
| Dashboard | Overview |
| Bio / Hero | Name, hero photo, roles, intro, CTAs |
| About | Intro box photo, location, education, about text |
| Skills | Skill lines (bold, size, alignment) |
| Projects | Icons, title, description, tech stack, links |
| Experience | Jobs, dates, descriptions |
| Education | Degrees and institutions |
| Contact | Form titles, WhatsApp link, message buttons, notification email |
| Messages | Inbox for contact form submissions |

### Rich text editor (admin)

Used on bio intro, about text, projects, and experience:

- **Bold** — select text, click **B**
- **Font size** — Small / Normal / Large / Extra large
- **Alignment** — Left / Center / Right
- **Preview** — live preview below the editor

---

## Project structure

```
├── src/
│   ├── app/                 # Pages (public + admin routes)
│   ├── actions/             # Server actions (save, upload, auth)
│   ├── components/
│   │   ├── admin/           # Admin UI forms and managers
│   │   ├── layout/          # Navbar, footer, WhatsApp button
│   │   └── sections/        # Public homepage sections
│   ├── lib/
│   │   ├── admin/           # Queries, storage, defaults
│   │   └── supabase/        # Supabase clients
│   └── types/               # TypeScript types
├── supabase/migrations/     # SQL to run in Supabase
├── middleware.ts            # Protects /admin and /login
├── .env.local               # Your secrets (never commit)
└── .env.local.example       # Template for env vars
```

---

## Prerequisites

- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **npm** (comes with Node)
- **Supabase account** — free tier works ([supabase.com](https://supabase.com))
- **Git** — for deployment
- **Optional:** [Resend](https://resend.com) account for contact email notifications
- **Optional:** [Vercel](https://vercel.com) account for hosting

---

## Local setup (step by step)

### Step 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd portfolio-website
npm install
```

### Step 2 — Environment file

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase values (see [Environment variables](#environment-variables)).

### Step 3 — Run Supabase migrations

Complete [Supabase setup](#supabase-setup-step-by-step) first, then continue.

### Step 4 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

### Step 5 — Log in to admin

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Use the email and password you created in Supabase Auth
3. You will be redirected to `/admin`

### Step 6 — Build for production (optional check)

```bash
npm run build
npm start
```

---

## Supabase setup (step by step)

### Step 1 — Create a project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Choose a name, password, and region
4. Wait until the project is ready

### Step 2 — Get API keys

1. **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste both into `.env.local`

### Step 3 — Run database migrations

Open **SQL Editor** → **New query** and run each file **in order**:

| Order | File | Purpose |
|-------|------|---------|
| 1 | `supabase/migrations/001_initial_schema.sql` | Tables, RLS policies |
| 2 | `supabase/migrations/002_storage_avatars.sql` | Photo storage bucket |
| 3 | `supabase/migrations/003_skills_formatting.sql` | Optional skills helpers |
| 4 | `supabase/migrations/004_projects_icon.sql` | Project icon column |
| 5 | `supabase/migrations/005_storage_projects.sql` | Project icon uploads |

Each script is safe to re-run where noted (uses `IF NOT EXISTS` / `DROP POLICY IF EXISTS`).

### Step 4 — Create an admin user

1. Supabase → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and a strong password
4. Use these credentials at `/login`

Only authenticated users can access `/admin` and upload files.

### Step 5 — Auth URL configuration (required for production)

For local development, add in **Authentication** → **URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** `http://localhost:3000/**`

After deploying to Vercel, add your production URL too (see [Deploy to Vercel](#deploy-to-vercel-step-by-step)).

### Step 6 — Verify storage

1. Go to **Storage**
2. Confirm a public bucket named **`portfolio`** exists
3. Folders used: `avatars/`, `projects/icons/`

---

## Environment variables

Create `.env.local` in the project root (never commit this file):

```env
# Required — Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Optional — contact form emails via Resend
RESEND_API_KEY=re_xxxxxxxx
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `RESEND_API_KEY` | No | Sends email when someone submits the contact form |
| `CONTACT_FROM_EMAIL` | No | From address for notification emails |

Without Resend, contact messages still save to **Admin → Messages**.

---

## Editing content (admin guide)

Log in at `/login`, then use the sidebar.

### Bio / Hero

- **Name** — shown in navbar and hero
- **Profile photo** — circular hero image (upload JPEG/PNG/WebP/GIF, max 5 MB)
- **Typed roles** — one role per line (typing animation)
- **Short intro** — rich text above the buttons
- **CTA buttons** — labels and links (e.g. `#projects`, `#contact`)

Click **Save Bio**.

### About

- **Intro box photo** — separate from hero photo (rectangular frame on site)
- **Intro title** — e.g. "My intro"
- **Location** / **Education** — bottom of the intro card
- **About text** — rich text for "Who I Am", etc.

Click **Save About**.

### Skills

- Add **Technical Skills** or **Tools & Platforms** entries
- Use `**bold**` in text for emphasis
- Set font size and alignment per skill

### Projects

- **Project icon** — upload a custom image per project
- **Fallback icon name** — Lucide name if no upload (e.g. `folder-kanban`, `bot`, `rocket`)
- **Title / Description / Tech stack** — rich text editors
- **Live link / GitHub link** — optional URLs

### Experience

- Add roles with company, date range, icon name, and rich-text description

### Education

- Add degree, institution, dates, and icon

### Contact

- **Section title** — e.g. "Get In Touch"
- **Form title** — left box heading
- **Message buttons title** — right box heading (e.g. "Send Messages")
- **WhatsApp link** — floating button URL (`https://wa.me/...` or phone number)
- **Notification email** — where contact form copies are sent (needs Resend)
- **Message buttons** — name, URL, icon for LinkedIn, GitHub, WhatsApp, etc.

### Messages

- Read contact form submissions
- Mark as read when handled

---

## Deploy to Vercel (step by step)

No code changes are required. Configuration is done in Vercel and Supabase dashboards.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Portfolio ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**Never commit `.env` or `.env.local`** — they contain secrets.

### Step 2 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: default (leave empty)

### Step 3 — Add environment variables

In Vercel project **Settings** → **Environment Variables**, add:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `RESEND_API_KEY` | Optional |
| `CONTACT_FROM_EMAIL` | Optional |

Apply to **Production**, **Preview**, and **Development**.

### Step 4 — Deploy

Click **Deploy**. Wait for the build to finish. You will get a URL like `https://your-app.vercel.app`.

### Step 5 — Update Supabase auth URLs

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** add:
  - `https://your-app.vercel.app/**`
  - `http://localhost:3000/**` (keep for local dev)

Save, then test login at `https://your-app.vercel.app/login`.

### Step 6 — Custom domain (optional)

1. Vercel → **Settings** → **Domains** → add your domain
2. Update Supabase **Site URL** and **Redirect URLs** to your custom domain

### Step 7 — Post-deploy checklist

- [ ] Homepage loads with content
- [ ] `/login` works
- [ ] `/admin` requires login
- [ ] Image uploads work (bio, about, projects)
- [ ] Contact form saves to Messages
- [ ] WhatsApp button opens correct chat

---

## Troubleshooting

### Admin page shows an error

- Check `.env.local` (local) or Vercel env vars (production) for Supabase keys
- Confirm you are logged in at `/login`

### Photo upload fails

- Run `002_storage_avatars.sql` and `005_storage_projects.sql` in Supabase SQL Editor
- Confirm **Storage** has a `portfolio` bucket
- Restart dev server after changing `next.config.ts`
- Keep images under **5 MB**

### "Body exceeded 1 MB limit" when saving

- Restart the dev server (upload limit is set to 6 MB in `next.config.ts`)
- Use a smaller image file

### Admin login fails on production

- Add your Vercel URL to Supabase **Redirect URLs**
- Set **Site URL** to your production domain

### Contact emails not sending

- Add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` to env vars
- Add **Notification email** in Admin → Contact
- Messages still appear in Admin → Messages without Resend

### Changes not visible on homepage

- Hard refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)
- Confirm you clicked **Save** in admin
- On Vercel, redeploy only if env vars changed

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production build locally |
| `npm run lint` | Run ESLint |

---

## License

Private / personal portfolio — adjust as needed for your use.
