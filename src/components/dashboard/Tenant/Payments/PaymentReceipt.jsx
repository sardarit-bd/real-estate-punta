'use client';

import React from 'react';
import { Download, Printer, Share2, CheckCircle } from 'lucide-react';

export default function PaymentReceipt({ transaction, onClose }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const receiptData = {
    ...transaction,
    receiptId: `REC-${transaction.reference}`,
    issuedDate: new Date().toISOString(),
    paymentMethod: transaction.paymentMethod === 'bank' ? 'Bank Transfer' : 
                   transaction.paymentMethod === 'card' ? 'Credit Card' : 
                   transaction.paymentMethod === 'mobile' ? 'Mobile Banking' : 'Cash',
    landlordInfo: {
      name: 'John Landlord',
      email: 'landlord@example.com',
      phone: '+1 (555) 123-4567'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Payment Receipt - ${receiptData.reference}`,
          text: `Payment of ${formatCurrency(receiptData.amount)} for ${receiptData.property}`,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(`Payment Receipt: ${formatCurrency(receiptData.amount)} - ${receiptData.reference}`);
      alert('Receipt link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
              <p className="text-gray-600">Transaction #{receiptData.reference}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          {/* Success Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-800">Payment Successful!</p>
                <p className="text-sm text-green-600">Your payment has been processed successfully</p>
              </div>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt ID:</span>
                  <span className="font-medium">{receiptData.receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{formatDate(receiptData.issuedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium">{receiptData.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{receiptData.category}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount & Method</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(receiptData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{receiptData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Landlord Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Paid To</h4>
            <p className="text-gray-900 font-medium">{receiptData.landlordInfo.name}</p>
            <p className="text-sm text-gray-600">{receiptData.landlordInfo.email}</p>
            <p className="text-sm text-gray-600">{receiptData.landlordInfo.phone}</p>
          </div>

          {/* Transaction Notes */}
          <div className="mt-6 p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-600">
              This receipt confirms that payment has been received. Please keep this for your records.
              If you have any questions about this payment, contact your landlord.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </button>
            <button
              onClick={() => {
                // Download as PDF logic
                const receiptContent = document.querySelector('.receipt-content');
                // Implement PDF generation here
                alert('Downloading receipt...');
              }}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">
              This is an electronically generated receipt. No signature required.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Receipt generated on {formatDate(receiptData.issuedDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}