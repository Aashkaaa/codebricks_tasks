# Feedback & Review Portal

Full-stack review platform built for the CodeBricks Full Stack Development internship (Task 4).

**Stack:** React (Vite) · Node.js · Express · MongoDB · JWT

## Features

- Browse items/services with average rating and review count
- Submit a star rating + written review for any item
- New reviews start as "pending" and are hidden from the public until approved
- Admin login (JWT-protected) to approve or reject pending reviews
- Admin can add or delete items (deleting an item also removes its reviews)

## Project Structure

```
Task2_FeedbackPortal/
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
npm run seed     # creates the admin account + 3 sample items
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

- Visit `http://localhost:5173` to browse items and leave a review.
- Visit `/admin/login` and log in with the credentials you set in `backend/.env` to approve/reject reviews and manage items.

## API Endpoints

| Method | Route                  | Access | Description                              |
|--------|-------------------------|--------|--------------------------------------------|
| POST   | /api/auth/login          | Public | Admin login, returns JWT                  |
| GET    | /api/items                 | Public | List items with average rating            |
| GET    | /api/items/:id               | Public | Item details + approved reviews           |
| POST   | /api/items                    | Admin  | Create a new item                          |
| DELETE | /api/items/:id                  | Admin  | Delete item + its reviews                  |
| POST   | /api/reviews                     | Public | Submit a review (starts as pending)        |
| GET    | /api/reviews/pending               | Admin  | List reviews awaiting approval             |
| GET    | /api/reviews/all                     | Admin  | List all reviews, any status               |
| PUT    | /api/reviews/:id/approve                | Admin  | Approve a pending review                   |
| DELETE | /api/reviews/:id                          | Admin  | Reject/remove a review                     |

## Notes for Submission

See `DEPLOYMENT.md` for deploying this to Vercel (frontend) and Render (backend) for free.
