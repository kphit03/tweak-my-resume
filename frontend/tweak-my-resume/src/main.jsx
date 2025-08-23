import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Login from "./components/Login.jsx"
import InvalidUrl from './components/InvalidUrl.jsx';
import Testing from './components/Testing.jsx';

const apiUrl = import.meta.env.VITE_API_BASE_URL
const router = createBrowserRouter([
  {
  path: "/",
  element: <App apiUrl={apiUrl}/>,
  errorElement: <InvalidUrl />
 },
 {
  path: "/login",
  element: <Login apiUrl={apiUrl}/>
 },
 {
  path: "/testing",
  element: <Testing apiUrl={apiUrl}/>
 }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
