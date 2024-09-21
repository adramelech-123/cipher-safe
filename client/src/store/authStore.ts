import {create} from "zustand"
import axios from "axios"
import { StoreState } from "@/types";


const BASE_URL = "http://localhost:5000/api/auth"; 

axios.defaults.withCredentials = true

export const useAuthStore = create<StoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email: string, password: string, username: string, confirmPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        email,
        password,
        username,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log(confirmPassword)
    } catch (error: unknown) {
      if(axios.isAxiosError(error)) {
        set({
          error: error?.response?.data.message || "Error signing up!",
          isLoading: false,
        });
      } else {
        set({
          error: "An unexpected error occurred!",
          isLoading: false,
        });
      }

      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      
      if(axios.isAxiosError(error)) {
        set({
          error: error?.response?.data.message || "Error signing in!",
          isLoading: false,
        });
      } else {
        set({
          error: "An unexpected error occured!",
          isLoading: false,
        });
      }

      throw error
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error: unknown) {
      if(axios.isAxiosError(error)) {
        set({
          error: error?.response?.data.message || "Error verifying email!",
          isLoading: false,
        });
      } else {
        set({
          error: "An unexpected error occured!",
          isLoading: false,
        });
      }
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${BASE_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      if(axios.isAxiosError(error)) {
        set({
          error: error?.response?.data.message || "Error logging out!",
          isLoading: false,
        });
      } else {
        set({
          error: "An unexpected error occured!",
          isLoading: false,
        });
      }
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      if(axios.isAxiosError(error)) {
        set({
          isLoading: false,
          error: error?.response?.data.message || "Error sending reset password!",
        });
      } else {
        set({
          isLoading: false,
          error: "An unexpected error occurred!",
        });
      }
      throw error;
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/reset-password/${token}`, {
        token,
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      if(axios.isAxiosError(error)) {
        set({
          isLoading: false,
          error: error?.response?.data.message || "Error sending reset password!",
        });
      } else {
        set({
          isLoading: false,
          error: "An unexpected error occurred!",
        });
      }

      throw error;
    }
  },
}));