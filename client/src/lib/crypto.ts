const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

export async function deriveEncryptionKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptField(data: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptField(encryptedData: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

export function saltToString(salt: Uint8Array): string {
  return btoa(String.fromCharCode(...salt));
}

export function stringToSalt(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

const SALT_STORAGE_KEY = "cipher-safe-salt";

export function getStoredSalt(): Uint8Array | null {
  try {
    const stored = localStorage.getItem(SALT_STORAGE_KEY);
    if (stored) {
      return stringToSalt(stored);
    }
  } catch {
    // Ignore errors
  }
  return null;
}

export function storeSalt(salt: Uint8Array): void {
  try {
    localStorage.setItem(SALT_STORAGE_KEY, saltToString(salt));
  } catch {
    // Ignore errors
  }
}

export async function initializeEncryption(password: string): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  let salt = getStoredSalt();
  if (!salt) {
    salt = generateSalt();
    storeSalt(salt);
  }
  const key = await deriveEncryptionKey(password, salt);
  return { key, salt };
}

export function clearEncryption(): void {
  try {
    localStorage.removeItem(SALT_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

const sensitiveFields: Record<string, string[]> = {
  passwords: ["username", "password", "totpSecret", "notes"],
  "ssh-keys": ["username", "privateKey", "publicKey", "passphrase", "notes"],
  "api-keys": ["keyId", "secretKey", "notes"],
  "credit-cards": ["cardholderName", "encryptedToken", "notes"],
  "secure-notes": ["content", "notes"],
};

export function getSensitiveFields(type: string): string[] {
  return sensitiveFields[type] || [];
}

export async function encryptItemFields<T extends object>(
  item: T,
  type: string,
  key: CryptoKey
): Promise<T> {
  const encrypted = { ...item } as Record<string, unknown>;
  const fields = getSensitiveFields(type);

  for (const field of fields) {
    const value = encrypted[field];
    if (value && typeof value === "string") {
      encrypted[field] = await encryptField(value, key);
    } else if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;
      for (const nestedKey of Object.keys(nested)) {
        const nestedValue = nested[nestedKey];
        if (nestedValue && typeof nestedValue === "string") {
          nested[nestedKey] = await encryptField(nestedValue, key);
        }
      }
    }
  }

  return encrypted as T;
}

export async function decryptItemFields<T extends object>(
  item: T,
  type: string,
  key: CryptoKey
): Promise<T> {
  const decrypted = { ...item } as Record<string, unknown>;
  const fields = getSensitiveFields(type);

  for (const field of fields) {
    const value = decrypted[field];
    if (value && typeof value === "string") {
      try {
        decrypted[field] = await decryptField(value, key);
      } catch {
        // If decryption fails, leave as is (might be unencrypted legacy data)
      }
    } else if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;
      for (const nestedKey of Object.keys(nested)) {
        const nestedValue = nested[nestedKey];
        if (nestedValue && typeof nestedValue === "string") {
          try {
            nested[nestedKey] = await decryptField(nestedValue, key);
          } catch {
            // If decryption fails, leave as is
          }
        }
      }
    }
  }

  return decrypted as T;
}

export function maskString(str: string, visibleChars = 4): string {
  if (!str) return "";
  if (str.length <= visibleChars) return "•".repeat(str.length);
  return str.slice(0, visibleChars) + "•".repeat(str.length - visibleChars);
}

export function maskCreditCard(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export function getCardBrandFromNumber(num: string): string {
  const firstTwo = num.slice(0, 2);
  const firstFour = num.slice(0, 4);

  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(firstTwo) || /^2[2-7]/.test(firstTwo)) return "mastercard";
  if (/^3[47]/.test(firstTwo)) return "amex";
  if (/^6(?:011|5)/.test(firstFour)) return "discover";
  return "other";
}

export function luhnCheck(num: string): boolean {
  let sum = 0;
  let isEven = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}