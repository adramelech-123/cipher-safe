import { useIsAuthenticated, useUser } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;