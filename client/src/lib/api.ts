import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { VaultListResponse, VaultItemResponse, VaultStatsResponse, VaultItemType, CreateVaultItemDTO } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async getVaultStats(): Promise<VaultStatsResponse> {
    const response = await this.client.get("/vault/stats");
    return response.data;
  }

  async getAllItems(
    type: VaultItemType,
    params?: { search?: string; tags?: string; category?: string; sort?: string; page?: number; limit?: number }
  ): Promise<VaultListResponse> {
    const response = await this.client.get(`/vault/${type}`, { params });
    return response.data;
  }

  async getItem(type: VaultItemType, id: string): Promise<VaultItemResponse> {
    const response = await this.client.get(`/vault/${type}/${id}`);
    return response.data;
  }

  async createItem(type: VaultItemType, data: CreateVaultItemDTO): Promise<VaultItemResponse> {
    const response = await this.client.post(`/vault/${type}`, data);
    return response.data;
  }

  async updateItem(type: VaultItemType, id: string, data: Partial<CreateVaultItemDTO>): Promise<VaultItemResponse> {
    const response = await this.client.patch(`/vault/${type}/${id}`, data);
    return response.data;
  }

  async deleteItem(type: VaultItemType, id: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete(`/vault/${type}/${id}`);
    return response.data;
  }

  async bulkDelete(type: VaultItemType, ids: string[]): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const response = await this.client.post("/vault/bulk-delete", { ids, type });
    return response.data;
  }

  async exportVault(): Promise<{ success: boolean; data: unknown }> {
    const response = await this.client.post("/vault/export");
    return response.data;
  }
}

export const apiClient = new ApiClient();