// components/admin/DocumentViewer.js
export default function DocumentViewer({ document, onClose }) {
    console.log("ok")
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-900/70 bg-opacity-90" onClick={onClose}></div>
        
        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl relative z-10">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{document?.name}</h3>
              <p className="text-sm text-gray-500">PDF Document Viewer</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="bg-gray-900 p-1">
            <div className="h-[70vh] bg-white">
              {document?.url ? (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.url)}&embedded=true`}
                  className="w-full h-full border-0"
                  title={document.name}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-gray-500">Document not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Uploaded:</span>{' '}
              {document?.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'N/A'}
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={document?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}