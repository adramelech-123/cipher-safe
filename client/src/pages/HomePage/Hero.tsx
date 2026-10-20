import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandHeader from "@/components/BrandHeader";
import { useIsAuthenticated } from "@/store/authStore";

const Hero = () => {
  const isAuthenticated = useIsAuthenticated();
  const primaryHref = isAuthenticated ? "/vault" : "/signup";
  const primaryLabel = isAuthenticated ? "Open Vault" : "Get Started Free";

  return (
    <section className="relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center bg-[url('/cipherwallanime2.jpg')]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/70 via-slate-900/80 to-slate-900" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6">
            <Lock className="w-4 h-4" />
            End-to-end encrypted, zero-knowledge by design
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
            All your secrets in one{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              unbreakable vault
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
            Store passwords, SSH keys, API keys, credit cards, and secure notes.
            Your master password is the only key — everything else stays encrypted
            and is never readable by anyone but you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 w-full sm:w-auto px-8"
              asChild
            >
              <Link to={primaryHref}>
                {primaryLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8"
              asChild
            >
              <a href="#features">View Features</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 shadow-2xl">
            <span className="text-sm font-semibold text-violet-300 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5" />
              Your vault at a glance
            </span>
            <BrandHeader
              logoSize="w-16 h-16"
              headingSize="text-3xl"
              subTextSize="text-xs mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;