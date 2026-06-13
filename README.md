# Project Codename: Helios

![Helios Web QA Dashboard](./public/brand/helios-banner.png)

Helios adalah QA observability dashboard untuk browser-based website checks. Fokus utamanya bukan cuma menemukan masalah, tapi membuat setiap QA run bisa diamati ulang lewat browser trail, screenshot, logs, artifacts, dan evidence.

> Evidence-based website QA powered by replayable browser runs.

## Core Loop

1. User memasukkan starting URL.
2. Helios membuat QA run.
3. Browser runner membuka halaman target.
4. Sistem mengumpulkan screenshot, console logs, network failures, dan trail steps.
5. Dashboard menampilkan summary, findings, artifacts, dan evidence yang bisa diinspeksi.

Untuk tahap awal, Helios belum fokus ke AI. Core pertamanya adalah dashboard dan automation pipeline yang stabil. Setelah evidence layer kuat, AI bisa ditambahkan untuk membuat report dan suggested next actions.

## MVP

- Input target URL
- QA run lifecycle: queued, running, completed, failed
- Browser trail/timeline
- Basic QA summary
- Screenshot desktop dan mobile
- Capture console errors
- Capture failed network requests
- Capture broken images dan page load metrics
- Tampilkan report QA di dashboard
- Preview artifacts dan export run result sebagai JSON
- Recent runs in-memory untuk inspeksi cepat selama sesi

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Playwright

## Project Structure

```txt
src/lib/helios/
  client/   Browser/client-side run state, API calls, export, and transforms
  server/   Playwright runner used by the API route
  shared/   Types, checks, validators, formatting, constants, and shared helpers

src/components/helios/
  Dashboard UI components for forms, run metadata, artifacts, evidence,
  checks, browser trail, status badges, and recent runs.
```

## Development

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka app di browser:

```txt
http://localhost:3000
```

## Status

Prototype QA-first sudah memakai real Playwright runner untuk single-page checks. Fokus berikutnya adalah memoles page load metrics, better error handling, richer evidence, dan persiapan persistence sebelum masuk ke database-backed run history.
