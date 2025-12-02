"use client";

export default function Loader() {
    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center">
            <div className="loader-circle mb-4"></div>
            <p className="text-[#05314A] font-medium text-sm">Loading...</p>

            {/* Styles */}
            <style>{`
                .loader-circle {
                    width: 60px;
                    height: 60px;
                    border: 4px solid #E7C46440;
                    border-top-color: #E7C464;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
