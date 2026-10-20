import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated, useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3.5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <img src="/ciphersafe.svg" alt="CipherSafe logo" className="w-9 h-9" />
          <Link to="/" className="flex items-center gap-1.5 font-black text-xl text-white">
            CipherSafe
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-slate-300 hover:text-white"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span className="ml-1">Logout</span>
              </Button>
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
                asChild
              >
                <Link to="/vault">
                  <Shield className="w-4 h-4 mr-1" />
                  Open Vault
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white"
                asChild
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </motion.div>
      </nav>
    </header>
  );
};

export default Navbar;