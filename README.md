# Full Stack Auth System (React + Node.js/Express + Prisma + MySQL)

## Features

- User registration with email verification (1-hour expiry, styled email, rate-limited resends)
- Login with email/password or Google OAuth (Passport.js)
- Secure JWT authentication with HTTP-only cookies
- Protected routes (frontend and backend)
- Password reset via email
- Modern React frontend (Vite, React Router v6, Context API)
- Custom spinner and UX for email verification flow
- No auto-login after verification; user must log in manually
- Prisma ORM with MySQL, scalable schema

## How It Works

1. **Register:** User signs up, receives a verification email.
2. **Verify:** User clicks the link, sees a spinner, then is redirected to the login page (must enter credentials).
3. **Login:** Only verified users can log in (email/password or Google).
4. **Resend Verification:** Max 3 resends per 24 hours, with clear frontend warnings.
5. **Password Reset:** Secure, email-based reset flow.

## Tech Stack

- **Backend:** Node.js, Express, Prisma, MySQL, Passport.js, Nodemailer, Joi
- **Frontend:** React, Vite, React Router, Context API, react-spinners, react-toastify, Sass
- **Email:** Gmail SMTP (Nodemailer), styled HTML with button and hover effect

## Setup

1. **Clone the repo** and install dependencies in both `server` and `client` folders.
2. **Configure `.env`** for backend (DB, email, Google OAuth).
3. **Run Prisma migrations** to set up the database.
4. **Start backend:** `node index.js` or `npm run dev`
5. **Start frontend:** `npm run dev` in the client folder.

## Folder Structure

- `server/` - Express backend, Prisma, routes, controllers, email logic
- `client/` - React frontend, context, pages, styles

## Security

- All sensitive actions use CSRF protection and HTTP-only cookies.
- Email verification and password reset tokens are time-limited and securely generated.
- No auto-login after verification for maximum security.

## License

MIT. Free to use and customize.
