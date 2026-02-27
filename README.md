# 🩸 RoktoBindu

A blood donation platform connecting donors with people in urgent need across Bangladesh. Donors can register, log donations, and toggle availability. Anyone can post emergency blood requests that automatically expire when the deadline passes.

## Stack

- **Next.js 15** — App Router, Server Actions
- **NextAuth.js v5** — Authentication
- **Neon** — PostgreSQL database
- **Tailwind CSS** — Styling
- **Vercel** — Deployment + cron jobs

## Getting Started

```bash
git clone https://github.com/SabbirCodes/rokto-bindu.git
cd rokto-bindu
npm install
```

Create a `.env.local`:

```env
DATABASE_URL=
AUTH_SECRET=
CRON_SECRET=
```

```bash
npm run dev
```

## Features

- Donor search by blood group and location
- Emergency blood requests with urgency levels
- Requests auto-expire after their needed-by date
- Donation history and achievement badges
- Platform-wide statistics

## Deployment

Deploy to Vercel and add the three env vars above. The daily cron job (`vercel.json`) handles request expiry automatically.
