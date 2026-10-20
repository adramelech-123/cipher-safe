import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import VaultGrid from "./VaultGrid";
import VaultItemModal, { VaultItemModalMode } from "./VaultItemModal";
import { useVaultStore } from "@/store/vaultStore";
import { VaultItem, VaultItemType } from "@/types";

const VAULT_TYPES: VaultItemType[] = ["passwords", "ssh-keys", "api-keys", "credit-cards", "secure-notes"];

interface ModalState {
  type: VaultItemType;
  initialData?: VaultItem;
  initialMode: VaultItemModalMode;
}

const VaultDashboard = () => {
  const { itemType } = useParams<{ itemType?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const items = useVaultStore((state) => state.items);

  const [modal, setModal] = useState<ModalState | null>(null);

  const activeType: VaultItemType | "all" =
    itemType && (VAULT_TYPES as string[]).includes(itemType)
      ? (itemType as VaultItemType)
      : "all";

  useEffect(() => {
    useVaultStore.getState().setFilters({ type: activeType });
  }, [activeType]);

  useEffect(() => {
    const shouldClear = (() => {
      if (searchParams.get("new") === "true") {
        if (activeType !== "all") {
          setModal({ type: activeType, initialMode: "create" });
          return true;
        }
        return false;
      }

      const editId = searchParams.get("edit");
      if (editId) {
        const entry = Object.entries(items).find(([, typeItems]) =>
          typeItems.some((item) => item._id === editId)
        );
        const type = entry?.[0] as VaultItemType | undefined;
        const found = entry?.[1].find((item) => item._id === editId);
        if (type && found) {
          setModal({ type, initialData: found, initialMode: "edit" });
          return true;
        }
      }

      return false;
    })();

    if (shouldClear) {
      const params = new URLSearchParams(searchParams);
      params.delete("new");
      params.delete("edit");
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, activeType, items, setSearchParams]);

  const openItem = (item: VaultItem, type: VaultItemType, mode: "view" | "edit" = "view") => {
    setModal({ type, initialData: item, initialMode: mode });
  };

  return (
    <>
      <VaultGrid onOpenItem={openItem} />
      <VaultItemModal
        key={modal ? modal.initialData?._id ?? modal.type : "closed"}
        isOpen={!!modal}
        type={modal?.type}
        initialData={modal?.initialData}
        initialMode={modal?.initialMode}
        onClose={() => setModal(null)}
      />
    </>
  );
};

export default VaultDashboard;