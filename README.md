# Orphanage Center

Orphanage Center is a university Software Engineering project for managing and supporting orphanage center workflows. The platform combines a public-facing website for visitors and registered users with an administrative dashboard for center staff.

The project is built as a full-stack web application with a React/Vite frontend and an Express.js backend connected to MySQL through Sequelize. It includes authentication, protected admin APIs, Swagger documentation, Docker-based local backend/database setup, and an Arabic RTL FAQ-style AI chatbot.

## Features

### Public/User Side

- Home page and public informational sections
- Orphan listing and orphan details pages
- Help request form with backend validation
- Donation-related page and form
- Sponsorship/kafala-related pages and request form
- Contact/support-oriented sections
- Floating Arabic RTL AI FAQ chatbot

### Admin Side

- Admin dashboard with backend API integration
- Protected admin layout in the frontend
- Admin-only backend routes guarded by JWT authentication and role checks
- Orphan management views
- Help request review and status workflow
- Sponsorship request review workflow
- Donation list/admin integration

### Authentication

- Local registration and login
- Email verification and password reset routes
- JWT access and refresh token flow
- Facebook OAuth integration through Passport
- Google OAuth support is also present in the backend code
- Admin access is restricted by authenticated user role

### API/Backend

- Express REST API
- Sequelize models and MySQL database integration
- Swagger/OpenAPI documentation
- Central API response helpers
- Docker Compose setup for backend and MySQL

> Note: Some business modules, especially donation/payment and sponsorship workflows, are implemented as project integrations and should be reviewed before production use. This README avoids claiming production readiness or full operational completeness.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- TailwindCSS
- Material UI
- Axios / Fetch API
- React Hook Form
- Zod

### Backend

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT Authentication
- Passport Facebook OAuth
- Swagger/OpenAPI
- Docker / Docker Compose

### AI Chatbot

- Arabic RTL floating chatbot widget
- Backend-protected Gemini API integration
- FAQ-style assistant for general center questions
- Safe fallback handling when the AI provider is unavailable or not configured
- No chatbot conversation persistence in the database

## Project Structure

```text
webProject/
  client/                 # React + Vite frontend
    src/
      components/         # Shared UI components
      layouts/            # Public and admin layouts
      pages/              # Public, auth, and admin pages
      services/           # Frontend API service helpers
      context/            # React context providers
      utils/              # Shared frontend utilities

  server/                 # Express backend
    src/
      app.js              # Express app setup
      server.js           # Server startup and database sync
      config/             # Database, JWT, Passport, Stripe config
      controllers/        # Request handlers
      docs/               # Swagger/OpenAPI setup
      middleware/         # Auth, admin, validation middleware
      models/             # Sequelize models
      routes/             # API route modules
      schemas/            # Zod validation schemas
      services/           # Business/service logic
      utils/              # API, JWT, email, crypto helpers
    docker-compose.yml    # Backend + MySQL local setup
    Dockerfile

  run-full-web.sh         # Helper script for Docker backend + frontend
```

## Prerequisites

- Node.js 20+
- npm
- MySQL 8 or Docker Desktop
- A Gemini API key for the chatbot feature
- Facebook OAuth app credentials if Facebook login is enabled

## Environment Variables

Create a backend environment file from the example:

```bash
cd server
cp .env.example .env
```

On Windows PowerShell:

```powershell
cd server
Copy-Item .env.example .env
```

Example backend variables:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3308
DB_NAME=orphancenter_db
DB_USER=root
DB_PASSWORD=your_db_password
DB_DIALECT=mysql
DB_LOGGING=false

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

CLIENT_URL=http://localhost:5173

GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_API_KEY=your_gemini_api_key
```

Optional variables used by parts of the codebase:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password
MAIL_FROM_NAME=OrphanCenter
MAIL_FROM_ADDRESS=noreply@example.com

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Frontend API configuration can be placed in `client/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

Do not commit real secrets, API keys, OAuth credentials, or database passwords.

## Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

## Running Locally

### Backend

Start the backend from the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

### Frontend

Start the frontend from the `client` directory:

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Docker Setup

The backend includes a Docker Compose setup for the Express app and MySQL database.

From the `server` directory, start MySQL only:

```bash
docker compose up -d db
```

Or start both backend and database:

```bash
docker compose up --build
```

Docker Compose exposes:

```text
Backend: http://localhost:5000
MySQL:   localhost:3308
```

The root helper script `run-full-web.sh` can also start the Docker backend/database and the Vite frontend together on compatible shell environments.

## API Documentation

Swagger UI is available after starting the backend:

```text
http://localhost:5000/api-docs
```

Useful API entry points:

```text
GET  /health
GET  /api
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/orphans
POST /api/help-requests
POST /api/sponsorship-requests
POST /api/chatbot
GET  /api/admin/dashboard
```

Protected admin routes require:

```text
Authorization: Bearer <access_token>
```

## Authentication Overview

The backend uses JWT access tokens and refresh tokens for authenticated requests. Protected routes use authentication middleware, and admin routes additionally require the authenticated user to have the `admin` role.

The frontend admin layout verifies the current user by calling `/api/auth/me`. Users without a valid token are redirected to login, and non-admin users are redirected away from the admin area.

Facebook OAuth is configured through Passport and redirects back to the frontend with application-issued tokens. OAuth credentials must be provided through environment variables.

## AI Chatbot 🤖

The project includes a floating Arabic RTL chatbot widget on the public layout. The frontend sends user messages to the backend route:

```text
POST /api/chatbot
```

The backend builds a constrained FAQ-style prompt and calls Gemini using the server-side `GEMINI_API_KEY`. This keeps the AI key out of the frontend. If the key is missing or the provider is unavailable, the chatbot returns a safe fallback response instead of exposing internal errors.

The chatbot is intended for general questions about help requests, donations, sponsorship/kafala, and contacting the center. It does not access private database records or persist chat history.

## Screenshots

Add screenshots here when final UI captures are available.

```text
screenshots/
  home-page.png
  help-request-form.png
  donation-form.png
  sponsorship-page.png
  admin-dashboard.png
  chatbot-widget.png
```

## Team Notes

- This repository represents a university team project, so some modules may reflect shared or teammate-owned implementation boundaries.
- Keep real credentials in local `.env` files only.
- Use Swagger to verify backend routes while developing.
- Review payment/donation behavior carefully before using it outside a development environment.
- Admin functionality depends on valid JWT authentication and an admin-role user.

## Future Improvements

- Complete and harden donation/payment integration for real-world use
- Add more complete automated tests for frontend and backend workflows
- Improve validation and error messages across all forms
- Add role management screens for administrators
- Add audit logs for sensitive admin actions
- Add production deployment documentation when a real deployment exists
- Add finalized screenshots and demo walkthrough media
- Improve accessibility and responsive QA across all pages

## Educational Use

This project was created for educational purposes as part of a university Software Engineering course. It is not presented as a production-ready orphanage management system, and sensitive workflows such as payments, authentication, and personal data handling should be reviewed and strengthened before any real-world use.
