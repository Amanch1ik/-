import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './pages/App'
import { Login } from './pages/Login'
import { Partners } from './pages/Partners'
import { Dashboard } from './pages/Dashboard'
import { BonusCard } from './pages/BonusCard'
import { News } from './pages/News'
import { Profile } from './pages/Profile'
import { PartnerDetail } from './pages/PartnerDetail'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/login', element: <Login /> },
  { path: '/partners', element: <Partners /> },
  { path: '/partners/:id', element: <PartnerDetail /> },
  { path: '/card', element: <BonusCard /> },
  { path: '/news', element: <News /> },
  { path: '/profile', element: <Profile /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


