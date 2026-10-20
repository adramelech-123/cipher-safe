import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import {
  VaultItem,
  VaultItemType,
  VaultStats,
  VaultFilters,
  CreateVaultItemDTO,
} from "@/types";
import { apiClient } from "@/lib/api";
import {
  initializeEncryption,
  clearEncryption,
  encryptItemFields,
  decryptItemFields,
} from "@/lib/crypto";

const getErrorMessage = (error: unknown, fallback: string): string => {
  const response = (error as { response?: { data?: { message?: string; errors?: string[] } } }).response;
  const data = response?.data;
  if (data?.message) return data.message;
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) return data.errors[0];
  return fallback;
};

interface VaultState {
  items: Record<VaultItemType, VaultItem[]>;
  stats: VaultStats;
  filters: VaultFilters;
  viewMode: "grid" | "list";
  isLoading: boolean;
  isUnlocked: boolean;
  error: string | null;
  encryptionKey: CryptoKey | null;

  unlockVault: (password: string) => Promise<void>;
  lockVault: () => void;
  fetchAll: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchItems: (type: VaultItemType) => Promise<void>;
  createItem: (type: VaultItemType, data: CreateVaultItemDTO) => Promise<void>;
  updateItem: (type: VaultItemType, id: string, data: Partial<CreateVaultItemDTO>) => Promise<void>;
  deleteItem: (type: VaultItemType, id: string) => Promise<void>;
  bulkDelete: (type: VaultItemType, ids: string[]) => Promise<void>;
  setFilters: (filters: Partial<VaultFilters>) => void;
  setViewMode: (mode: "grid" | "list") => void;
  clearError: () => void;
  decryptItem: <T extends VaultItem>(item: T, type: VaultItemType) => Promise<T>;
  getDecryptedItems: (type: VaultItemType) => Promise<VaultItem[]>;
}

const initialItems: Record<VaultItemType, VaultItem[]> = {
  passwords: [],
  "ssh-keys": [],
  "api-keys": [],
  "credit-cards": [],
  "secure-notes": [],
};

const initialFilters: VaultFilters = {
  type: "all",
  search: "",
  tags: [],
};

const initialStats: VaultStats = {
  passwords: 0,
  sshKeys: 0,
  apiKeys: 0,
  creditCards: 0,
  secureNotes: 0,
  total: 0,
};

