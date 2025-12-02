export default function BlogSkeleton() {
    return (
        <div className="border rounded-xl shadow-sm animate-pulse overflow-hidden">
            <div className="h-40 bg-gray-200 w-full"></div>

            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
        </div>
    );
}
