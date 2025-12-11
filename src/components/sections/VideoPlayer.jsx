"use client"
import React, { useRef, useState } from 'react';

export default function VideoPlayer() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playButtonVisible, setPlayButtonVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const handlePlayClick = () => {
        if (videoRef.current && !isAnimating) {
            setIsAnimating(true);

            if (isPlaying) {
                // Pause korle - play button appear hobe
                videoRef.current.pause();
                setPlayButtonVisible(true);

                // Animation complete houar por
                setTimeout(() => {
                    setIsPlaying(false);
                    setIsAnimating(false);
                }, 300);
            } else {
                // Play korle - play button disappear hobe
                setPlayButtonVisible(false);

                // Animation complete houar por video play hobe
                setTimeout(() => {
                    videoRef.current.play();
                    setIsPlaying(true);
                    setIsAnimating(false);
                }, 300);
            }
        }
    };

    // Video manually pause korle
    const handleVideoPause = () => {
        setIsPlaying(false);
        setPlayButtonVisible(true);
    };

    // Video manually play korle
    const handleVideoPlay = () => {
        setIsPlaying(true);
        setPlayButtonVisible(false);
    };

    return (
        <div className="relative">
            {/* Video Container */}
            <div className="relative w-[600px] h-[435px] rounded-3xl overflow-hidden group">
                <video
                    ref={videoRef}
                    src="/videos/hero-video.mp4"
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-3xl transition-all duration-300 group-hover:brightness-90"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                />

                {/* Big Play Button with Animation */}
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${playButtonVisible ? 'opacity-100 scale-75 pointer-events-auto' : 'opacity-0 pointer-events-none scale-75'}`}
                    onClick={handlePlayClick}
                >
                    <div className="relative">
                        {/* Glow Effect - Blue based on primary color */}
                        <div className="absolute -inset-6 bg-blue-500/30 rounded-full blur-xl animate-glow-slow -z-10"></div>

                        {/* Outer Ring with Pulse Animation - using primary color */}
                        <div className="absolute -inset-4 border-2 border-[#004087]/60 rounded-full animate-pulse-ring -z-5"></div>

                        {/* Main Play Button */}
                        <div className="relative w-28 h-28 bg-gradient-to-br from-[#004087] to-[#002a5e] rounded-full flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:from-[#0050a0] hover:to-[#003870] shadow-2xl group">
                            {/* Inner Glow */}
                            <div className="absolute inset-4 bg-blue-400/20 rounded-full blur-sm"></div>

                            {/* Play Icon */}
                            <svg
                                className="w-16 h-16 text-white ml-2 relative z-10 group-hover:text-blue-100 transition-colors duration-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>

                            {/* Hover Effect Ring */}
                            <div className="absolute inset-0 border-4 border-transparent rounded-full transition-all duration-300 group-hover:border-[#004087]/40"></div>

                            {/* Subtle shine effect */}
                            <div className="absolute top-2 left-2 right-2 h-4 bg-gradient-to-b from-white/10 to-transparent rounded-t-full opacity-50"></div>
                        </div>
                    </div>
                </div>

                {/* Small Animated Play/Pause Button */}
                <div
                    className={`absolute top-4 left-4 transition-all duration-500 ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                    onClick={handlePlayClick}
                >
                    <div className="relative group/button">
                        {/* Button Glow Effect */}
                        <div className="absolute -inset-3 bg-yellow-400/30 rounded-full blur-md opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 -z-10"></div>

                        {/* Main Button */}
                        <div className="bg-black/80 backdrop-blur-sm rounded-full p-3 cursor-pointer transform hover:scale-110 transition-all duration-300 shadow-lg">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                {/* Pause Icon (two bars) */}
                                <div className={`absolute transition-all duration-300 ${isPlaying ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-5 bg-white rounded-full"></div>
                                        <div className="w-1.5 h-5 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* Play Icon (triangle) */}
                                <div className={`absolute transition-all duration-300 ${isPlaying ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                                    <svg
                                        className="w-5 h-5 text-white ml-0.5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes glow {
                    0%, 100% {
                        opacity: 0.4;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.05);
                    }
                }
                
                @keyframes pulse-ring {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.2;
                    }
                    100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                }
                
                .animate-glow-slow {
                    animation: glow 3s ease-in-out infinite;
                }
                
                .animate-pulse-ring {
                    animation: pulse-ring 2s ease-in-out infinite;
                }
                
                /* Smooth scale animation for play button */
                .transition-all {
                    transition-property: all;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                /* Button click animation */
                .group:hover .hover\:scale-110 {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}