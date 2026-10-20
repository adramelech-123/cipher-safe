import { useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useVaultStore } from "@/store/vaultStore";
import { VAULT_TYPE_LABELS, VaultItemType, VaultItem } from "@/types";
import VaultItemCard from "./VaultItemCard";
import VaultEmptyState from "./VaultEmptyState";

interface VaultGridProps {
  onOpenItem?: (item: VaultItem, type: VaultItemType, mode?: "view" | "edit") => void;
}

const VaultGrid = ({ onOpenItem }: VaultGridProps) => {
  const { items, filters, viewMode } = useVaultStore();

  const allItems = useMemo(() => {
    const combined: (VaultItem & { _vaultType: VaultItemType } & Record<string, unknown>)[] = [];
    Object.entries(items).forEach(([type, typeItems]) => {
      if (filters.type === "all" || filters.type === type) {
        typeItems.forEach((item) => {
          combined.push({ ...item, _vaultType: type as VaultItemType });
        });
      }
    });

    if (filters.search) {
      const search = filters.search.toLowerCase();
      return combined.filter((item) =>
        item.title.toLowerCase().includes(search) ||
        String(item.username ?? "").toLowerCase().includes(search) ||
        String(item.website ?? "").toLowerCase().includes(search) ||
        String(item.host ?? "").toLowerCase().includes(search) ||
        String(item.provider ?? "").toLowerCase().includes(search) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(search))
      );
    }

    return combined;
  }, [items, filters]);

  const sortedItems = useMemo(() => {
    return [...allItems].sort((a, b) => {
      if (!!a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && !!b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [allItems]);

  const hasActiveFilters = filters.type !== "all" || filters.search;

  return (
    <div className="space-y-4">
      {(hasActiveFilters || filters.tags.length > 0) && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">Filters active:</span>
          {filters.type !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full text-xs">
              {VAULT_TYPE_LABELS[filters.type as VaultItemType]}
              <button onClick={() => useVaultStore.getState().setFilters({ type: "all" })} className="hover:text-violet-200">
                <X size={12} />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
              "{filters.search}"
              <button onClick={() => useVaultStore.getState().setFilters({ search: "" })} className="hover:text-blue-200">
                <X size={12} />
              </button>
            </span>
          )}
          {filters.tags.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">
              {filters.tags.length} tag(s)
              <button onClick={() => useVaultStore.getState().setFilters({ tags: [] })} className="hover:text-green-200">
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={() => useVaultStore.getState().setFilters({ type: "all", search: "", tags: [] })}
            className="ml-auto text-xs text-slate-400 hover:text-white"
          >
            Clear all
          </button>
        </div>
      )}

      {sortedItems.length === 0 ? (
        <VaultEmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-2"
          }
        >
          {sortedItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <VaultItemCard item={item} type={item._vaultType} compact={viewMode === "list"} onOpen={onOpenItem} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default VaultGrid;