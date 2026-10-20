import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Grid, List, Filter, Settings, LogOut, Key, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVaultStore } from "@/store/vaultStore";
import { useAuthStore } from "@/store/authStore";
import { VaultItemType } from "@/types";
import { cn } from "@/lib/utils";

const VaultHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const { viewMode, setViewMode, filters, setFilters, isLoading } = useVaultStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFilters({ search: value });
  };

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex-1 max-w-xl">
          <Label htmlFor="vault-search" className="sr-only">Search vault</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              id="vault-search"
              type="search"
              placeholder="Search passwords, keys, notes..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500/20 w-full max-w-md"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "bg-white/5 hover:bg-white/10 border-white/20 text-slate-300",
              viewMode === "grid" ? "bg-violet-500/20 text-violet-300 border-violet-500/30" : ""
            )}
            onClick={() => handleViewChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Grid size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "bg-white/5 hover:bg-white/10 border-white/20 text-slate-300",
              viewMode === "list" ? "bg-violet-500/20 text-violet-300 border-violet-500/30" : ""
            )}
            onClick={() => handleViewChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List size={18} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            ref={filterRef}
            className="bg-white/5 hover:bg-white/10 border-white/20 text-slate-300 hover:text-white"
            onClick={() => setShowFilter(!showFilter)}
            aria-label="Filter"
            aria-expanded={showFilter}
          >
            <Filter size={18} />
          </Button>

          {showFilter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-lg"
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Type
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {(["all", "passwords", "ssh-keys", "api-keys", "credit-cards", "secure-notes"] as const).map((type) => (
                      <Button
                        key={type}
                        variant={filters.type === type ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "text-xs",
                          filters.type === type ? "bg-violet-600 text-white" : "bg-white/5 hover:bg-white/10 border-white/20 text-slate-300"
                        )}
                        onClick={() => setFilters({ type: type as VaultItemType })}
                      >
                        {type === "all" ? "All" : type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Tags
                  </Label>
                  <input
                    type="text"
                    placeholder="Filter by tags..."
                    className="w-full bg-white/5 border-white/20 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:border-violet-500 focus:ring-violet-500/20 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <span className="text-violet-300 font-medium text-sm">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </Button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-2 shadow-lg"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-white/5"
                    asChild
                  >
                    <a href="/">
                      <Home size={16} />
                      Home
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-white/5"
                    asChild
                  >
                    <a href="/settings">
                      <Settings size={16} />
                      Settings
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-white/5"
                    asChild
                  >
                    <a href="/vault/passwords?new=true">
                      <Key size={16} />
                      Add Password
                    </a>
                  </Button>
                  <hr className="border-white/10 my-1" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="h-0.5 bg-violet-500 fixed top-16 left-0 z-40"
        />
      )}
    </header>
  );
};

export default VaultHeader;