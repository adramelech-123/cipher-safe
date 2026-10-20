export const userValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 2,
        max: 100,
      },
      errorMessage: "Username must be 2 - 100 characters!",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty!",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },

  email: {
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Email must be at least 8 characters long!",
    },
    notEmpty: {
      errorMessage: "Email cannot be empty!",
    },
    matches: {
      options: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      errorMessage: "Please enter a valid email address!",
    },
  },

  password: {
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password must be at least 8 characters long!",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty!",
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]+$/,
      errorMessage: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
    },
  },
};

export const resetPasswordSchema = {
  password: {
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password must be at least 8 characters long!",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty!",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]+$/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
    },
  },
};

export const passwordValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 2,
        max: 100,
      },
      errorMessage: "Title must be 2 - 100 characters long!",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty!",
    },
    isString: {
      errorMessage: "Title must be a string!",
    },
  },
  website: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Website must be a string!",
    },
    isURL: {
      errorMessage: "Website must be a valid URL!",
    },
  },
  username: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Username must be a string!",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Username cannot exceed 100 characters!",
    },
  },
  password: {
    isLength: {
      options: {
        min: 1,
      },
      errorMessage: "Password cannot be empty!",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty!",
    },
    isString: {
      errorMessage: "Password must be a string!",
    },
  },
  totpSecret: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "TOTP secret must be a string!",
    },
  },
  category: {
    optional: { options: { values: "falsy" } },
    isIn: {
      options: [["personal", "work", "finance", "social", "other"]],
      errorMessage: "Invalid category!",
    },
  },
  tags: {
    optional: { options: { values: "falsy" } },
    isArray: {
      errorMessage: "Tags must be an array!",
    },
  },
  "tags.*": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Each tag must be a string!",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters!",
    },
  },
  notes: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Notes must be a string!",
    },
    isLength: {
      options: { max: 1000 },
      errorMessage: "Notes cannot exceed 1000 characters!",
    },
  },
};

export const sshKeyValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 2,
        max: 100,
      },
      errorMessage: "Title must be 2 - 100 characters long!",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty!",
    },
    isString: {
      errorMessage: "Title must be a string!",
    },
  },
  host: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Host must be a string!",
    },
    isLength: {
      options: { max: 200 },
      errorMessage: "Host cannot exceed 200 characters!",
    },
  },
  port: {
    optional: { options: { values: "falsy" } },
    isInt: {
      options: { min: 1, max: 65535 },
      errorMessage: "Port must be between 1 and 65535!",
    },
  },
  username: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Username must be a string!",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Username cannot exceed 100 characters!",
    },
  },
  privateKey: {
    isLength: {
      options: { min: 1 },
      errorMessage: "Private key cannot be empty!",
    },
    notEmpty: {
      errorMessage: "Private key cannot be empty!",
    },
    isString: {
      errorMessage: "Private key must be a string!",
    },
  },
  publicKey: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Public key must be a string!",
    },
  },
  passphrase: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Passphrase must be a string!",
    },
  },
  keyType: {
    optional: { options: { values: "falsy" } },
    isIn: {
      options: [["rsa", "ed25519", "ecdsa", "ed25519-sk"]],
      errorMessage: "Invalid key type!",
    },
  },
  tags: {
    optional: { options: { values: "falsy" } },
    isArray: {
      errorMessage: "Tags must be an array!",
    },
  },
  "tags.*": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Each tag must be a string!",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters!",
    },
  },
  notes: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Notes must be a string!",
    },
    isLength: {
      options: { max: 1000 },
      errorMessage: "Notes cannot exceed 1000 characters!",
    },
  },
};

export const apiKeyValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 2,
        max: 100,
      },
      errorMessage: "Title must be 2 - 100 characters long!",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty!",
    },
    isString: {
      errorMessage: "Title must be a string!",
    },
  },
  provider: {
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Provider must be 2 - 50 characters long!",
    },
    notEmpty: {
      errorMessage: "Provider cannot be empty!",
    },
    isString: {
      errorMessage: "Provider must be a string!",
    },
  },
  keyId: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Key ID must be a string!",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Key ID cannot exceed 100 characters!",
    },
  },
  secretKey: {
    isLength: {
      options: { min: 1 },
      errorMessage: "Secret key cannot be empty!",
    },
    notEmpty: {
      errorMessage: "Secret key cannot be empty!",
    },
    isString: {
      errorMessage: "Secret key must be a string!",
    },
  },
  permissions: {
    optional: { options: { values: "falsy" } },
    isArray: {
      errorMessage: "Permissions must be an array!",
    },
  },
  "permissions.*": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Each permission must be a string!",
    },
    isLength: {
      options: { max: 50 },
      errorMessage: "Each permission cannot exceed 50 characters!",
    },
  },
  expiresAt: {
    optional: { options: { values: "falsy" } },
    isISO8601: {
      errorMessage: "Expiry date must be a valid ISO 8601 date!",
    },
  },
  tags: {
    optional: { options: { values: "falsy" } },
    isArray: {
      errorMessage: "Tags must be an array!",
    },
  },
  "tags.*": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Each tag must be a string!",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters!",
    },
  },
  notes: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Notes must be a string!",
    },
    isLength: {
      options: { max: 1000 },
      errorMessage: "Notes cannot exceed 1000 characters!",
    },
  },
};

