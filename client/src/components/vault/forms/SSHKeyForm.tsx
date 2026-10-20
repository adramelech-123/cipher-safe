import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Copy, Check, Loader, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KEY_TYPES } from "@/types";
import toast from "react-hot-toast";

interface SSHKeyFormProps {
  defaultValues?: Partial<{
    title: string;
    host: string;
    port: number;
    username: string;
    privateKey: string;
    publicKey: string;
    passphrase: string;
    keyType: string;
    tags: string;
    notes: string;
  }>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const SSHKeyForm = ({ defaultValues, onSubmit, isLoading, onCancel }: SSHKeyFormProps) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      host: "",
      port: 22,
      username: "",
      privateKey: "",
      publicKey: "",
      passphrase: "",
      keyType: "ed25519",
      tags: "",
      notes: "",
      ...defaultValues,
    },
  });

  const privateKey = watch("privateKey");
  const publicKey = watch("publicKey");
  const fingerprint = privateKey
    ? "SHA256:" + btoa(privateKey.slice(0, 32)).slice(0, 43).replace(/[+/=]/g, "")
    : "";

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
    await onSubmit({
      ...data,
      port: data.port ? parseInt(String(data.port)) : 22,
      tags,
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
            placeholder="e.g., Production Server, GitHub Deploy Key"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
            error={!!errors.title}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            {...register("host")}
            placeholder="example.com or 192.168.1.100"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            {...register("port", { valueAsNumber: true })}
            placeholder="22"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...register("username")}
            placeholder="root, ubuntu, ec2-user"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          />
        </div>

        <div>
          <Label htmlFor="keyType">Key Type</Label>
          <select
            id="keyType"
            {...register("keyType")}
            className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500/20 outline-none"
          >
            {KEY_TYPES.map((kt) => (
              <option key={kt} value={kt}>{kt.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="privateKey">Private Key *</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="text-slate-400 hover:text-white"
          >
            {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <Textarea
          id="privateKey"
          {...register("privateKey", { required: "Private key is required" })}
          placeholder="-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQ...\n-----END OPENSSH PRIVATE KEY-----"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 font-mono text-sm min-h-[120px]"
          rows={6}
        />
        {errors.privateKey && <p className="text-red-400 text-sm mt-1">{errors.privateKey.message}</p>}
        <div className="flex items-center gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(privateKey, "Private Key")}
            disabled={!privateKey || copiedField === "Private Key"}
          >
            {copiedField === "Private Key" ? (
              <motion.span animate={{ scale: [1, 1.2, 1] }}><Check className="w-4 h-4 text-green-400" /></motion.span>
            ) : (
              <Copy size={16} />
            )}
            <span>Copy Private Key</span>
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="publicKey">Public Key (optional)</Label>
        <Textarea
          id="publicKey"
          {...register("publicKey")}
          placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@host"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 font-mono text-sm min-h-[60px]"
          rows={3}
        />
        {publicKey && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(publicKey, "Public Key")}
            >
              <Copy size={16} />
              <span>Copy Public Key</span>
            </Button>
          </div>
        )}
      </div>

      {fingerprint && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <Shield size={16} />
            <span className="font-medium">Fingerprint (SHA256)</span>
          </div>
          <code className="font-mono text-sm text-green-300 break-all">{fingerprint}</code>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="passphrase">Passphrase (optional)</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassphrase(!showPassphrase)}
            className="text-slate-400 hover:text-white"
          >
            {showPassphrase ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <Input
          id="passphrase"
          type={showPassphrase ? "text" : "password"}
          {...register("passphrase")}
          placeholder="Passphrase for encrypted private key"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="production, aws, backup"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Server details, usage notes..."
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
            "Update SSH Key"
          ) : (
            "Save SSH Key"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default SSHKeyForm;