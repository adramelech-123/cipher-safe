import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Copy, Check, Loader, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const COMMON_PROVIDERS = [
  "AWS", "GitHub", "GitLab", "Bitbucket", "Vercel", "Netlify", "Heroku",
  "DigitalOcean", "Linode", "Cloudflare", "Stripe", "PayPal", "Twilio",
  "SendGrid", "Mailgun", "Postmark", "Firebase", "Supabase", "PlanetScale",
  "MongoDB Atlas", "Redis", "Datadog", "New Relic", "Sentry", "PagerDuty",
  "Slack", "Discord", "Telegram", "Notion", "Airtable", "Linear", "Jira",
  "Custom",
];

interface APIKeyFormProps {
  defaultValues?: Partial<{
    title: string;
    provider: string;
    keyId: string;
    secretKey: string;
    permissions: string;
    expiresAt: string;
    tags: string;
    notes: string;
  }>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const APIKeyForm = ({ defaultValues, onSubmit, isLoading, onCancel }: APIKeyFormProps) => {
  const [showSecret, setShowSecret] = useState(false);
  const [showKeyId, setShowKeyId] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      provider: "",
      keyId: "",
      secretKey: "",
      permissions: "",
      expiresAt: "",
      tags: "",
      notes: "",
      ...defaultValues,
    },
  });

  const copyToClipboard = async (value: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSubmitForm = async (data: Record<string, unknown>) => {
    const tags = data.tags ? String(data.tags).split(",").map((t) => t.trim()).filter(Boolean) : [];
    const permissions = data.permissions ? String(data.permissions).split(",").map((p) => p.trim()).filter(Boolean) : [];
    await onSubmit({
      ...data,
      tags,
      permissions,
      expiresAt: data.expiresAt || undefined,
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
            placeholder="e.g., AWS Production, GitHub Personal Token"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
            error={!!errors.title}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="provider">Provider *</Label>
          <div className="relative">
            <select
              id="provider"
              {...register("provider", { required: "Provider is required" })}
              className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 pr-10 focus:border-violet-500 focus:ring-violet-500/20 outline-none appearance-none"
            >
              <option value="">Select provider...</option>
              {COMMON_PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {errors.provider && <p className="text-red-400 text-sm mt-1">{errors.provider.message}</p>}
        </div>

        <div>
          <Label htmlFor="keyId">Key ID / Access Key (optional)</Label>
          <div className="relative">
            <Input
              id="keyId"
              type={showKeyId ? "text" : "password"}
              {...register("keyId")}
              placeholder="AKIA..., ghp_..., sk_..."
              className="bg-white/5 border-white/20 text-white placeholder-slate-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowKeyId(!showKeyId)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showKeyId ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {watch("keyId") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(watch("keyId"), "Key ID")}
                disabled={copiedField === "Key ID"}
              >
                {copiedField === "Key ID" ? <Check className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
                <span>Copy</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="secretKey">Secret Key / Token *</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSecret(!showSecret)}
            className="text-slate-400 hover:text-white"
          >
            {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <Input
          id="secretKey"
          type={showSecret ? "text" : "password"}
          {...register("secretKey", { required: "Secret key is required" })}
          placeholder="Enter secret key, token, or password"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          error={!!errors.secretKey}
        />
        {errors.secretKey && <p className="text-red-400 text-sm mt-1">{errors.secretKey.message}</p>}
        <div className="flex items-center gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(watch("secretKey"), "Secret Key")}
            disabled={!watch("secretKey") || copiedField === "Secret Key"}
          >
            {copiedField === "Secret Key" ? <Check className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
            <span>Copy Secret</span>
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="permissions">Permissions / Scopes (comma separated)</Label>
        <Input
          id="permissions"
          {...register("permissions")}
          placeholder="read:user, write:repo, admin:org"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
        <p className="text-xs text-slate-500 mt-1">Comma-separated list of permissions/scopes</p>
      </div>

      <div>
        <Label htmlFor="expiresAt">Expiry Date (optional)</Label>
        <Input
          id="expiresAt"
          type="date"
          {...register("expiresAt")}
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
        <p className="text-xs text-slate-500 mt-1">Optional expiry date for rotating credentials</p>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="production, api, ci-cd"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Usage details, rotation schedule..."
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 min-h-[80px]"
          rows={3}
        />
      </div>

      <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
        <div className="flex items-center gap-2 text-violet-400 mb-2">
          <Shield size={16} />
          <span className="font-medium">Security Notes</span>
        </div>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Secret keys are encrypted client-side before storage</li>
          <li>Never share API keys in code repositories</li>
          <li>Rotate keys regularly, especially for production access</li>
          <li>Use least-privilege permissions when possible</li>
        </ul>
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
            "Update API Key"
          ) : (
            "Save API Key"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default APIKeyForm;