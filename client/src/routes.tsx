import { createBrowserRouter } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoutes from "./components/ProtectedRoutes";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes><></></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
    ],
  },

  {
    path: "/signup",
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
    errorElement: <ErrorPage />,
  },
]);

export default router