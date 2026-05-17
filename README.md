# EVE DED Tracker 🚀

A modern, high-performance web application designed to track and analyze your DED (Dead End) runs in EVE Online. Built to help Capsuleers manage their ledgers, measure their profit, and optimize their escalation farming.

## ✨ Features

- 📊 **Detailed Run Tracking**: Record DED ratings, factions, loot value, and initial capital costs.
- 💰 **Profit Analysis**: Automatically calculates net PnL (Profit and Loss) and average ISK per run.
- 🎨 **Responsive & Themed UI**: Gorgeous UI powered by Tailwind CSS, with support for both Dark and Light modes. 
- 🌐 **Internationalization (i18n)**: Seamlessly switch between languages (EN, ID) on the fly.
- 🔐 **Secure Authentication**: Built-in authentication utilizing Supabase, integrating EVE SSO capabilities.
- ⚡ **Fast & Modern Stack**: Built using Next.js 16 (App Router) + React 19 + Bun for extremely fast development and build times.

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
