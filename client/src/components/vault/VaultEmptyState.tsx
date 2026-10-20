import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Key,
  Plus,
  Shield,
  Zap,
  Database,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VAULT_TYPE_LABELS, VAULT_TYPE_ICONS, VAULT_TYPE_CLASSES, VaultItemType } from "@/types";
import { cn } from "@/lib/utils";

const features = [
  { icon: Shield, title: "End-to-End Encryption", desc: "Your data is encrypted locally before it ever leaves your device" },
  { icon: Zap, title: "Zero Knowledge", desc: "We cannot access your vault - only you have the keys" },
  { icon: Database, title: "Organized Storage", desc: "Separate vaults for passwords, SSH keys, API keys, cards, and notes" },
];

const VaultEmptyState = () => {
  const vaultTypes: VaultItemType[] = ["passwords", "ssh-keys", "api-keys", "credit-cards", "secure-notes"];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Key className="w-12 h-12 text-violet-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Vault is Empty</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Start securing your digital life by adding your first item. Choose from passwords, SSH keys, API keys, credit cards, or secure notes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-4xl mb-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {vaultTypes.map((type) => {
            const Icon = VAULT_TYPE_ICONS[type];
            const classes = VAULT_TYPE_CLASSES[type];
            return (
              <Link
                key={type}
                to={`/vault/${type}?new=true`}
                className={cn(
                  "group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200",
                  classes.border
                )}
              >
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors", classes.groupHover)}>
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-white mb-1">{VAULT_TYPE_LABELS[type]}</h3>
                <p className="text-xs text-slate-400">Add your first {VAULT_TYPE_LABELS[type].toLowerCase().slice(0, -1)}</p>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Why CipherSafe?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center mb-3">
                    <feature.icon size={20} />
                  </div>
                  <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/vault/passwords?new=true">
            <Plus className="w-5 h-5 mr-2" />
            Add First Password
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
          <Link to="/vault/secure-notes?new=true">
            <FileText className="w-5 h-5 mr-2" />
            Create Secure Note
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default VaultEmptyState;