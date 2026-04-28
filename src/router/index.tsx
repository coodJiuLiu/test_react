import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import App from '@/App';
import Home from '@/page/Home';
import User from '@/page/User';
import NotFound from '@/page/NotFound';
import Login from '@/page/Login';
import SystemSettings from '@/page/SystemSettings';
import { getToken, hasPermission } from '@/utils/auth';

function RequireAuth() {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function RequirePermission({ permission }: { permission: string }) {
  if (!hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            element: <RequirePermission permission="user:view" />,
            children: [
              {
                path: 'user',
                element: <User />,
              },
            ],
          },
          {
            element: <RequirePermission permission="settings:view" />,
            children: [
              {
                path: 'system-settings',
                element: <SystemSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
