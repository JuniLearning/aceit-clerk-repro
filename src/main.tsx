import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/clerk-react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Home } from './pages/Home';
import { MagicLinkVerification, SignIn, SignUp } from './pages/Auth';

const PageWithUser: React.FC<{
  Page: React.FC<{ user: any }>;
}> = ({ Page }) => {
  const { user } = useUser();

  if (!user) return <div>Not authenticated</div>;

  return <Page user={user} />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWithUser Page={Home} />,
  },
  { path: '*', element: <Navigate replace to="/" /> },
]);

const signUpRouter = createBrowserRouter([
  {
    path: '/sign-in',
    element: (
      <ClerkLoaded>
        <SignIn />
      </ClerkLoaded>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
    ),
  },
  {
    path: '/verification', // route that handles the magic link result
    element: (
      <ClerkLoaded>
        <MagicLinkVerification />
      </ClerkLoaded>
    ),
  },
  { path: '*', element: <Navigate replace to="/sign-in" /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignedOut>
        <RouterProvider router={signUpRouter} />
      </SignedOut>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
    </ClerkProvider>
  </React.StrictMode>,
);
