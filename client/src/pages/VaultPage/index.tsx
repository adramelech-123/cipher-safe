import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVaultStore } from "@/store/vaultStore";
import { useAuthStore } from "@/store/authStore";
import VaultLayout from "@/components/vault/VaultLayout";

const VaultPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { isUnlocked, unlockVault, fetchAll } = useVaultStore();

  useEffect(() => {
    if (isAuthenticated && user && !isUnlocked) {
      navigate("/vault/unlock");
    } else if (isAuthenticated && isUnlocked) {
      fetchAll();
    }
  }, [isAuthenticated, isUnlocked, user, navigate, unlockVault, fetchAll]);

  if (!isAuthenticated) {
    return null;
  }

  return <VaultLayout />;
};

export default VaultPage;