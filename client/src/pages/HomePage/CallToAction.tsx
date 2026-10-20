import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/store/authStore";

const CallToAction = () => {
  const isAuthenticated = useIsAuthenticated();
  const primaryHref = isAuthenticated ? "/vault" : "/signup";
  const primaryLabel = isAuthenticated ? "Open Vault" : "Get Started Free";

  return (
    <section className="relative py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm px-6 py-14 lg:py-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to secure your digital life?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            Join CipherSafe and keep every password, key, and note locked behind
            one master password — encrypted from end to end.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
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
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;