export const useVaultStore = create<VaultState>()(
  devtools(
    persist(
      (set, get) => ({
        items: initialItems,
        stats: initialStats,
        filters: initialFilters,
        viewMode: "grid",
        isLoading: false,
        isUnlocked: false,
        error: null,
        encryptionKey: null,

        unlockVault: async (password: string) => {
          try {
            set({ isLoading: true, error: null });
            const { key } = await initializeEncryption(password);
            set({ encryptionKey: key, isUnlocked: true, isLoading: false });
            await get().fetchAll();
          } catch (error) {
            set({
              error: "Failed to unlock vault. Please check your password.",
              isLoading: false,
              isUnlocked: false,
            });
            throw error;
          }
        },

        lockVault: () => {
          clearEncryption();
          set({
            isUnlocked: false,
            encryptionKey: null,
            items: initialItems,
            stats: initialStats,
          });
        },

        fetchAll: async () => {
          const { isUnlocked } = get();
          if (!isUnlocked) return;

          set({ isLoading: true, error: null });
          try {
            await Promise.all([
              get().fetchStats(),
              get().fetchItems("passwords"),
              get().fetchItems("ssh-keys"),
              get().fetchItems("api-keys"),
              get().fetchItems("credit-cards"),
              get().fetchItems("secure-notes"),
            ]);
            set({ isLoading: false });
          } catch (error) {
            set({ error: "Failed to fetch vault data", isLoading: false });
            throw error;
          }
        },

        fetchStats: async () => {
          try {
            const response = await apiClient.getVaultStats();
            if (response.success) {
              set({ stats: response.stats });
            }
          } catch (error) {
            console.error("Failed to fetch stats:", error);
          }
        },

        fetchItems: async (type: VaultItemType) => {
          const { encryptionKey } = get();
          if (!encryptionKey) return;

          try {
            const response = await apiClient.getAllItems(type);
            if (response.success) {
              const decryptedItems = await Promise.all(
                response.items.map((item) => decryptItemFields(item, type, encryptionKey))
              );
              set((state) => ({
                items: {
                  ...state.items,
                  [type]: decryptedItems,
                },
              }));
            }
          } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
          }
        },

        createItem: async (type: VaultItemType, data: CreateVaultItemDTO) => {
          const { encryptionKey } = get();
          if (!encryptionKey) throw new Error("Vault is locked");

          set({ isLoading: true, error: null });
          try {
            const encryptedData = await encryptItemFields(data, type, encryptionKey);
            const response = await apiClient.createItem(type, encryptedData);
            if (response.success) {
              const decryptedItem = await decryptItemFields(response.item, type, encryptionKey);
              set((state) => ({
                items: {
                  ...state.items,
                  [type]: [decryptedItem, ...state.items[type]],
                },
                stats: {
                  ...state.stats,
                  [type === "passwords" ? "passwords" : type === "ssh-keys" ? "sshKeys" : type === "api-keys" ? "apiKeys" : type === "credit-cards" ? "creditCards" : "secureNotes"]: state.stats[
                    type === "passwords" ? "passwords" : type === "ssh-keys" ? "sshKeys" : type === "api-keys" ? "apiKeys" : type === "credit-cards" ? "creditCards" : "secureNotes"
                  ] + 1,
                  total: state.stats.total + 1,
                },
                isLoading: false,
              }));
            }
          } catch (error) {
            set({ error: getErrorMessage(error, "Failed to create item"), isLoading: false });
            throw error;
          }
        },

        updateItem: async (type: VaultItemType, id: string, data: Partial<CreateVaultItemDTO>) => {
          const { encryptionKey } = get();
          if (!encryptionKey) throw new Error("Vault is locked");

          set({ isLoading: true, error: null });
          try {
            const encryptedData = await encryptItemFields(data, type, encryptionKey);
            const response = await apiClient.updateItem(type, id, encryptedData);
            if (response.success) {
              const decryptedItem = await decryptItemFields(response.item, type, encryptionKey);
              set((state) => ({
                items: {
                  ...state.items,
                  [type]: state.items[type].map((item) => (item._id === id ? decryptedItem : item)),
                },
                isLoading: false,
              }));
            }
          } catch (error) {
            set({ error: getErrorMessage(error, "Failed to update item"), isLoading: false });
            throw error;
          }
        },

        deleteItem: async (type: VaultItemType, id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.deleteItem(type, id);
            if (response.success) {
              set((state) => ({
                items: {
                  ...state.items,
                  [type]: state.items[type].filter((item) => item._id !== id),
                },
                stats: {
                  ...state.stats,
                  [type === "passwords" ? "passwords" : type === "ssh-keys" ? "sshKeys" : type === "api-keys" ? "apiKeys" : type === "credit-cards" ? "creditCards" : "secureNotes"]: state.stats[
                    type === "passwords" ? "passwords" : type === "ssh-keys" ? "sshKeys" : type === "api-keys" ? "apiKeys" : type === "credit-cards" ? "creditCards" : "secureNotes"
                  ] - 1,
                  total: state.stats.total - 1,
                },
                isLoading: false,
              }));
            }
          } catch (error) {
            set({ error: getErrorMessage(error, "Failed to delete item"), isLoading: false });
            throw error;
          }
        },

        bulkDelete: async (type: VaultItemType, ids: string[]) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.bulkDelete(type, ids);
            if (response.success) {
              set((state) => ({
                items: {
                  ...state.items,
                  [type]: state.items[type].filter((item) => !ids.includes(item._id)),
                },
                stats: {
                  ...state.stats,
                  [type === "passwords" ? "passwords" : type === "ssh-keys" ? "sshKeys" : type === "api-keys" ? "apiKeys" : type === "credit-cards" ? "creditCards" : "secureNotes"]: state.stats[
                    type === "passwords" ? "passwords" : type === "ssh-keys" ? "sshKeys" : type === "api-keys" ? "apiKeys" : type === "credit-cards" ? "creditCards" : "secureNotes"
                  ] - response.deletedCount,
                  total: state.stats.total - response.deletedCount,
                },
                isLoading: false,
              }));
            }
          } catch (error) {
            set({ error: getErrorMessage(error, "Failed to delete items"), isLoading: false });
            throw error;
          }
        },

        setFilters: (filters: Partial<VaultFilters>) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
          }));
        },

        setViewMode: (mode: "grid" | "list") => {
          set({ viewMode: mode });
        },

        clearError: () => {
          set({ error: null });
        },

        decryptItem: async <T extends VaultItem>(item: T, type: VaultItemType): Promise<T> => {
          const { encryptionKey } = get();
          if (!encryptionKey) return item;
          return decryptItemFields(item, type, encryptionKey);
        },

        getDecryptedItems: async (type: VaultItemType): Promise<VaultItem[]> => {
          const { encryptionKey, items } = get();
          if (!encryptionKey) return items[type];
          return Promise.all(items[type].map((item) => decryptItemFields(item, type, encryptionKey)));
        },
      }),
      {
        name: "vault-store",
        partialize: (state) => ({
          filters: state.filters,
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: "VaultStore" }
  )
);