## Anton Ilin — Web App Dev Portfolio

A simple, fast portfolio built with React + Vite for COMP 229. It demonstrates client‑side routing, a contact flow that returns a success banner on Home, and a lightbox gallery for projects. Deployed easily on Vercel (SPA routing supported).

### Features
- React Router with nested routes and active link styling
- Contact form with client‑side validation and redirect feedback
- Lightbox for project screenshots with keyboard navigation
- Inline SVG logo component and global layout
- Ready for Vercel SPA deployment (fallback to index.html)

### Tech Stack
- React 19 + React DOM
- React Router DOM 7 (createBrowserRouter)
- Vite 7
- ESLint 9 (optional linting)

## Project Structure
- `src/main.jsx` — Router setup and app mount
- `src/App.jsx` — Shared layout, nav, footer, `<Outlet />`
- `src/pages/*` — Route components: Home, About, Projects, Education, Services, Contact
- `src/components/Logo/Logo.jsx` — Inline SVG logo linked to Home
- `src/components/Logo/Logo.html` — Standalone animated logo demo (not used by the app)
- `vercel.json` — SPA routing config for production

## Getting Started
1) Install dependencies
	- Windows PowerShell:
	  - `npm install`
2) Copy environment config
	- Duplicate `.env.example` as `.env` in the repo root and fill in values:
	  - `PORT=5000`
	  - `MONGODB_URI` — your MongoDB connection string (Atlas or local)
	  - `JWT_SECRET` — a long random string
3) Start the dev servers (client + server)
	- `npm run dev`
4) Build for production
	- `npm run build`
5) Preview the production build (optional)
	- `npm run preview`

## Scripts
- `npm run dev` — Start Vite (frontend) and Nodemon (backend) concurrently
- `npm run build` — Build to `dist/`
- `npm run preview` — Preview the build locally
- `npm run lint` — Run ESLint over the project

Server‑only helpers:
- `npm run server` — Run Nodemon for the backend only
- `npm run client` — Run Vite for the frontend only

## Backend (Express + MongoDB)

This project now includes a Node.js/Express backend with MongoDB (Mongoose) and JWT auth.

### Folder layout
- `server.js` — Express server entry (runs on port 5000 by default)
- `server/config/db.js` — MongoDB connection helper
- `server/models/*.js` — Mongoose models (contacts, projects, qualifications, users)
- `server/controllers/*.js` — CRUD and auth logic
- `server/routes/*.js` — REST endpoints mounted under `/api/*`
- `server/middleware/auth.js` — JWT protect middleware
- `server/middleware/errorHandler.js` — 404 and error responses
- `.env.example` — copy to `.env`

### Run both servers concurrently
The `dev` script launches Vite (frontend on 5173) and Nodemon (backend on 5000):

- `npm run dev` — runs `concurrently "vite" "nodemon server.js"`

If your instructor requires running from a separate client folder with `nodemon ../server.js`, this repo places `server.js` at the root. The equivalent here is already configured and acceptable.

### Environment variables (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/Portfolio?retryWrites=true&w=majority
JWT_SECRET=<long_random_string>
# Optional: for CORS in production
# CLIENT_ORIGIN=https://your-vercel-url.vercel.app
```

### REST API endpoints
Base URL: `http://localhost:5000`

- Contacts `/api/contacts`
	- GET `/` (all), GET `/:id`, POST `/` (protected), PUT `/:id` (protected), DELETE `/:id` (protected), DELETE `/` (protected)
- Projects `/api/projects` — same pattern as Contacts
- Qualifications `/api/qualifications` — same pattern as Contacts
- Users `/api/users`
	- Auth: `POST /register`, `POST /login`, `POST /logout` (protected), `GET /me` (protected)
	- CRUD: GET `/` (protected), GET `/:id` (protected), POST `/` (protected), PUT `/:id` (protected), DELETE `/:id` (protected), DELETE `/` (protected)

Auth returns a JWT and also sets an HTTP‑only `jwt` cookie. You can send the token via `Authorization: Bearer <token>` or rely on the cookie. CORS is configured for `http://localhost:5173` by default.

### Testing with Postman/Thunder Client
1. Register a user: `POST http://localhost:5000/api/users/register`
	 - JSON body: `{ "name": "Test User", "email": "test@example.com", "password": "Passw0rd!" }`
	 - Save the returned `token` or let the cookie be set
2. Auth check (me): `GET http://localhost:5000/api/users/me` with `Authorization: Bearer <token>`
3. Create a contact (protected): `POST http://localhost:5000/api/contacts`
	 - `{ "firstname":"Alice", "lastname":"Smith", "email":"alice@example.com" }`
4. List contacts: `GET http://localhost:5000/api/contacts`
5. Repeat for Projects and Qualifications. Take screenshots of successful responses for submission.

Tip: For delete‑all routes, call `DELETE` on the collection root (e.g., `/api/contacts`). Use cautiously.

## Deployment (Vercel)
This repo includes `vercel.json` to support SPA routing.

- Build command: `npm run build`
- Output directory: `dist`
- Routes: All unmatched paths fall back to `/index.html`

On first deploy, Vercel will detect the Vite project automatically. If using a different host, make sure your static host rewrites `/*` to `/index.html`.

## Customize Checklist
- `index.html` — `<title>` and inline favicon
- `src/App.jsx` — Footer name/year
- `src/pages/About.jsx` — Legal name and `assets/Anton_Ilin.pdf`
- `src/pages/Contact.jsx` — Email and phone
- `src/pages/Home.jsx` — Intro/mission text
- `src/pages/Projects.jsx` — Projects and screenshots
- `src/pages/Services.jsx` — Services and icons

## Accessibility & SEO
- Logo has `aria-label` and pages use semantic headings
- Images have alt text; expand descriptions as needed
- Consider adding `<meta name="description" ...>` in `index.html`

## Troubleshooting
- Dev server won’t start: remove any processes on the port or set a different port (e.g., `vite --port 5174`).
- SPA 404s on refresh in production: ensure your host rewrites to `/index.html` (covered by `vercel.json`).
- Import errors for assets: verify paths under `src/assets/`.
- Lint errors: run `npm run lint` and follow suggestions.

## License
MIT — free to use for learning and portfolio purposes.
