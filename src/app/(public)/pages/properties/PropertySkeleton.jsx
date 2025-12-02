export default function PropertySkeleton() {
    return (
        <div className="animate-pulse border rounded-xl overflow-hidden shadow-sm">
            <div className="h-44 bg-gray-200 w-full"></div>

            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
