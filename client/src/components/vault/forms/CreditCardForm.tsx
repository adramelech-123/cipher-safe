import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Copy, Check, Loader, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CARD_TYPES } from "@/types";
import toast from "react-hot-toast";

interface CreditCardFormProps {
  defaultValues?: Partial<{
    title: string;
    cardType: string;
    last4: string;
    cardBrand: string;
    expiryMonth: number;
    expiryYear: number;
    cardholderName: string;
    encryptedToken: string;
    billingAddress: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    tags: string;
    notes: string;
    isDefault: boolean;
  }>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1).padStart(2, "0"),
}));

const YEARS = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year, label: String(year) };
});

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "Other", name: "Other" },
];

const CreditCardForm = ({ defaultValues, onSubmit, isLoading, onCancel }: CreditCardFormProps) => {
  const [showToken, setShowToken] = useState(false);
  const [showCardholder, setShowCardholder] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      cardType: "visa",
      last4: "",
      cardBrand: "",
      expiryMonth: new Date().getMonth() + 1,
      expiryYear: new Date().getFullYear() + 3,
      cardholderName: "",
      encryptedToken: "",
      billingAddress: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
      },
      tags: "",
      notes: "",
      isDefault: false,
      ...defaultValues,
    },
  });

  const watchedCardNumber = watch("encryptedToken");

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

    if (!data.encryptedToken) {
      toast.error("Card token is required");
      return;
    }

    await onSubmit({
      ...data,
      tags,
      billingAddress: data.billingAddress || {},
      isDefault: data.isDefault || false,
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
            placeholder="e.g., Personal Visa, Business Amex"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
            error={!!errors.title}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="cardType">Card Type *</Label>
          <select
            id="cardType"
            {...register("cardType", { required: true })}
            className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500/20 outline-none"
          >
            {CARD_TYPES.map((ct) => (
              <option key={ct} value={ct}>{ct.charAt(0).toUpperCase() + ct.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="last4">Last 4 Digits *</Label>
          <Input
            id="last4"
            {...register("last4", { required: "Last 4 digits required", pattern: /^\d{4}$/ })}
            placeholder="1234"
            maxLength={4}
            className="bg-white/5 border-white/20 text-white placeholder-slate-500 text-center tracking-widest font-mono"
            error={!!errors.last4}
          />
          {errors.last4 && <p className="text-red-400 text-sm mt-1">{errors.last4.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="encryptedToken">Card Token / Encrypted Reference *</Label>
        <div className="relative">
          <Input
            id="encryptedToken"
            type={showToken ? "text" : "password"}
            {...register("encryptedToken", { required: "Card token is required" })}
            placeholder="tok_visa_..., card_..., or encrypted reference"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500 pr-12"
            error={!!errors.encryptedToken}
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.encryptedToken && <p className="text-red-400 text-sm mt-1">{errors.encryptedToken.message}</p>}
        <div className="flex items-center gap-2 mt-2">
          {watchedCardNumber && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(watchedCardNumber, "Card Token")}
              disabled={copiedField === "Card Token"}
            >
              {copiedField === "Card Token" ? <Check className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
              <span>Copy Token</span>
            </Button>
          )}
          <span className="text-xs text-slate-500">
            Use payment processor token (Stripe, etc.) or encrypted reference
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="expiryMonth">Exp. Month *</Label>
          <select
            id="expiryMonth"
            {...register("expiryMonth", { required: true, valueAsNumber: true })}
            className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500/20 outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="expiryYear">Exp. Year *</Label>
          <select
            id="expiryYear"
            {...register("expiryYear", { required: true, valueAsNumber: true })}
            className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500/20 outline-none"
          >
            {YEARS.map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="w-4 h-4 rounded border-white/30 text-violet-500 focus:ring-violet-500"
            />
            <span className="text-slate-300">Set as default payment method</span>
          </Label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCardholder(!showCardholder)}
            className="text-slate-400 hover:text-white"
          >
            {showCardholder ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <Input
          id="cardholderName"
          type={showCardholder ? "text" : "password"}
          {...register("cardholderName")}
          placeholder="JOHN DOE"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 uppercase tracking-wider"
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Billing Address (optional)</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowBilling(!showBilling)}
            className="text-slate-400 hover:text-white"
          >
            {showBilling ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>

        {showBilling && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="billing-line1">Address Line 1</Label>
                <Input
                  id="billing-line1"
                  {...register("billingAddress.line1")}
                  placeholder="123 Main Street"
                  className="bg-white/5 border-white/20 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label htmlFor="billing-line2">Address Line 2</Label>
                <Input
                  id="billing-line2"
                  {...register("billingAddress.line2")}
                  placeholder="Apt, suite, etc."
                  className="bg-white/5 border-white/20 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label htmlFor="billing-city">City</Label>
                <Input
                  id="billing-city"
                  {...register("billingAddress.city")}
                  placeholder="San Francisco"
                  className="bg-white/5 border-white/20 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label htmlFor="billing-state">State / Province</Label>
                <Input
                  id="billing-state"
                  {...register("billingAddress.state")}
                  placeholder="CA"
                  className="bg-white/5 border-white/20 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label htmlFor="billing-postal">Postal Code</Label>
                <Input
                  id="billing-postal"
                  {...register("billingAddress.postalCode")}
                  placeholder="94102"
                  className="bg-white/5 border-white/20 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label htmlFor="billing-country">Country</Label>
                <select
                  id="billing-country"
                  {...register("billingAddress.country")}
                  className="w-full bg-white/5 border-white/20 text-white rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-violet-500/20 outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="personal, business, travel"
          className="bg-white/5 border-white/20 text-white placeholder-slate-500"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Card details, spending limits..."
          className="bg-white/5 border-white/20 text-white placeholder-slate-500 min-h-[80px]"
          rows={3}
        />
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <Shield size={16} />
          <span className="font-medium">PCI Compliance Notice</span>
        </div>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Full PAN (card number) is NEVER stored</li>
          <li>Only last 4 digits and payment processor token are saved</li>
          <li>All sensitive data encrypted client-side with AES-256-GCM</li>
          <li>Use trusted payment processors (Stripe, Braintree, Adyen) for tokenization</li>
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
            "Update Credit Card"
          ) : (
            "Save Credit Card"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default CreditCardForm;