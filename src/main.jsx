import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home.jsx'
import {AuthLayout, Login} from './components/index.js'

import Signup from './pages/Signup.jsx'

import Profile from './pages/Profile.jsx'

import Chat from './pages/Chat.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public Routes
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        )
      },

      // Protected Routes
      {
        path: '/profile-setup',
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        )
      },
      {
        path: '/chat',
        element: (
          <AuthLayout authentication={true}>
            <Chat />
          </AuthLayout>
        )
      },
      {
        path: '/chat/:roomId',
        element: (
          <AuthLayout authentication={true}>
            <Chat />
          </AuthLayout>
        )
      },

      // ✅ ADD THIS (ALWAYS LAST)
      {
        path: "*",
        element: (
          <div className="h-full flex items-center justify-center text-white text-3xl">
            404 — Page Not Found
          </div>
        )
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
