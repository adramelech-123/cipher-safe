import { motion } from "framer-motion";
import { Lock, KeyRound, EyeOff, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SecurityPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

const points: SecurityPoint[] = [
  {
    icon: Lock,
    title: "Master password only on your device",
    description:
      "Your master password never leaves your browser. No one can retrieve it, reset it, or brute-force it from us.",
  },
  {
    icon: KeyRound,
    title: "Keys derived locally",
    description:
      "The encryption key is derived from your password on your device — the server only ever stores ciphertext.",
  },
  {
    icon: EyeOff,
    title: "Zero-knowledge architecture",
    description:
      "Even with full database access, your vault appears as nothing more than unreadable, encrypted data.",
  },
  {
    icon: Cpu,
    title: "Always have full control",
    description:
      "Lock your vault whenever you step away and unlock it only when you need to see your secrets.",
  },
];

const Security = () => {
  return (
    <section id="security" className="relative py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Security
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Built on a zero-knowledge foundation
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            We designed CipherSafe so that your data and your key never meet in
            the same place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/5 border-violet-500/20 hover:border-violet-500/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                          "bg-violet-500/20 text-violet-400"
                        )}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1.5">
                          {point.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </div>
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

export default Security;