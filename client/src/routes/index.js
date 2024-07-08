import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Register from '../pages/Register'
import EmailVerify from '../pages/EmailVerify'

import Home from '../pages/Home'
import MessagePage from '../components/MessagePage'
import AuthLayout from '../layout'
import ForgotPassword from '../pages/ForgotPassword'
import PasswordVerify from '../pages/PasswordVerify'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: (
          <AuthLayout>
            <Register />
          </AuthLayout>
        ),
      },

      {
        path: 'email',
        element: (
          <AuthLayout>
            <EmailVerify />
          </AuthLayout>
        ),
      },

      {
        path: 'password',
        element: (
          <AuthLayout>
            <PasswordVerify />
          </AuthLayout>
        ),
      },

      {
        path: 'forgot-password',
        element: (
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        ),
      },

      {
        path: '',
        element: <Home />,
        children: [
          {
            path: ':userId',
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
])

export default router
