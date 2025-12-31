import { AlertCircle, Download, Upload } from "lucide-react";
import { useState } from "react";

export function DocumentsInfo({ documents, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'jpg': return '🖼️';
      case 'png': return '🖼️';
      case 'doc': return '📝';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          id="document-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {uploading ? 'Uploading...' : 'Click to upload documents'}
          </p>
          <p className="text-sm text-gray-500">
            PDF, JPG, PNG, DOC up to 10MB
          </p>
        </label>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Your Documents</h3>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{getFileIcon(doc.type)}</span>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600">
                  <AlertCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Lease Agreement', count: 1, color: 'bg-blue-100' },
          { label: 'ID Proof', count: 1, color: 'bg-green-100' },
          { label: 'Payment Receipts', count: 3, color: 'bg-purple-100' },
          { label: 'Other Documents', count: 0, color: 'bg-gray-100' }
        ].map((category) => (
          <div key={category.label} className={`p-4 ${category.color} rounded-lg`}>
            <p className="font-medium text-gray-900">{category.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{category.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}