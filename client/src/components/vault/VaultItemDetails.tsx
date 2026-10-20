import { useState } from "react";
import type { ReactNode } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  VaultItem,
  VaultItemType,
  PasswordEntry,
  SSHKeyEntry,
  APIKeyEntry,
  CreditCardEntry,
  SecureNoteEntry,
} from "@/types";
import toast from "react-hot-toast";

interface VaultItemDetailsProps {
  item: VaultItem;
  type: VaultItemType;
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-xs text-slate-400 uppercase tracking-wider">{label}</Label>
    <div className="text-sm text-slate-200">{children}</div>
  </div>
);

const Empty = () => <span className="text-slate-500">—</span>;

const Chips = ({ values }: { values: string[] }) =>
  values.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span key={v} className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs rounded">#{v}</span>
      ))}
    </div>
  ) : (
    <Empty />
  );

interface SecretProps {
  label: string;
  value?: string;
  masked?: number;
}

const Secret = ({ label, value, masked = 24 }: SecretProps) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const secret = value ?? "";

  const copy = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const display = show ? secret : "•".repeat(Math.min(secret.length, masked));

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-slate-400 uppercase tracking-wider">{label}</Label>
      <div className="flex items-center gap-2">
        <code className="flex-1 font-mono text-sm bg-white/5 px-3 py-2 rounded-lg break-all min-h-[2.25rem]">
          {secret ? display : <Empty />}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white h-8 w-8"
          onClick={() => setShow(!show)}
          disabled={!secret}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white h-8 w-8"
          onClick={copy}
          disabled={!secret}
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
        </Button>
      </div>
    </div>
  );
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString() : undefined;

const VaultItemDetails = ({ item, type }: VaultItemDetailsProps) => {
  let body: ReactNode = null;

  switch (type) {
    case "passwords": {
      const p = item as PasswordEntry;
      body = (
        <>
          {p.website && (
            <Row label="Website">
              <a
                href={/^https?:\/\//i.test(p.website) ? p.website : `https://${p.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline break-all"
              >
                {p.website}
              </a>
            </Row>
          )}
          {p.username && <Row label="Username / Email"><span className="break-all">{p.username}</span></Row>}
          <Secret label="Password" value={p.password} />
          {p.totpSecret && <Secret label="2FA Secret (TOTP)" value={p.totpSecret} />}
          {p.category && <Row label="Category"><span className="capitalize">{p.category}</span></Row>}
        </>
      );
      break;
    }
    case "ssh-keys": {
      const s = item as SSHKeyEntry;
      body = (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {s.host && <Row label="Host"><span className="break-all">{s.host}</span></Row>}
            <Row label="Port"><span>{s.port}</span></Row>
            {s.keyType && <Row label="Key Type"><span className="uppercase">{s.keyType}</span></Row>}
          </div>
          {s.username && <Row label="Username"><span className="break-all">{s.username}</span></Row>}
          <Secret label="Private Key" value={s.privateKey} masked={48} />
          {s.publicKey && <Secret label="Public Key" value={s.publicKey!} masked={48} />}
          {s.passphrase && <Secret label="Passphrase" value={s.passphrase} />}
          {s.fingerprint && (
            <Row label="Fingerprint">
              <code className="font-mono text-sm text-green-300 break-all">{s.fingerprint}</code>
            </Row>
          )}
        </>
      );
      break;
    }
    case "api-keys": {
      const a = item as APIKeyEntry;
      body = (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {a.provider && <Row label="Provider"><span>{a.provider}</span></Row>}
            {a.expiresAt && <Row label="Expires"><span>{formatDate(a.expiresAt)}</span></Row>}
          </div>
          {a.keyId && <Secret label="Key ID" value={a.keyId!} />}
          <Secret label="Secret Key" value={a.secretKey} />
          {a.permissions && <Row label="Permissions"><Chips values={a.permissions} /></Row>}
        </>
      );
      break;
    }
    case "credit-cards": {
      const c = item as CreditCardEntry;
      const billing = c.billingAddress;
      const billingParts = [
        billing?.line1,
        billing?.line2,
        [billing?.city, billing?.state].filter(Boolean).join(", "),
        billing?.postalCode,
        billing?.country,
      ].filter(Boolean);
      body = (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.cardType && <Row label="Card Type"><span className="capitalize">{c.cardType}</span></Row>}
            {c.last4 && (
              <Row label="Card Number">
                <span className="tracking-widest font-mono">•••• •••• •••• {c.last4}</span>
              </Row>
            )}
            {c.expiryMonth && c.expiryYear && (
              <Row label="Expiry">
                <span>{String(c.expiryMonth).padStart(2, "0")}/{c.expiryYear}</span>
              </Row>
            )}
            <Row label="Default">
              <span className={c.isDefault ? "text-green-400" : "text-slate-500"}>
                {c.isDefault ? "Yes" : "No"}
              </span>
            </Row>
          </div>
          {c.cardholderName && <Secret label="Cardholder Name" value={c.cardholderName!} />}
          <Secret label="Card Token" value={c.encryptedToken} masked={32} />
          {billingParts.length > 0 && (
            <Row label="Billing Address">
              <span className="break-words">{billingParts.join(", ")}</span>
            </Row>
          )}
        </>
      );
      break;
    }
    case "secure-notes": {
      const n = item as SecureNoteEntry;
      body = (
        <>
          <Row label="Content">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
              {n.content}
            </div>
          </Row>
          <div className="grid gap-4 sm:grid-cols-2">
            {n.format && <Row label="Format"><span className="capitalize">{n.format}</span></Row>}
            <Row label="Pinned"><span className={n.isPinned ? "text-amber-400" : "text-slate-500"}>{n.isPinned ? "Yes" : "No"}</span></Row>
          </div>
        </>
      );
      break;
    }
  }

  return (
    <div className="space-y-4">
      {body}
      <Row label="Tags"><Chips values={item.tags ?? []} /></Row>
      {item.notes && (
        <Row label="Notes">
          <div className="whitespace-pre-wrap break-words">{item.notes}</div>
        </Row>
      )}
      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/10 text-xs text-slate-400">
        <span>Created {formatDate(item.createdAt) ?? "—"}</span>
        <span>Updated {formatDate(item.updatedAt) ?? "—"}</span>
      </div>
    </div>
  );
};

export default VaultItemDetails;