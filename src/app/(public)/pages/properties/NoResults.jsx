export default function NoResults() {
    return (
        <div className="text-center py-20">
            {/* <img
                src="/no-results.svg"
                alt="Not Found"
                className="mx-auto w-40 opacity-70"
            /> */}
            <h3 className="text-xl font-semibold mt-6">No properties found</h3>
            <p className="text-gray-500 mt-2">
                Try adjusting your filters or search criteria.
            </p>
        </div>
    );
}
