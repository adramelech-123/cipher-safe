import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  VAULT_TYPE_ICONS,
  VAULT_TYPE_CLASSES,
  VAULT_TYPE_LABELS,
  VaultItemType,
} from "@/types";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const itemFeatures = (Object.keys(VAULT_TYPE_ICONS) as VaultItemType[]).map(
  (type) => ({
    icon: VAULT_TYPE_ICONS[type],
    title: VAULT_TYPE_LABELS[type],
    description: getDescription(type),
    accent: VAULT_TYPE_CLASSES[type].iconBox,
  })
);

function getDescription(type: VaultItemType): string {
  switch (type) {
    case "passwords":
      return "Store logins with usernames, websites, TOTP secrets, and categories for effortless sign-ins.";
    case "ssh-keys":
      return "Safeguard keys and fingerprints for rsa, ed25519, and ecdsa connections in one place.";
    case "api-keys":
      return "Manage provider secrets and permissions, so third-party credentials stay locked away.";
    case "credit-cards":
      return "Keep card details, expiry dates, and billing addresses safe when you need them.";
    case "secure-notes":
      return "Jot down anything sensitive in note format, pinned and organized just how you like.";
    default:
      return "";
  }
}

const extraFeatures: FeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "End-to-End Encryption",
    description:
      "Your master password is processed only on your device to derive the key. AES-encrypted data ever remains in the server.",
    accent: "bg-violet-500/20 text-violet-400",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Knowledge",
    description:
      "We never see your passwords, keys, or notes. Without your password, your vault is nothing but unreadable ciphertext.",
    accent: "bg-fuchsia-500/20 text-fuchsia-400",
  },
];

const Features = () => {
  const allFeatures = [...itemFeatures, ...extraFeatures];

  return (
    <section id="features" className="relative py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Everything you need to stay secure
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Five types of credentials, one encrypted vault. Built to protect the
            things you can't afford to lose.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                        feature.accent
                      )}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;