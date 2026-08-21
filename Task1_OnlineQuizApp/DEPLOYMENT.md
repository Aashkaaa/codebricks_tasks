# Deployment Guide

Free hosting: **Backend on Render**, **Frontend on Vercel**, **Database on MongoDB Atlas**.

## 1. Database — MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user (username + password).
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) for simplicity.
4. Copy your connection string — this is your `MONGO_URI`.

## 2. Backend — Render

1. Push this project to GitHub as `CodeBricks_Aashka_OnlineQuizApp`.
2. Go to https://render.com → New → Web Service → connect your repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (same as `.env`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel frontend URL, added after step 3)
   - `PORT` (Render sets this automatically, you can omit it)
7. Deploy. Once live, run the seed script once locally against the Atlas URI (or via Render's shell) to create your admin account:
   ```bash
   npm run seed
   ```

## 3. Frontend — Vercel

1. Go to https://vercel.com → New Project → import the same repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api` (e.g. `https://your-app.onrender.com/api`)
4. Deploy.
5. Go back to Render and update `CLIENT_URL` to your new Vercel URL, then redeploy the backend so CORS allows it.

## 4. Verify

- Visit your Vercel URL, take the quiz, check the leaderboard updates.
- Log into `/admin/login` with your seeded admin credentials and add a question.

## Submission Checklist (per CodeBricks instructions)

- [ ] Push code to GitHub repo named `CodeBricks_Aashka_OnlineQuizApp`
- [ ] Record a short LinkedIn video walkthrough (show playing the quiz, leaderboard, and admin add/edit/delete)
- [ ] Post on LinkedIn tagging @CodeBricks with the video + repo link
- [ ] Submit via the official CodeBricks submission form
