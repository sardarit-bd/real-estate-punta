import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL+"/api" || "http://localhost:5000/api";

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
  // ================= APPLICATION PHASE =================
  
  // Apply for property
  applyForProperty: async (propertyId, message = "") => {
    try {
      console.log("Applying for property:", propertyId);
      
      const response = await api.post("/leases", {
        property: propertyId,
        message: message
      });
      
      console.log("Application response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error applying for property:", error);
      throw error;
    }
  },

  // Review application (landlord)
  reviewApplication: async (leaseId, action, reason = "", screeningResults = {}) => {
    try {
      console.log("Reviewing application:", { leaseId, action });
      
      const response = await api.post(`/leases/${leaseId}/review-application`, {
        action, // "approve" or "reject"
        reason,
        screeningResults
      });
      
      return response.data;
    } catch (error) {
      console.error("Error reviewing application:", error);
      throw error;
    }
  },

  // ================= DRAFT PHASE =================
  
  // Create/update lease draft
  createOrUpdateDraft: async (leaseId, updates) => {
    try {
      console.log("Updating lease draft:", { leaseId, updates });
      
      const response = await api.put(`/leases/${leaseId}/draft`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating draft:", error);
      throw error;
    }
  },

  // Send lease to tenant
  sendToTenant: async (leaseId, message = "") => {
    try {
      console.log("Sending lease to tenant:", { leaseId, message });
      
      const response = await api.post(`/leases/${leaseId}/send-to-tenant`, { message });
      return response.data;
    } catch (error) {
      console.error("Error sending to tenant:", error);
      throw error;
    }
  },

  // ================= REVIEW PHASE =================
  
  // Tenant reviews lease
  reviewLease: async (leaseId, action, changes = "", message = "") => {
    try {
      console.log("Tenant reviewing lease:", { leaseId, action });
      
      const response = await api.post(`/leases/${leaseId}/review`, {
        action, // "approve" or "request_changes"
        changes,
        message
      });
      
      return response.data;
    } catch (error) {
      console.error("Error reviewing lease:", error);
      throw error;
    }
  },

  // Request changes (legacy)
  requestChanges: async (leaseId, changes) => {
    const response = await api.post(`/leases/${leaseId}/request-changes`, { changes });
    return response.data;
  },

  // ================= SIGNING PHASE =================
  
  // Sign lease
  signLease: async (leaseId, payload) => {
    const response = await api.post(`/leases/${leaseId}/sign`, {
      signatureDataUrl: payload.signatureDataUrl,
      signatureMode: payload.signatureMode,
      typedSignature: payload.typedSignature,
    });
    return response.data;
  },

  // Send to landlord for signature
  sendToLandlordForSignature: async (leaseId, message = "") => {
    try {
      const response = await api.post(`/leases/${leaseId}/send-to-landlord`, { message });
      return response.data;
    } catch (error) {
      console.error("Error sending to landlord:", error);
      throw error;
    }
  },

  tenantReviewLease: async (leaseId, action, changes = "", message = "") => {
    try {
      console.log("Tenant reviewing lease:", { leaseId, action });
      
      const response = await api.post(`/leases/${leaseId}/review`, {
        action,
        changes,
        message
      });
      
      return response.data;
    } catch (error) {
      console.error("Error reviewing lease:", error);
      throw error;
    }
  },

  // ================= MOVE-IN PHASE =================
  
  // Schedule move-in inspection
  scheduleMoveInInspection: async (leaseId, scheduledAt, notes = "") => {
    try {
      const response = await api.post(`/leases/${leaseId}/schedule-move-in`, {
        scheduledAt,
        notes
      });
      return response.data;
    } catch (error) {
      console.error("Error scheduling move-in:", error);
      throw error;
    }
  },

  // Conduct move-in inspection
  conductMoveInInspection: async (leaseId, inspectionData) => {
    try {
      const response = await api.post(`/leases/${leaseId}/conduct-move-in`, inspectionData);
      return response.data;
    } catch (error) {
      console.error("Error conducting move-in:", error);
      throw error;
    }
  },

  // ================= ACTIVE LEASE MANAGEMENT =================
  
  // Give notice
  giveNotice: async (leaseId, type, effectiveDate, reason = "", document = "") => {
    try {
      const response = await api.post(`/leases/${leaseId}/give-notice`, {
        type, // "renewal" or "termination"
        effectiveDate,
        reason,
        document
      });
      return response.data;
    } catch (error) {
      console.error("Error giving notice:", error);
      throw error;
    }
  },

  // Respond to renewal
  respondToRenewal: async (leaseId, action, newRentAmount = null, newEndDate = null) => {
    try {
      const response = await api.post(`/leases/${leaseId}/respond-to-renewal`, {
        action, // "accept" or "decline"
        newRentAmount,
        newEndDate
      });
      return response.data;
    } catch (error) {
      console.error("Error responding to renewal:", error);
      throw error;
    }
  },

  // ================= MOVE-OUT PHASE =================
  
  // Schedule move-out inspection
  scheduleMoveOutInspection: async (leaseId, scheduledAt) => {
    try {
      const response = await api.post(`/leases/${leaseId}/schedule-move-out`, { scheduledAt });
      return response.data;
    } catch (error) {
      console.error("Error scheduling move-out:", error);
      throw error;
    }
  },

  // Process deposit return
  processDepositReturn: async (leaseId, returnedAmount, deductions = [], description = "") => {
    try {
      const response = await api.post(`/leases/${leaseId}/process-deposit`, {
        returnedAmount,
        deductions,
        description
      });
      return response.data;
    } catch (error) {
      console.error("Error processing deposit:", error);
      throw error;
    }
  },

  // ================= GENERAL LEASE MANAGEMENT =================
  
  // Get all leases for current user
  getMyLeases: async (options = {}) => {
    try {
      const { role = null, status = null, type = null } = options;
      
      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (status && status !== "all") params.append("status", status);
      if (type) params.append("type", type);
      
      const url = `/leases/my-leases${params.toString() ? `?${params.toString()}` : ""}`;
      console.log("Fetching leases:", url);
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error getting leases:", error);
      throw error;
    }
  },

  // Get single lease
  getLeaseById: async (leaseId) => {
    try {
      console.log("Fetching lease by ID:", leaseId);
      
      const response = await api.get(`/leases/${leaseId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting lease:", error);
      throw error;
    }
  },

  // Update lease (general)
  updateLease: async (leaseId, updates) => {
    try {
      console.log("Updating lease:", { leaseId, updates });
      
      const response = await api.put(`/leases/${leaseId}/update`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating lease:", error);
      throw error;
    }
  },

  // Cancel lease
  cancelLease: async (leaseId, reason = "") => {
    try {
      const response = await api.post(`/leases/${leaseId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error("Error cancelling lease:", error);
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

  // Get statistics
  getLeaseStats: async () => {
    try {
      const response = await api.get("/leases/stats");
      return response.data;
    } catch (error) {
      console.error("Error getting stats:", error);
      throw error;
    }
  },

  // Legacy functions for backward compatibility
  approveRequest: async (leaseId) => {
    // This is now handled by reviewApplication with action="approve"
    return await leaseService.reviewApplication(leaseId, "approve");
  },

  // Test API
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