export const creditCardValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 2,
        max: 100,
      },
      errorMessage: "Title must be 2 - 100 characters long!",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty!",
    },
    isString: {
      errorMessage: "Title must be a string!",
    },
  },
  cardType: {
    isIn: {
      options: [["visa", "mastercard", "amex", "discover", "other"]],
      errorMessage: "Invalid card type!",
    },
    notEmpty: {
      errorMessage: "Card type cannot be empty!",
    },
  },
  last4: {
    isLength: {
      options: { min: 4, max: 4 },
      errorMessage: "Last 4 digits must be exactly 4 digits!",
    },
    notEmpty: {
      errorMessage: "Last 4 digits cannot be empty!",
    },
    matches: {
      options: /^\d{4}$/,
      errorMessage: "Last 4 digits must be numeric!",
    },
  },
  cardBrand: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Card brand must be a string!",
    },
  },
  expiryMonth: {
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: "Expiry month must be between 1 and 12!",
    },
    notEmpty: {
      errorMessage: "Expiry month cannot be empty!",
    },
  },
  expiryYear: {
    isInt: {
      options: { min: 2024, max: 2050 },
      errorMessage: "Expiry year must be between 2024 and 2050!",
    },
    notEmpty: {
      errorMessage: "Expiry year cannot be empty!",
    },
  },
  cardholderName: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Cardholder name must be a string!",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Cardholder name cannot exceed 100 characters!",
    },
  },
  encryptedToken: {
    isLength: {
      options: { min: 1 },
      errorMessage: "Encrypted token cannot be empty!",
    },
    notEmpty: {
      errorMessage: "Encrypted token cannot be empty!",
    },
    isString: {
      errorMessage: "Encrypted token must be a string!",
    },
  },
  billingAddress: {
    optional: { options: { values: "falsy" } },
    isObject: {
      errorMessage: "Billing address must be an object!",
    },
  },
  "billingAddress.line1": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Address line 1 must be a string!",
    },
    isLength: {
      options: { max: 200 },
      errorMessage: "Address line 1 cannot exceed 200 characters!",
    },
  },
  "billingAddress.line2": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Address line 2 must be a string!",
    },
    isLength: {
      options: { max: 200 },
      errorMessage: "Address line 2 cannot exceed 200 characters!",
    },
  },
  "billingAddress.city": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "City must be a string!",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "City cannot exceed 100 characters!",
    },
  },
  "billingAddress.state": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "State must be a string!",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "State cannot exceed 100 characters!",
    },
  },
  "billingAddress.postalCode": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Postal code must be a string!",
    },
    isLength: {
      options: { max: 20 },
      errorMessage: "Postal code cannot exceed 20 characters!",
    },
  },
  "billingAddress.country": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Country must be a string!",
    },
    isLength: {
      options: { max: 2 },
      errorMessage: "Country must be a 2-letter code!",
    },
  },
  tags: {
    optional: { options: { values: "falsy" } },
    isArray: {
      errorMessage: "Tags must be an array!",
    },
  },
  "tags.*": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Each tag must be a string!",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters!",
    },
  },
  notes: {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Notes must be a string!",
    },
    isLength: {
      options: { max: 1000 },
      errorMessage: "Notes cannot exceed 1000 characters!",
    },
  },
  isDefault: {
    optional: { options: { values: "falsy" } },
    isBoolean: {
      errorMessage: "isDefault must be a boolean!",
    },
  },
};

export const secureNoteValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 2,
        max: 200,
      },
      errorMessage: "Title must be 2 - 200 characters long!",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty!",
    },
    isString: {
      errorMessage: "Title must be a string!",
    },
  },
  content: {
    isLength: {
      options: { min: 1 },
      errorMessage: "Content cannot be empty!",
    },
    notEmpty: {
      errorMessage: "Content cannot be empty!",
    },
    isString: {
      errorMessage: "Content must be a string!",
    },
  },
  format: {
    optional: { options: { values: "falsy" } },
    isIn: {
      options: [["plaintext", "markdown"]],
      errorMessage: "Invalid format!",
    },
  },
  tags: {
    optional: { options: { values: "falsy" } },
    isArray: {
      errorMessage: "Tags must be an array!",
    },
  },
  "tags.*": {
    optional: { options: { values: "falsy" } },
    isString: {
      errorMessage: "Each tag must be a string!",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "Each tag cannot exceed 30 characters!",
    },
  },
  isPinned: {
    optional: { options: { values: "falsy" } },
    isBoolean: {
      errorMessage: "isPinned must be a boolean!",
    },
  },
  color: {
    optional: { options: { values: "falsy" } },
    matches: {
      options: /^#[0-9A-Fa-f]{6}$/,
      errorMessage: "Color must be a valid hex color!",
    },
  },
};