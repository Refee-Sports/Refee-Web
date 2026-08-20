# Refee Web

The marketing + download landing page for **Refee** — the on-demand marketplace
for sports officials. The React Native app lives in [`../Refee-App`](../Refee-App).

This is where people learn about Refee and get prompted to download the app.
Login is stubbed at `/login` and ready to wire up to Supabase Auth later.

## Stack

- **Next.js 15** (App Router) + **React 19** — same React skills as the RN app
- **Tailwind CSS 3** — tokens mirror `Refee-App/Refee/refee/tailwind.config.js`
- **next/font** — Inter Tight (display) + JetBrains Mono (telemetry), self-hosted

The design tokens (paper / ink / signal / hi-vis, zebra rules, hard shadows)
are carried over from the app's design pack so web and mobile feel like one brand.

## Getting started

```bash
cd Refee-Web
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | What it does                        |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the dev server (hot reload)   |
| `npm run build` | Production build                    |
| `npm run start` | Serve the production build          |
| `npm run lint`  | Lint with `next lint`               |

## Structure

```
Refee-Web/
├── app/
│   ├── layout.tsx        # Fonts, metadata, <html>
│   ├── page.tsx          # The landing page (all sections)
│   ├── globals.css       # Design tokens + component classes
│   ├── login/page.tsx    # Placeholder auth screen (future Supabase Auth)
│   └── favicon.svg
├── components/
│   ├── SiteNav.tsx
│   ├── Footer.tsx
│   ├── PhoneMock.tsx     # CSS-only in-app job feed preview
│   ├── StoreButtons.tsx  # App Store / Google Play buttons
│   └── Wordmark.tsx
├── tailwind.config.ts    # Tokens mirrored from the RN app
└── ...
```

## TODO before launch

- [ ] Swap App Store / Google Play URLs in `components/StoreButtons.tsx`
- [ ] Add a real QR code + OG share image
- [ ] Wire `/login` to Supabase Auth (email OTP / Apple sign-in)
- [ ] Point `metadataBase` / canonical URL at the real domain

## Deploy

Optimized for **Vercel** (zero-config for Next.js). `npm run build` also produces
a standard Next server you can host anywhere Node runs.
