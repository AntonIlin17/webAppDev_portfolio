# Web App Dev Portfolio

A small React + Vite portfolio used for COMP 229 assignment. It showcases routing, simple state handling, and a lightbox gallery.

## Tech
- React 18
- Vite
- React Router (createBrowserRouter)

## App Structure
- `src/main.jsx` — router setup and app mount
- `src/App.jsx` — shared layout, nav, footer
- `src/pages/*` — route components: Home, About, Projects, Education, Services, Contact
- `src/components/Logo/Logo.jsx` — inline SVG logo linked to Home
- `src/components/Logo/Logo.html` — standalone logo demo (not used by the app)

## Run locally
1. Install deps
	- Windows PowerShell:
	  - `npm install`
2. Start dev server
	- `npm run dev`
3. Build for production
	- `npm run build`

## Personalize (check and update)
- `index.html` — `<title>` and favicon (optional)
- `src/App.jsx` — footer copyright name
- `src/pages/About.jsx` — legal name and `assets/Anton_Ilin.pdf` resume file
- `src/pages/Contact.jsx` — email address and phone number
- `src/pages/Home.jsx` — intro/mission text
- `src/pages/Projects.jsx` — project descriptions and images
- `src/pages/Services.jsx` — services list and icons

## Notes
- Navigation uses nested routes with an `<Outlet />` in `App.jsx`.
- Contact form just logs to the console and routes back to Home with a success banner; no backend.
