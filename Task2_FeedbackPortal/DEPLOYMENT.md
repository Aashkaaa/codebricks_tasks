# Deployment Guide

Free hosting: **Backend on Render**, **Frontend on Vercel**, **Database on MongoDB Atlas** (same setup as Task 1 — you can reuse your existing Atlas cluster, just create a new database within it).

## 1. Database — MongoDB Atlas

You already have a cluster from Task 1. In Atlas, your connection string can point to a new database name, e.g. `.../feedback-portal?...` — MongoDB creates it automatically the first time data is written.

## 2. Backend — Render

1. Push this project to GitHub (as a subfolder in `codebricks_tasks`).
2. Go to https://render.com → New → Web Service → connect your repo.
3. Set **Root Directory** to `Task2_FeedbackPortal/backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (same as `.env`): `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
7. Deploy, then run `npm run seed` once (locally, pointed at the Atlas URI) to create your admin account and sample items.

## 3. Frontend — Vercel

1. Go to https://vercel.com → New Project → import the same repo.
2. Set **Root Directory** to `Task2_FeedbackPortal/frontend`.
3. Add environment variable: `VITE_API_URL` = your Render backend URL + `/api`.
4. Deploy, then update `CLIENT_URL` on Render to match your Vercel URL and redeploy.

## Submission Checklist (per CodeBricks instructions)

- [ ] Push code to your `codebricks_tasks` GitHub repo as `Task2_FeedbackPortal`
- [ ] Record a short LinkedIn video walkthrough (browsing items, submitting a review, admin approving/rejecting)
- [ ] Post on LinkedIn tagging @CodeBricks with the video + repo link
- [ ] Submit via the official CodeBricks submission form
