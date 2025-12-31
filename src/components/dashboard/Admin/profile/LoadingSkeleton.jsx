export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}