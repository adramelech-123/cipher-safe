import {
  Key,
  Terminal,
  KeyRound,
  CreditCard,
  FileText,
} from "lucide-react";

export type VaultItemType = "passwords" | "ssh-keys" | "api-keys" | "credit-cards" | "secure-notes";

export interface BaseVaultItem {
  _id: string;
  userId: string;
  title: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordEntry extends BaseVaultItem {
  type: "passwords";
  website?: string;
  username?: string;
  password: string;
  totpSecret?: string;
  category: "personal" | "work" | "finance" | "social" | "other";
  favicon?: string;
  lastUsed?: string;
}

export interface SSHKeyEntry extends BaseVaultItem {
  type: "ssh-keys";
  host?: string;
  port: number;
  username?: string;
  privateKey: string;
  publicKey?: string;
  passphrase?: string;
  keyType: "rsa" | "ed25519" | "ecdsa" | "ed25519-sk";
  fingerprint?: string;
}

export interface APIKeyEntry extends BaseVaultItem {
  type: "api-keys";
  provider: string;
  keyId?: string;
  secretKey: string;
  permissions: string[];
  expiresAt?: string;
  lastUsed?: string;
}

export interface CreditCardEntry extends BaseVaultItem {
  type: "credit-cards";
  cardType: "visa" | "mastercard" | "amex" | "discover" | "other";
  last4: string;
  cardBrand?: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName?: string;
  encryptedToken: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isDefault: boolean;
}

export interface SecureNoteEntry extends BaseVaultItem {
  type: "secure-notes";
  content: string;
  format: "plaintext" | "markdown";
  isPinned: boolean;
  color?: string;
}

export type VaultItem =
  | PasswordEntry
  | SSHKeyEntry
  | APIKeyEntry
  | CreditCardEntry
  | SecureNoteEntry;

export interface VaultStats {
  passwords: number;
  sshKeys: number;
  apiKeys: number;
  creditCards: number;
  secureNotes: number;
  total: number;
}

export interface CreatePasswordDTO {
  title: string;
  website?: string;
  username?: string;
  password: string;
  totpSecret?: string;
  category?: "personal" | "work" | "finance" | "social" | "other";
  tags?: string[];
  notes?: string;
}

export interface CreateSSHKeyDTO {
  title: string;
  host?: string;
  port?: number;
  username?: string;
  privateKey: string;
  publicKey?: string;
  passphrase?: string;
  keyType?: "rsa" | "ed25519" | "ecdsa" | "ed25519-sk";
  tags?: string[];
  notes?: string;
}

export interface CreateAPIKeyDTO {
  title: string;
  provider: string;
  keyId?: string;
  secretKey: string;
  permissions?: string[];
  expiresAt?: string;
  tags?: string[];
  notes?: string;
}

export interface CreateCreditCardDTO {
  title: string;
  cardType: "visa" | "mastercard" | "amex" | "discover" | "other";
  last4: string;
  cardBrand?: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName?: string;
  encryptedToken: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  tags?: string[];
  notes?: string;
  isDefault?: boolean;
}

export interface CreateSecureNoteDTO {
  title: string;
  content: string;
  format?: "plaintext" | "markdown";
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}

export type CreateVaultItemDTO =
  | CreatePasswordDTO
  | CreateSSHKeyDTO
  | CreateAPIKeyDTO
  | CreateCreditCardDTO
  | CreateSecureNoteDTO;

export interface VaultFilters {
  type: VaultItemType | "all";
  search: string;
  tags: string[];
  category?: string;
}

export interface VaultPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface VaultListResponse {
  success: boolean;
  items: VaultItem[];
  pagination: VaultPagination;
}

export interface VaultItemResponse {
  success: boolean;
  item: VaultItem;
}

export interface VaultStatsResponse {
  success: boolean;
  stats: VaultStats;
}

export const VAULT_TYPE_ICONS: Record<VaultItemType, typeof Key> = {
  passwords: Key,
  "ssh-keys": Terminal,
  "api-keys": KeyRound,
  "credit-cards": CreditCard,
  "secure-notes": FileText,
};

export const VAULT_TYPE_LABELS: Record<VaultItemType, string> = {
  passwords: "Passwords",
  "ssh-keys": "SSH Keys",
  "api-keys": "API Keys",
  "credit-cards": "Credit Cards",
  "secure-notes": "Secure Notes",
};

export const VAULT_TYPE_COLORS: Record<VaultItemType, string> = {
  passwords: "blue",
  "ssh-keys": "green",
  "api-keys": "orange",
  "credit-cards": "amber",
  "secure-notes": "purple",
};

export interface VaultTypeClasses {
  iconBox: string;
  iconBoxActive: string;
  navIcon: string;
  navIconActive: string;
  groupHover: string;
  border: string;
  buttonActive: string;
}

export const VAULT_TYPE_CLASSES: Record<VaultItemType, VaultTypeClasses> = {
  passwords: {
    iconBox: "bg-blue-500/20 text-blue-400",
    iconBoxActive: "bg-blue-500/30 text-blue-300",
    navIcon: "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20",
    navIconActive: "bg-blue-500/30 text-blue-300",
    groupHover: "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300",
    border: "border-blue-500/30",
    buttonActive: "bg-blue-600 text-white",
  },
  "ssh-keys": {
    iconBox: "bg-green-500/20 text-green-400",
    iconBoxActive: "bg-green-500/30 text-green-300",
    navIcon: "text-green-400 hover:text-green-300 hover:bg-green-500/20",
    navIconActive: "bg-green-500/30 text-green-300",
    groupHover: "bg-green-500/20 text-green-400 group-hover:bg-green-500/30 group-hover:text-green-300",
    border: "border-green-500/30",
    buttonActive: "bg-green-600 text-white",
  },
  "api-keys": {
    iconBox: "bg-orange-500/20 text-orange-400",
    iconBoxActive: "bg-orange-500/30 text-orange-300",
    navIcon: "text-orange-400 hover:text-orange-300 hover:bg-orange-500/20",
    navIconActive: "bg-orange-500/30 text-orange-300",
    groupHover: "bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30 group-hover:text-orange-300",
    border: "border-orange-500/30",
    buttonActive: "bg-orange-600 text-white",
  },
  "credit-cards": {
    iconBox: "bg-amber-500/20 text-amber-400",
    iconBoxActive: "bg-amber-500/30 text-amber-300",
    navIcon: "text-amber-400 hover:text-amber-300 hover:bg-amber-500/20",
    navIconActive: "bg-amber-500/30 text-amber-300",
    groupHover: "bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 group-hover:text-amber-300",
    border: "border-amber-500/30",
    buttonActive: "bg-amber-600 text-white",
  },
  "secure-notes": {
    iconBox: "bg-purple-500/20 text-purple-400",
    iconBoxActive: "bg-purple-500/30 text-purple-300",
    navIcon: "text-purple-400 hover:text-purple-300 hover:bg-purple-500/20",
    navIconActive: "bg-purple-500/30 text-purple-300",
    groupHover: "bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:text-purple-300",
    border: "border-purple-500/30",
    buttonActive: "bg-purple-600 text-white",
  },
};

export const CARD_TYPES = ["visa", "mastercard", "amex", "discover", "other"] as const;
export const KEY_TYPES = ["rsa", "ed25519", "ecdsa", "ed25519-sk"] as const;
export const CATEGORIES = ["personal", "work", "finance", "social", "other"] as const;
export const NOTE_FORMATS = ["plaintext", "markdown"] as const;