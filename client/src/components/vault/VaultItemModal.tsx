import { useState } from "react";
import type { ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader, Trash2, Edit } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import PasswordForm from "./forms/PasswordForm";
import SSHKeyForm from "./forms/SSHKeyForm";
import APIKeyForm from "./forms/APIKeyForm";
import CreditCardForm from "./forms/CreditCardForm";
import SecureNoteForm from "./forms/SecureNoteForm";
import VaultItemDetails from "./VaultItemDetails";
import { VaultItemType, VAULT_TYPE_LABELS, VAULT_TYPE_ICONS, VAULT_TYPE_CLASSES, VaultItem, CreateVaultItemDTO } from "@/types";
import { cn } from "@/lib/utils";
import { useVaultStore } from "@/store/vaultStore";
import toast from "react-hot-toast";

export type VaultItemModalMode = "view" | "edit" | "create";

interface VaultItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: VaultItemType;
  initialData?: VaultItem;
  initialMode?: VaultItemModalMode;
  onSuccess?: () => void;
}

type FormComponentProps = {
  defaultValues?: VaultItem;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
  onCancel: () => void;
};

const formComponents: Record<VaultItemType, ComponentType<FormComponentProps>> = {
  passwords: PasswordForm as ComponentType<FormComponentProps>,
  "ssh-keys": SSHKeyForm as ComponentType<FormComponentProps>,
  "api-keys": APIKeyForm as ComponentType<FormComponentProps>,
  "credit-cards": CreditCardForm as ComponentType<FormComponentProps>,
  "secure-notes": SecureNoteForm as ComponentType<FormComponentProps>,
};

const VaultItemModal = ({
  isOpen,
  onClose,
  type: initialType,
  initialData,
  initialMode = "create",
  onSuccess,
}: VaultItemModalProps) => {
  const [activeType, setActiveType] = useState<VaultItemType>(initialType || "passwords");
  const [mode, setMode] = useState<VaultItemModalMode>(initialData ? initialMode : "create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { createItem, updateItem, deleteItem } = useVaultStore();

  const isEditing = mode === "edit";
  const isViewing = mode === "view";
  const FormComponent = formComponents[activeType];
  const ActiveIcon = VAULT_TYPE_ICONS[activeType];

  const typeOptions: { value: VaultItemType; label: string; icon: LucideIcon; classes: (typeof VAULT_TYPE_CLASSES)[VaultItemType] }[] = [
    { value: "passwords", label: "Password", icon: VAULT_TYPE_ICONS.passwords, classes: VAULT_TYPE_CLASSES.passwords },
    { value: "ssh-keys", label: "SSH Key", icon: VAULT_TYPE_ICONS["ssh-keys"], classes: VAULT_TYPE_CLASSES["ssh-keys"] },
    { value: "api-keys", label: "API Key", icon: VAULT_TYPE_ICONS["api-keys"], classes: VAULT_TYPE_CLASSES["api-keys"] },
    { value: "credit-cards", label: "Credit Card", icon: VAULT_TYPE_ICONS["credit-cards"], classes: VAULT_TYPE_CLASSES["credit-cards"] },
    { value: "secure-notes", label: "Secure Note", icon: VAULT_TYPE_ICONS["secure-notes"], classes: VAULT_TYPE_CLASSES["secure-notes"] },
  ];

  const getSaveErrorMessage = (error: unknown): string => {
    const data = (error as { response?: { data?: { message?: string; errors?: string[] } } }).response?.data;
    if (data?.message) return data.message;
    if (data?.errors?.length) return data.errors[0];
    return "Failed to save item";
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        await updateItem(activeType, initialData._id, data as unknown as Partial<CreateVaultItemDTO>);
      } else {
        await createItem(activeType, data as unknown as CreateVaultItemDTO);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error(getSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    setIsSubmitting(true);
    try {
      await deleteItem(activeType, initialData._id);
      toast.success("Item deleted");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-white"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
      >
        <CardHeader className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={20} />
            </Button>
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                VAULT_TYPE_CLASSES[activeType].iconBox
              )}
            >
              <ActiveIcon size={20} />
            </div>
            <div>
              <h3 id="modal-title" className="text-lg font-semibold text-white">
                {isViewing
                  ? initialData?.title ?? "Item Details"
                  : isEditing
                    ? "Edit"
                    : "Add"}{" "}
                {isViewing ? "" : VAULT_TYPE_LABELS[activeType]}
              </h3>
              <p className="text-xs text-slate-400">
                {isViewing
                  ? VAULT_TYPE_LABELS[activeType]
                  : isEditing
                    ? `Editing "${initialData?.title}"`
                    : `Create a new ${VAULT_TYPE_LABELS[activeType].toLowerCase()}`}
              </p>
            </div>
          </div>
          {isViewing && (
            <Button onClick={() => setMode("edit")} disabled={isSubmitting}>
              <Edit className="mr-2" size={16} />
              Edit
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {!isViewing && (
            <div className="border-b border-white/10 px-4 py-3 overflow-x-auto">
              <nav className="flex gap-1" aria-label="Item type selection">
                {typeOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={activeType === opt.value ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm",
                      activeType === opt.value
                        ? opt.classes.buttonActive
                        : "bg-white/5 hover:bg-white/10 border-white/20 text-slate-300"
                    )}
                    onClick={() => !isEditing && setActiveType(opt.value)}
                    disabled={isEditing || isSubmitting}
                  >
                    {opt.icon && <opt.icon size={14} />}
                    {opt.label}
                  </Button>
                ))}
              </nav>
            </div>
          )}

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {isViewing && initialData ? (
              <VaultItemDetails item={initialData} type={activeType} />
            ) : (
              <FormComponent
                defaultValues={initialData}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                onCancel={handleCancel}
              />
            )}
          </div>
        </CardContent>

        {isSubmitting && (
          <CardFooter className="px-6 py-3 border-t border-white/10">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <Loader className="animate-spin" size={20} />
              <span>{isEditing ? "Updating..." : isViewing ? "Deleting..." : "Saving..."}</span>
            </div>
          </CardFooter>
        )}

        {isViewing && (
          <CardFooter className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
            <AnimatePresence mode="wait">
              {confirmDelete ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-red-300">Delete this item?</span>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isSubmitting}>
                    <Trash2 className="mr-1.5" size={14} />
                    Yes, Delete
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-3"
                >
                  <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                    onClick={() => setConfirmDelete(true)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="mr-1.5" size={16} />
                    Delete
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        )}
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default VaultItemModal;