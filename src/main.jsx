import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import './index.css'
import App from './App.jsx'
// Route components (each file under src/pages)
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Projects from './pages/Projects.jsx';
import Education from './pages/Education.jsx';
import Services from './pages/Services.jsx';

// Router config: App is the layout; child routes render in <Outlet />
// Note: Home reads optional state (submittedName) for a banner after form submit
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "projects", element: <Projects /> },
      { path: "education", element: <Education /> },
      { path: "services", element: <Services /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
