import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, FileText, Save, User, Wrench } from "lucide-react";

export function FormContent({
  register,
  handleSubmit,
  errors,
  onSubmit,
  loading,
  selectedUtilities,
  tenantUtilities,
  setValue,
  utilityOptions,
  signatureMode,
  setPreviewMode,
  watch
}) {
  const currentMonthlyRent = watch('monthlyRent');

  console.log('FormContent render - monthlyRent:', currentMonthlyRent);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <FileText className="mr-3 h-5 w-5" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Address *
            </label>
            <input
              {...register('propertyAddress')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="Full property address"
            />
            {errors.propertyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyAddress.message}</p>
            )}
          </div>

          {/* Lease Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lease Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="fixed_term"
                  {...register('leaseType')}
                  className="mr-2"
                />
                Fixed Term
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="month_to_month"
                  {...register('leaseType')}
                  className="mr-2"
                />
                Month-to-Month
              </label>
            </div>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Parties Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <User className="mr-3 h-5 w-5" />
          Parties Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Landlord Name *
            </label>
            <input
              {...register('landlordName')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Full name of landlord"
            />
            {errors.landlordName && (
              <p className="text-red-500 text-sm mt-1">{errors.landlordName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant Name(s) *
            </label>
            <input
              {...register('tenantName')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Full name(s) of tenant(s)"
            />
            {errors.tenantName && (
              <p className="text-red-500 text-sm mt-1">{errors.tenantName.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Terms */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <DollarSign className="mr-3 h-5 w-5" />
          Financial Terms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent *
            </label>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                {...register("monthlyRent")}
                type="number"
                step="0.01"
                readOnly
                className="w-full pl-8 pr-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                placeholder="0.00"
              />
            </div>

            {errors.monthlyRent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.monthlyRent.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Day *
            </label>

            <Select
              value={watch("paymentDay")}
              onValueChange={(value) => setValue("paymentDay", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment day" />
              </SelectTrigger>

              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    Day {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.paymentDay && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentDay.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Deposit *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                {...register('securityDeposit')}
                type="number"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.securityDeposit && (
              <p className="text-red-500 text-sm mt-1">{errors.securityDeposit.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>

            <Select
              value={watch("paymentMethod")}
              onValueChange={(value) => setValue("paymentMethod", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="digital_payment">Digital Payment</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Utilities & Maintenance - UPDATED SECTION */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <Wrench className="mr-3 h-5 w-5" />
          Utilities & Maintenance
        </h2>

        {/* Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Included in Rent</h3>
            <div className="space-y-2">
              {utilityOptions.map(utility => (
                <label key={utility.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={utility.id}
                    checked={selectedUtilities.includes(utility.id)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...selectedUtilities, utility.id]
                        : selectedUtilities.filter(id => id !== utility.id);
                      setValue('utilitiesIncluded', newValue);
                    }}
                    className="mr-3"
                  />
                  {utility.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-4">Paid by Tenant</h3>
            <div className="space-y-2">
              {utilityOptions.map(utility => (
                <label key={utility.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={utility.id}
                    checked={tenantUtilities.includes(utility.id)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...tenantUtilities, utility.id]
                        : tenantUtilities.filter(id => id !== utility.id);
                      setValue('utilitiesTenantPaid', newValue);
                    }}
                    className="mr-3"
                  />
                  {utility.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance Terms - NEW SECTION */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-700 mb-4">Maintenance Responsibilities</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Terms
            </label>
            <textarea
              {...register('maintenanceTerms')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="Describe maintenance responsibilities (e.g., 'Tenant responsible for minor repairs under $100. Landlord handles all major repairs and appliance replacements.')"
              rows="4"
            />
            <p className="text-sm text-gray-500 mt-2">
              Specify who is responsible for various types of maintenance and repairs
            </p>
          </div>
        </div>
      </div>

      {/* Additional Terms */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6">
          Additional Terms & Conditions
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Period (Days) *
            </label>
            <input
              {...register('noticeDays')}
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="30"
            />
            {errors.noticeDays && (
              <p className="text-red-500 text-sm mt-1">{errors.noticeDays.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Terms (Optional)
            </label>
            <textarea
              {...register('additionalTerms')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="Add any custom terms or conditions here..."
              rows="6"
            />
            <p className="text-sm text-gray-500 mt-2">
              This section is editable by both parties before signing
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => setPreviewMode(true)}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50"
        >
          Preview
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="inline-block mr-2 h-4 w-4" />
              {signatureMode ? 'Save & Send for Signature' : 'Save Draft'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}