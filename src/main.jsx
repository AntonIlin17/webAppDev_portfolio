import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

// Eager load Home for fast initial render
import Home from './pages/Home.jsx';

// Lazy load other routes for code splitting (performance optimization)
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Education = lazy(() => import('./pages/Education.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <p>Loading...</p>
  </div>
);

// Wrap lazy components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Router config: App is the layout; child routes render in <Outlet />
// Note: Home reads optional state (submittedName) for a banner after form submit
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: withSuspense(About) },
      { path: "contact", element: withSuspense(Contact) },
      { path: "projects", element: withSuspense(Projects) },
      { path: "education", element: withSuspense(Education) },
      { path: "services", element: withSuspense(Services) },
      { path: "login", element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
      { path: "dashboard", element: withSuspense(Dashboard) },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
