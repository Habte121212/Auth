# 🔐 Full Stack Authentication System

> A modern, production-ready authentication solution built with React, Node.js/Express, Prisma, and MySQL. Designed for scalability, security, and a seamless user experience. Ideal for SaaS, dashboards, and any app requiring robust auth.

---

## 🚀 Key Features

- **User Registration & Email Verification**
  - 1-hour expiry, beautiful HTML email, secure tokens
  - Rate-limited resend (max 3 per 24h, enforced frontend & backend)
- **Login**
  - Email/password or Google OAuth (Passport.js)
  - Only verified users can log in
- **JWT Auth with HTTP-only Cookies**
  - Secure, stateless sessions
- **Password Reset**
  - Email-based, time-limited, secure
- **Protected Routes**
  - Both backend (Express middleware) and frontend (React Context)
- **Modern React Frontend**
  - Vite, React Router v6, Context API, custom spinner, toast notifications
- **Prisma ORM & MySQL**
  - Scalable, type-safe schema
- **No Auto-Login After Verification**
  - User must log in after verifying for maximum security

---

## 🛠️ Tech Stack

**Backend:**

- Node.js, Express, Prisma ORM, MySQL
- Passport.js (Google OAuth)
- Nodemailer (Gmail SMTP)
- Joi (validation)

**Frontend:**

- React (Vite), React Router v6
- Context API for auth state
- react-spinners, react-toastify, Sass

**Email:**

- Styled HTML (gradient button, responsive, brand logo)
- Secure token links, 1-hour expiry

---

## 📦 Folder Structure

```
Auth/
  server/   # Express backend, Prisma, routes, controllers, email logic
  client/   # React frontend, context, pages, styles
```

---

## ⚡ Quick Start

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd Auth
   ```
2. **Install dependencies:**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` in `server/` and fill in DB, email, Google OAuth, etc.
4. **Run Prisma migrations:**
   ```bash
   cd ../server
   npx prisma migrate dev
   ```
5. **Start backend:**
   ```bash
   npm run dev
   ```
6. **Start frontend:**
   ```bash
   cd ../client
   npm run dev
   ```

---

## 🔒 Security Highlights

- CSRF protection and HTTP-only cookies for all sensitive actions
- Email verification and password reset tokens are time-limited and securely generated
- Rate limiting for verification resends (3 per 24h, enforced both client and server)
- No auto-login after verification for maximum security

---

## 📝 How It Works (User Flow)

1. **Register:** User signs up, receives a verification email (expires in 1 hour)
2. **Verify:** User clicks the link, sees a spinner, then is redirected to login (must enter credentials)
3. **Login:** Only verified users can log in (email/password or Google)
4. **Resend Verification:** Max 3 resends per 24 hours, with clear frontend warnings
5. **Password Reset:** Secure, email-based reset flow

---

## 💡 Customization & Extensibility

- Swap MySQL for PostgreSQL or SQLite by updating Prisma schema and connection string
- Add more OAuth providers (see Passport.js docs)
- Extend user model with roles, profile, etc.
- Customize email templates (HTML in `server/utils/email.js`)

---

## 📄 License

MIT — Free to use and customize for personal or commercial projects.
