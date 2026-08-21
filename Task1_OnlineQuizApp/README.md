# Online Quiz Application

Full-stack timed multiple-choice quiz app built for the CodeBricks Full Stack Development internship (Task 2).

**Stack:** React (Vite) · Node.js · Express · MongoDB · JWT

## Features

- Timed multiple-choice quiz (20s per question) with live countdown
- Score calculated server-side (prevents client-side cheating)
- Leaderboard showing top 10 scores, ranked by score then time
- Admin login (JWT-protected) to add, edit, and delete quiz questions
- Correct answers are never exposed to the public quiz endpoint

## Project Structure

```
CodeBricks_Aashka_OnlineQuizApp/
├── backend/          Express API + MongoDB models
└── frontend/         React (Vite) client
```

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
npm run seed     # creates the admin account + 5 sample questions
npm run dev      # starts server on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm run dev      # starts client on http://localhost:5173
```

### 3. Try it out

- Visit `http://localhost:5173` to take the quiz as a player.
- Visit `/admin/login` and log in with the credentials you set in `backend/.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`) to add/edit/delete questions.
- Visit `/leaderboard` to see top scores.

## API Endpoints

| Method | Route                     | Access | Description                          |
|--------|----------------------------|--------|---------------------------------------|
| POST   | /api/auth/login             | Public | Admin login, returns JWT              |
| GET    | /api/questions               | Public | Get quiz questions (no answers)       |
| GET    | /api/questions/admin         | Admin  | Get all questions with answers        |
| POST   | /api/questions                | Admin  | Create a question                     |
| PUT    | /api/questions/:id             | Admin  | Update a question                     |
| DELETE | /api/questions/:id              | Admin  | Delete a question                     |
| POST   | /api/scores/submit               | Public | Submit quiz answers, get score        |
| GET    | /api/scores/leaderboard            | Public | Get top 10 scores                     |

## Notes for Submission

See `DEPLOYMENT.md` for deploying this to Vercel (frontend) and Render (backend) for free.
