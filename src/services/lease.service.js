import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Auth error, clearing storage...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const leaseService = {
  // Get all leases for current user - FIXED for both owner and tenant
  getMyLeases: async (options = {}) => {
    try {
      const { role = null, status = null } = options;

      console.log("Fetching leases with options:", { role, status });

      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (status && status !== "all") params.append("status", status);

      const url = `/leases/my-leases${params.toString() ? `?${params.toString()}` : ""}`;
      console.log("Request URL:", url);

      const response = await api.get(url);

      console.log("Leases API response:", {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length,
      });

      return response.data;
    } catch (error) {
      console.error("Error in getMyLeases:", {
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Get single lease
  getLeaseById: async (leaseId) => {
    try {
      console.log("Fetching lease by ID:", leaseId);

      const response = await api.get(`/leases/${leaseId}`);

      console.log("Lease details response:", {
        success: response.data.success,
        hasData: !!response.data.data,
      });

      return response.data;
    } catch (error) {
      console.error("Error in getLeaseById:", error);
      throw error;
    }
  },

  // Create new lease request
  createLease: async (data) => {
    try {
      console.log("Creating lease with data:", data);

      const response = await api.post("/leases", data);
      console.log("Create lease response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error creating lease:", error);
      throw error;
    }
  },

  // Send lease to tenant
  sendToTenant: async (leaseId, message = "") => {
    try {
      console.log("Sending lease to tenant:", leaseId);

      const response = await api.post(`/leases/${leaseId}/send`, { message });
      console.log("Send to tenant response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error sending to tenant:", error);
      throw error;
    }
  },

  // Request changes
  requestChanges: async (leaseId, changes) => {
    const response = await api.post(`/leases/${leaseId}/request-changes`, {
      changes,
    });
    return response.data;
  },

  // Update lease
  updateLease: async (leaseId, updates) => {
    try {
      console.log("updateLease called with:", { leaseId, updates });

      // IMPORTANT: The API endpoint is /leases/:leaseId/update
      const response = await api.put(`/leases/${leaseId}/update`, updates);

      console.log("Update lease response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error updating lease:", {
        leaseId,
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  sendToLandlordForSignature: async (leaseId, message = "") => {
    try {
      console.log("Sending lease to landlord for signature:", leaseId);

      const response = await api.post(`/leases/${leaseId}/send-to-landlord`, {
        message
      });

      console.log("Send to landlord response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending to landlord:", error);
      throw error;
    }
  },

  updateLeaseStatus: async (leaseId, status, reason = "") => {
    try {
      const response = await api.put(`/leases/${leaseId}/status`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      console.error("Error updating lease status:", error);
      throw error;
    }
  },


  // Sign lease
  signLease: async (leaseId, payload) => {
    const response = await api.post(`/leases/${leaseId}/sign`, {
      signatureDataUrl: payload.signatureDataUrl,
      signatureMode: payload.signatureMode,
      typedSignature: payload.typedSignature,
    });

    return response.data;
  },

  // Approve request
  approveRequest: async (leaseId) => {
    const response = await api.post(`/leases/${leaseId}/approve`);
    return response.data;
  },

  // Cancel lease
  cancelLease: async (leaseId, reason) => {
    const response = await api.post(`/leases/${leaseId}/cancel`, { reason });
    return response.data;
  },

  // Get statistics
  getLeaseStats: async () => {
    try {
      const response = await api.get("/leases/stats");
      console.log("Lease stats response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting lease stats:", error);
      throw error;
    }
  },

  // Delete lease
  deleteLease: async (leaseId) => {
    const response = await api.delete(`/leases/${leaseId}`);
    return response.data;
  },

  // Restore lease
  restoreLease: async (leaseId) => {
    const response = await api.post(`/leases/${leaseId}/restore`);
    return response.data;
  },

  // Test API connection
  testAPI: async () => {
    try {
      const response = await api.get("/leases/debug/test");
      return response.data;
    } catch (error) {
      console.error("API test failed:", error);
      throw error;
    }
  },
};
