# EVE DED Tracker

Web app for logging DED escalation runs, loot drops, and net ISK profit in EVE Online.

## Features

- **Run logging**: DED tier, faction, loot appraised through Janice or typed by hand, and the capital spent on the bookmark.
- **A ledger you can work in**: search by faction, tier or Janice code, filter, sort any column, edit a run instead of deleting it, export the filtered list to CSV.
- **Numbers that agree**: net PNL, average per run, win rate, profit factor, return on bookmarks, cumulative PNL, and profit per DED tier all come from the same run list.
- **Light and dark mode** without a flash of the wrong theme on load.
- **EN / ID**, remembered across reloads through a cookie, so the server renders the right language on first paint.
- **EVE SSO via Supabase**, with row-level security: a capsuleer only ever sees their own runs.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & Lucide Icons
- **Database & Auth**: [Supabase](https://supabase.com/)

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NojinNojs/eve-ded-tracker.git
cd eve-ded-tracker
```

2. Install dependencies using Bun:
```bash
bun install
```

3. Setup environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 🛡️ Security & Pre-commit

- The `.gitignore` is fully configured to prevent sensitive `.env` files from being committed.
- Run the Linter to ensure the codebase follows strict standard configurations:
```bash
bun run lint
```
- Run the unit suite (ISK parsing, sorting, PNL aggregation, CSV escaping, sample data):
```bash
bun test
```
- Boot the production build and check the page actually renders:
```bash
bun run build && bun run test:smoke
```
- Or all three gates at once:
```bash
bun run verify
```
- Build the production-ready project:
```bash
bun run build
```

## 🚢 Deployment

The easiest way to deploy this application is through [Vercel](https://vercel.com/), the creators of Next.js. The app is completely production-ready and optimized out-of-the-box.

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Set your Environment Variables in the Vercel dashboard.
4. Deploy!

## 📝 License

This project is licensed under the MIT License. EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide.
