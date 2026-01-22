"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  Edit,
  Eye,
  Download,
  Send,
  FileText,
  User,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import LeasePreview from "./LeasePreview";
import SignatureView from "./SignatureView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormContent } from "./FormContent";
import { leaseService } from "@/services/lease.service";
import { useAuthContext } from "@/providers/AuthProvider";

// Validation schema
const leaseSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  tenantId: z.string().min(1, "Tenant is required"),
  propertyAddress: z.string().min(1, "Property address is required"),
  landlordName: z.string().min(1, "Landlord name is required"),
  tenantName: z.string().min(1, "Tenant name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  monthlyRent: z.string().min(1, "Monthly rent is required"),
  paymentDay: z.string().min(1, "Payment day is required"),
  securityDeposit: z.string().min(1, "Security deposit is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  utilitiesIncluded: z.array(z.string()).optional(),
  utilitiesTenantPaid: z.array(z.string()).optional(),
  occupants: z.string().optional(),
  noticeDays: z.string().min(1, "Notice period is required"),
  additionalTerms: z.string().optional(),
  leaseType: z.enum(["fixed_term", "month_to_month"]),
});

export default function LeaseForm({
  propertyData,
  tenantData,
  landlordData,
  mode = "create",
  initialData = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [signatureMode, setSignatureMode] = useState(false);
  const [leaseSigned, setLeaseSigned] = useState(false);
  const { user } = useAuthContext();

  const getDefaultValues = () => {
    if (initialData) {
      console.log("Using initialData for form:", initialData);
      return initialData;
    }

    const monthlyRent =
      propertyData?.price !== undefined && propertyData?.price !== null
        ? propertyData.price.toString()
        : "";

    console.log("Creating default values with propertyData:", {
      price: propertyData?.price,
      monthlyRent,
    });

    return {
      propertyId: propertyData?.id || "",
      tenantId: tenantData?.id || "",
      propertyAddress: propertyData?.address || "",
      landlordName: landlordData?.name || "",
      tenantName: tenantData?.name || "",
      startDate: "",
      endDate: "",
      monthlyRent,
      paymentDay: "1",
      securityDeposit: "",
      paymentMethod: "bank_transfer",
      utilitiesIncluded: [],
      utilitiesTenantPaid: [],
      occupants: "",
      noticeDays: "30",
      additionalTerms: "",
      leaseType: "fixed_term",
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaseSchema),
    defaultValues: getDefaultValues(),
  });

  // Reset form when initialData changes (important for edit mode)
  useEffect(() => {
    if (initialData) {
      console.log("Resetting form with initialData:", initialData);
      reset(initialData);
    }
  }, [initialData, reset]);

  // Also update when propertyData changes (for create mode)
  useEffect(() => {
    if (
      mode === "create" &&
      propertyData?.price !== undefined &&
      propertyData?.price !== null
    ) {
      console.log(
        "Updating monthlyRent from propertyData.price:",
        propertyData.price,
      );
      setValue("monthlyRent", propertyData.price.toString());
    }
  }, [propertyData?.price, mode, setValue]);

  const selectedUtilities = watch("utilitiesIncluded") || [];
  const tenantUtilities = watch("utilitiesTenantPaid") || [];
  const formData = watch();

  // Debug current form values
  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Form values changed:", {
        monthlyRent: value.monthlyRent,
        allValues: value,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const utilityOptions = [
    { id: "water", label: "Water" },
    { id: "electricity", label: "Electricity" },
    { id: "gas", label: "Gas" },
    { id: "internet", label: "Internet" },
    { id: "cable", label: "Cable TV" },
    { id: "trash", label: "Trash Collection" },
    { id: "maintenance", label: "Maintenance Fee" },
  ];

  // The onSubmit function in LeaseForm.js - FIXED VERSION
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        title: `Lease for ${data.propertyAddress}`,
        description: data.additionalTerms || "",

        landlord: landlordData?.id || user?._id,
        tenant: data.tenantId,
        property: data.propertyId,

        startDate: data.startDate,
        endDate: data.endDate,

        rentAmount: Number(data.monthlyRent),
        rentFrequency: "monthly",
        securityDeposit: Number(data.securityDeposit),

        // ADD THIS - Save utilities at root level
        utilities: {
          includedInRent: data.utilitiesIncluded || [],
          paidByTenant: data.utilitiesTenantPaid || [],
        },

        // ADD THIS - Save maintenance terms
        maintenanceTerms: data.maintenanceTerms || "",

        terms: {
          leaseType: data.leaseType,
          paymentDay: Number(data.paymentDay),
          paymentMethod: data.paymentMethod,
          noticeDays: Number(data.noticeDays),
          occupants: data.occupants || "",
          propertyAddress: data.propertyAddress,
          landlordName: data.landlordName,
          tenantName: data.tenantName,
        },

        createdBy: landlordData?.id || user?._id,
      };

      console.log("Submitting payload:", payload);

      // CREATE MODE
      if (mode === "create") {
        const res = await leaseService.createLease(payload);

        toast.success("Lease draft created successfully!");

        const created = res?.data?.data;
        const leaseId = created?._id || created?.id;

        if (!leaseId) {
          throw new Error("Lease id missing in response");
        }

        onSuccess?.({ id: leaseId });
        return;
      }

      // EDIT/UPDATE MODE - THIS WAS MISSING!
      console.log("Updating lease with payload:", payload);
      console.log("Lease ID:", initialData?.id || initialData?._id);

      const leaseId = initialData?.id || initialData?._id;

      if (!leaseId) {
        throw new Error("Lease ID is missing - cannot update");
      }

      // ACTUALLY CALL THE UPDATE API
      const res = await leaseService.updateLease(leaseId, payload);

      console.log("Update response:", res);

      toast.success("Lease updated successfully!");

      // Call onSuccess with the response data
      onSuccess?.(res?.data || payload);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Error saving lease");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("PDF generated successfully!");

      const blob = new Blob(["Simulated PDF content"], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lease-Agreement-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error generating PDF");
    } finally {
      setLoading(false);
    }
  };

  const sendForSignature = async () => {
    setSignatureMode(true);
  };

  const handleSignLease = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLeaseSigned(true);
      toast.success(
        "Lease agreement signed successfully! The document is now legally binding.",
      );
      setSignatureMode(false);
    } catch (error) {
      toast.error("Error signing lease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F3A34] mb-2">
          {mode === "create" ? "Create New Lease" : "Edit Lease Agreement"}
        </h1>
        <p className="text-gray-600">
          Fill in lease details, customize terms, and send for e-signature
        </p>
      </div>

      {/* Mode Toggles */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            setPreviewMode(false);
            setSignatureMode(false);
          }}
          className={`px-4 py-2 rounded-lg ${!previewMode && !signatureMode ? "bg-[#1F3A34] text-white" : "bg-gray-100"}`}
        >
          <Edit className="inline-block mr-2 h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => setPreviewMode(true)}
          className={`px-4 py-2 rounded-lg ${previewMode ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          <Eye className="inline-block mr-2 h-4 w-4" />
          Preview
        </button>

        {!leaseSigned && (
          <button
            onClick={sendForSignature}
            className={`px-4 py-2 rounded-lg ${signatureMode ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <Send className="inline-block mr-2 h-4 w-4" />
            {signatureMode ? "In Signature Mode" : "Send for Signature"}
          </button>
        )}
        <button
          onClick={generatePDF}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          disabled={loading}
        >
          <Download className="inline-block mr-2 h-4 w-4" />
          Download PDF
        </button>
      </div>

      {previewMode ? (
        <LeasePreview data={formData} />
      ) : signatureMode ? (
        <SignatureView
          data={formData}
          onSign={handleSignLease}
          loading={loading}
        />
      ) : (
        <FormContent
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
          loading={loading}
          selectedUtilities={selectedUtilities}
          tenantUtilities={tenantUtilities}
          setValue={setValue}
          utilityOptions={utilityOptions}
          signatureMode={signatureMode}
          setPreviewMode={setPreviewMode}
          watch={watch}
          mode={mode}
          propertyData={propertyData}
          initialData={initialData}
        />
      )}
    </div>
  );
}
