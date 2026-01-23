import api from "@/lib/api";

export const paymentService = {
    getPaymentHistory: () =>
        api.get("/payment/history"),
    //   getMyLeases: (params) =>
    //     api.get("/leases/my-leases", { params }),

    //   getLeaseById: (id) =>
    //     api.get(`/leases/${id}`),

    //   createLease: (payload) =>
    //     api.post("/leases", payload),

    //   updateLease: (id, payload) =>
    //     api.put(`/leases/${id}/update`, payload),

    //   sendToTenant: (id, message) =>
    //     api.post(`/leases/${id}/send`, { message }),

    //   signLease: (id, payload) =>
    //     api.post(`/leases/${id}/sign`, payload),

    //   cancelLease: (id, reason) =>
    //     api.post(`/leases/${id}/cancel`, { reason }),

    //   stats: () =>
    //     api.get("/leases/stats"),
};
