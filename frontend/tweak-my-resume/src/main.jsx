import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Login from "./components/Login.jsx"
import InvalidUrl from './components/InvalidUrl.jsx';

const router = createBrowserRouter([
  {
  path: "/",
  element: <App />,
  errorElement: <InvalidUrl />
 },
 {
  path: "/login",
  element: <Login />
 }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
