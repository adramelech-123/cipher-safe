import { useState } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Terminal,
  KeyRound,
  CreditCard,
  FileText,
  Plus,
  LogOut,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandHeader from "@/components/BrandHeader";
import { useVaultStore } from "@/store/vaultStore";
import { useAuthStore } from "@/store/authStore";
import { VAULT_TYPE_CLASSES, VaultItemType } from "@/types";
import { cn } from "@/lib/utils";

const navItems: { type: VaultItemType; icon: LucideIcon; label: string; href: string }[] = [
  { type: "passwords", icon: Key, label: "Passwords", href: "/vault/passwords" },
  { type: "ssh-keys", icon: Terminal, label: "SSH Keys", href: "/vault/ssh-keys" },
  { type: "api-keys", icon: KeyRound, label: "API Keys", href: "/vault/api-keys" },
  { type: "credit-cards", icon: CreditCard, label: "Credit Cards", href: "/vault/credit-cards" },
  { type: "secure-notes", icon: FileText, label: "Secure Notes", href: "/vault/secure-notes" },
];

const VaultSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isHomeActive = location.pathname === "/";
  const navigate = useNavigate();
  const { stats } = useVaultStore();
  const { logout, user } = useAuthStore();

  const getStatCount = (type: VaultItemType): number => {
    switch (type) {
      case "passwords": return stats.passwords;
      case "ssh-keys": return stats.sshKeys;
      case "api-keys": return stats.apiKeys;
      case "credit-cards": return stats.creditCards;
      case "secure-notes": return stats.secureNotes;
      default: return 0;
    }
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
    <>
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 bg-white/5 backdrop-blur-sm border-r border-white/10 transition-all duration-300 flex flex-col overflow-x-hidden",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn("border-b border-white/10", collapsed ? "p-3" : "p-4")}>
            {collapsed ? (
              <div className="flex flex-col items-center gap-3">
                <img src="/ciphersafe.svg" alt="CipherSafe logo" className="w-8 h-8" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setCollapsed(false)}
                  aria-label="Expand sidebar"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <BrandHeader
                  logoSize="w-10 h-10"
                  headingSize="text-2xl"
                  subTextSize="text-xs"
                  addClass="justify-center"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setCollapsed(true)}
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={20} />
                </Button>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1" aria-label="Vault navigation">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="nav-items"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Navigate
                  </div>
                  <NavLink
                    to="/"
                    className={({ isActive: active }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                        "text-slate-300 hover:text-white hover:bg-white/10",
                        active
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : ""
                      )
                    }
                    title="Home"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                        "bg-violet-500/20 text-violet-400",
                        isHomeActive && "bg-violet-500/30 text-violet-300"
                      )}
                    >
                      <Home size={18} />
                    </div>
                    <span className="font-medium truncate">Home</span>
                  </NavLink>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Vault
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const count = getStatCount(item.type);
                    const classes = VAULT_TYPE_CLASSES[item.type];
                    const isActive = location.pathname.startsWith(item.href);

                    return (
                      <NavLink
                        key={item.type}
                        to={item.href}
                        className={({ isActive: active }) => cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                          "text-slate-300 hover:text-white hover:bg-white/10",
                          active
                            ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                            : ""
                        )}
                        title={item.label}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                            classes.iconBox,
                            isActive && classes.iconBoxActive
                          )}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="font-medium truncate">{item.label}</span>
                        <span
                          className={cn(
                            "ml-auto px-2 py-0.5 text-xs rounded-full font-medium",
                            isActive
                              ? classes.iconBoxActive
                              : "bg-white/10 text-slate-400"
                          )}
                        >
                          {count}
                        </span>
                      </NavLink>
                    );
                  })}
                </motion.div>
              )}

              {collapsed && (
                <>
                  <NavLink
                    to="/"
                    className={cn(
                      "flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200",
                      "text-violet-400 hover:text-violet-300 hover:bg-violet-500/20",
                      isHomeActive && "bg-violet-500/30 text-violet-300"
                    )}
                    title="Home"
                    aria-label="Home"
                  >
                    <Home size={20} />
                  </NavLink>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const classes = VAULT_TYPE_CLASSES[item.type];
                    return (
                      <NavLink
                        key={item.type}
                        to={item.href}
                        className={({ isActive: active }) => cn(
                          "flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200",
                          classes.navIcon,
                          active && classes.navIconActive
                        )}
                        title={item.label}
                        aria-label={item.label}
                      >
                        <Icon size={20} />
                      </NavLink>
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="pt-4 border-t border-white/10 space-y-2"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 bg-white/5 hover:bg-white/10 border-white/20 text-slate-300 hover:text-white"
                    asChild
                  >
                    <Link to="/vault/passwords?new=true">
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </Link>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 border-white/20 text-slate-300 hover:text-white"
                      title="Export Vault"
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 border-white/20 text-slate-300 hover:text-white"
                      title="Import Vault"
                    >
                      <Upload size={16} />
                      <span className="hidden sm:inline">Import</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          <div className="p-3 border-t border-white/10">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="user-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <span className="text-violet-300 font-medium text-sm">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user?.username || "User"}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 bg-white/5 hover:bg-red-500/10 border-white/20 text-slate-300 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                </motion.div>
              )}

              {collapsed && (
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-400"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {collapsed && (
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Button
            variant="default"
            size="icon"
            className="bg-violet-600 hover:bg-violet-700 shadow-lg"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      )}
    </>
  );
};

export default VaultSidebar;