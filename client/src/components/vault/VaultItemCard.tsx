import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreVertical,
  Key,
  Terminal,
  KeyRound,
  CreditCard,
  FileText,
  Globe,
  User,
  Lock,
  Clock,
  Tag,
  Pin,
  PinOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VAULT_TYPE_CLASSES, VAULT_TYPE_LABELS, VaultItemType, VaultItem } from "@/types";
import { cn } from "@/lib/utils";
import { useVaultStore } from "@/store/vaultStore";
import toast from "react-hot-toast";

interface VaultItemCardProps {
  item: VaultItem;
  type: VaultItemType;
  compact?: boolean;
  onOpen?: (item: VaultItem, type: VaultItemType, mode?: "view" | "edit") => void;
}

interface SecondaryInfo {
  icon: LucideIcon;
  value: string;
  label?: string;
}

const VaultItemCard = ({ item, type, compact = false, onOpen }: VaultItemCardProps) => {
  const [showSecret, setShowSecret] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { deleteItem } = useVaultStore();

  const classes = VAULT_TYPE_CLASSES[type];
  const typeLabel = VAULT_TYPE_LABELS[type];
  const entry = item as unknown as Record<string, unknown>;

  const getSecretValue = (): string => {
    switch (type) {
      case "passwords":
        return entry.password as string;
      case "ssh-keys":
        return entry.privateKey as string;
      case "api-keys":
        return entry.secretKey as string;
      case "credit-cards":
        return entry.encryptedToken as string;
      case "secure-notes":
        return entry.content as string;
      default:
        return "";
    }
  };

  const getSecretLabel = (): string => {
    switch (type) {
      case "passwords": return "Password";
      case "ssh-keys": return "Private Key";
      case "api-keys": return "Secret Key";
      case "credit-cards": return "Token";
      case "secure-notes": return "Content";
      default: return "Secret";
    }
  };

  const getSecondaryInfo = (): SecondaryInfo[] => {
    const info: SecondaryInfo[] = [];
    switch (type) {
      case "passwords":
        if (entry.username) info.push({ icon: User, value: entry.username as string, label: "Username" });
        if (entry.website) info.push({ icon: Globe, value: entry.website as string, label: "Website" });
        if (entry.category) info.push({ icon: Tag, value: entry.category as string, label: "Category" });
        break;
      case "ssh-keys":
        if (entry.host) info.push({ icon: Globe, value: entry.host as string, label: "Host" });
        if (entry.username) info.push({ icon: User, value: entry.username as string, label: "Username" });
        if (entry.keyType) info.push({ icon: Key, value: String(entry.keyType).toUpperCase(), label: "Type" });
        break;
      case "api-keys":
        if (entry.provider) info.push({ icon: Globe, value: entry.provider as string, label: "Provider" });
        if (entry.keyId) info.push({ icon: Key, value: entry.keyId as string, label: "Key ID" });
        break;
      case "credit-cards":
        if (entry.cardType) info.push({ icon: CreditCard, value: String(entry.cardType).toUpperCase(), label: "Type" });
        if (entry.last4) info.push({ icon: Lock, value: `•••• ${entry.last4}`, label: "Last 4" });
        if (entry.expiryMonth && entry.expiryYear) info.push({ icon: Clock, value: `${entry.expiryMonth}/${entry.expiryYear}`, label: "Expires" });
        break;
      case "secure-notes":
        if (entry.format) info.push({ icon: FileText, value: entry.format as string, label: "Format" });
        break;
    }
    return info;
  };

  const copyToClipboard = async (value: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      try {
        await deleteItem(type, item._id);
        toast.success("Item deleted");
      } catch {
        toast.error("Failed to delete");
      }
      setShowMenu(false);
    }
  };

  const secretValue = getSecretValue();
  const displayValue = showSecret ? secretValue : "•".repeat(Math.min(secretValue.length, 20));
  const isPinned = !!entry.isPinned;

  const handleOpen = (mode: "view" | "edit" = "view") => {
    setShowMenu(false);
    onOpen?.(item, type, mode);
  };

  if (compact) {
    return (
      <Card
        className={cn(
          "border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer",
          isPinned && "border-violet-500/30"
        )}
        onClick={() => handleOpen("view")}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                classes.iconBox
              )}
            >
              {type === "passwords" && <Key size={20} />}
              {type === "ssh-keys" && <Terminal size={20} />}
              {type === "api-keys" && <KeyRound size={20} />}
              {type === "credit-cards" && <CreditCard size={20} />}
              {type === "secure-notes" && <FileText size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white truncate">{item.title}</h3>
                {isPinned && <Pin className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                {getSecondaryInfo().map((info, i) => (
                  <span key={i} className="flex items-center gap-1 truncate">
                    <info.icon size={12} />
                    <span>{info.value}</span>
                  </span>
                ))}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs rounded">#{tag}</span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-xs rounded">+{item.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(secretValue, getSecretLabel());
                }}
                aria-label={`Copy ${getSecretLabel()}`}
              >
                {copiedField === getSecretLabel() ? <Copy className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer",
        isPinned && "border-violet-500/30"
      )}
      onClick={() => handleOpen("view")}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                classes.iconBox
              )}
            >
              {type === "passwords" && <Key size={24} />}
              {type === "ssh-keys" && <Terminal size={24} />}
              {type === "api-keys" && <KeyRound size={24} />}
              {type === "credit-cards" && <CreditCard size={24} />}
              {type === "secure-notes" && <FileText size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white truncate">{item.title}</h3>
                {isPinned && <Pin className="w-4 h-4 text-amber-400" />}
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    classes.iconBox
                  )}
                >
                  {typeLabel}
                </span>
              </div>

              <div className="space-y-2">
                {getSecondaryInfo().map((info, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <info.icon size={14} className="text-slate-400" />
                    <span className="truncate font-mono text-xs">{info.value}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <Label className="text-xs text-slate-400 w-20">{getSecretLabel()}:</Label>
                  <div className="flex-1 flex items-center gap-2">
                    <code className="flex-1 font-mono text-sm bg-white/5 px-3 py-2 rounded-lg break-all">
                      {displayValue}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSecret(!showSecret);
                      }}
                      aria-label={showSecret ? "Hide secret" : "Show secret"}
                    >
                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(secretValue, getSecretLabel());
                      }}
                      aria-label={`Copy ${getSecretLabel()}`}
                    >
                      {copiedField === getSecretLabel() ? (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          className="text-green-400"
                        >
                          <Copy size={16} />
                        </motion.span>
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs rounded">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              aria-label="More options"
            >
              <MoreVertical size={20} />
            </Button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-40 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-1 shadow-lg z-10"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2"
                    onClick={() => {
                      copyToClipboard(secretValue, getSecretLabel());
                      setShowMenu(false);
                    }}
                  >
                    <Copy size={16} />
                    Copy {getSecretLabel()}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2"
                    onClick={() => handleOpen("view")}
                  >
                    <Eye size={16} />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2"
                    onClick={() => handleOpen("edit")}
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 px-3 py-2",
                      isPinned ? "text-amber-400 hover:text-amber-300" : "text-slate-300 hover:text-white"
                    )}
                    onClick={() => {
                      // Toggle pin
                      setShowMenu(false);
                    }}
                  >
                    {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    {isPinned ? "Unpin" : "Pin"}
                  </Button>
                  <hr className="border-white/10 my-1" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2"
                    onClick={handleDelete}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-4 flex items-center justify-between text-xs text-slate-400">
        <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
        {!!entry.lastUsed && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Last used {new Date(entry.lastUsed as string).toLocaleDateString()}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default VaultItemCard;