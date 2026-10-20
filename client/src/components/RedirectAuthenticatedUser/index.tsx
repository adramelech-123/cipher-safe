import { useIsAuthenticated, useUser } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const RedirectAuthenticatedUser = () => {
    const isAuthenticated = useIsAuthenticated();
    const user = useUser();

    if (isAuthenticated && user?.isVerified) {
      return <Navigate to="/vault" replace />;
    }

  return <Outlet />;
};

export default RedirectAuthenticatedUser;
