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
