import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Copy, Check, Loader, Eye, EyeOff, Key, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/types";
import toast from "react-hot-toast";

interface PasswordFormProps {
  defaultValues?: Partial<{
    title: string;
    website: string;
    username: string;
    password: string;
    totpSecret: string;
    category: string;
    tags: string;
    notes: string;
  }>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const generatePassword = (length = 16, options = { uppercase: true, lowercase: true, numbers: true, symbols: true }) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let chars = "";
  if (options.uppercase) chars += uppercase;
  if (options.lowercase) chars += lowercase;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;

  if (!chars) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "red" };
  if (score <= 4) return { score, label: "Fair", color: "yellow" };
  if (score <= 5) return { score, label: "Good", color: "blue" };
  return { score, label: "Strong", color: "green" };
};

const PasswordForm = ({ defaultValues, onSubmit, isLoading, onCancel }: PasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      website: "",
      username: "",
      password: "",
      totpSecret: "",
      category: "personal",
      tags: "",
      notes: "",
      ...defaultValues,
    },
  });

  const password = watch("password");
  const strength = calculateStrength(password);

  const handleGenerate = () => {
    const newPassword = generatePassword(genLength, genOptions);
    setGeneratedPassword(newPassword);
    setValue("password", newPassword);
    setShowPassword(true);
    setCopied(false);
  };

  const handleCopyGenerated = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast.success("Generated password copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitForm = async (data: Record<string, unknown>) => {
    const tags = data.tags ? String(data.tags).split(",").map((t) => t.trim()).filter(Boolean) : [];
    await onSubmit({
      ...data,
      tags,
      port: data.port ? parseInt(String(data.port)) : undefined,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleSubmitForm)}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="e.g., GitHub, AWS Console, Bank Login"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
            error={!!errors.title}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="website">Website / URL</Label>
          <Input
            id="website"
            type="url"
            {...register("website")}
            placeholder="https://github.com"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500/20 outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="username">Username / Email</Label>
          <Input
            id="username"
            {...register("username")}
            placeholder="john@example.com"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          />
        </div>

        <div className="relative">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              placeholder="Enter or generate password"
              className="bg-white/5 border-white/20 text-white placeholder-slate-500 pr-12"
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}

          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGenerator(!showGenerator)}
              className="bg-white/5 border-white/20 text-slate-300 hover:text-white"
            >
              <Key className="w-4 h-4 mr-1" /> Generate
            </Button>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 6) * 100}%` }}
                className="h-full rounded-full transition-all duration-300"
                style={{ backgroundColor: strength.color }}
              />
            </div>
            <span className="text-xs text-slate-400 capitalize">{strength.label}</span>
          </div>
        </div>
      </div>

      {showGenerator && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">Password Generator</h4>
            <Button variant="ghost" size="icon" onClick={() => setShowGenerator(false)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gen-length">Length: {genLength}</Label>
              <input
                id="gen-length"
                type="range"
                min="8"
                max="64"
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { key: "uppercase", label: "Uppercase (A-Z)" },
                { key: "lowercase", label: "Lowercase (a-z)" },
                { key: "numbers", label: "Numbers (0-9)" },
                { key: "symbols", label: "Symbols (!@#$...)" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={genOptions[opt.key as keyof typeof genOptions]}
                    onChange={(e) => setGenOptions({ ...genOptions, [opt.key]: e.target.checked })}
                    className="w-4 h-4 rounded border-white/30 text-violet-500 focus:ring-violet-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleGenerate} className="flex-1" disabled={isLoading}>
              <Zap className="w-4 h-4 mr-2" /> Generate New Password
            </Button>
            {generatedPassword && (
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white/5 px-3 py-2 rounded-lg text-sm font-mono break-all text-white">
                  {generatedPassword}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyGenerated}
                  disabled={copied}
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-green-400"><Shield size={14} /> Encrypted locally</div>
            <div className="flex items-center gap-2 text-blue-400"><Zap size={14} /> Never sent to server</div>
            <div className="flex items-center gap-2 text-violet-400"><Key size={14} /> AES-256-GCM</div>
          </div>
        </motion.div>
      )}

      <div>
        <Label htmlFor="totpSecret">2FA Secret (TOTP)</Label>
        <Input
          id="totpSecret"
          {...register("totpSecret")}
          placeholder="JBSWY3DPEHPK3PXP (optional)"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 font-mono text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">Base32 encoded secret for authenticator apps</p>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="work, finance, important"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Additional notes..."
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 min-h-[80px]"
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-white/10">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700">
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              Saving...
            </>
          ) : defaultValues?.title ? (
            "Update Password"
          ) : (
            "Save Password"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default PasswordForm;