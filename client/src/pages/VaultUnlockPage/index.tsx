import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import BrandHeader from "@/components/BrandHeader";
import { useVaultStore } from "@/store/vaultStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const VaultUnlockPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { unlockVault } = useVaultStore();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    try {
      await unlockVault(password);
      toast.success("Vault unlocked successfully!");
      navigate("/vault");
    } catch {
      toast.error("Incorrect password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <BrandHeader
            logoSize="w-20 h-20"
            headingSize="text-5xl"
            subTextSize="text-base"
          />
          <p className="text-slate-300 mt-2">Enter your password to unlock the vault</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Unlock Vault</CardTitle>
            <CardDescription className="text-center">
              Your vault is encrypted. Enter your password to decrypt and access your items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Master Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-12 bg-white/5 border-white/20 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mx-auto" size={20} />
                    <span className="ml-2">Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Lock className="mr-2" size={20} />
                    Unlock Vault
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-3 pt-4 border-t border-white/10">
            <p className="text-sm text-slate-400">
              Your password is never sent to the server. It's used locally to derive an encryption key.
            </p>
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-red-400"
              onClick={handleLogout}
            >
              Logout instead
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          CipherSafe &copy; 2024 - End-to-end encrypted password manager
        </p>
      </motion.div>
    </div>
  );
};

export default VaultUnlockPage;