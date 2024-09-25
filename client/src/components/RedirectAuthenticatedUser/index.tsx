import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";



interface AuthState {
  isAuthenticated: boolean;
  user: { isVerified: boolean } | null;
}

const RedirectAuthenticatedUser = () => {
    const { isAuthenticated, user } = useAuthStore() as AuthState;
    console.log(isAuthenticated, user)

    if (isAuthenticated && user?.isVerified) {
      return <Navigate to="/" replace />;
    }

  return <Outlet/>;
};

export default RedirectAuthenticatedUser;
