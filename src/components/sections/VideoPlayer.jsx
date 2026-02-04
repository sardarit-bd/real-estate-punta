"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CircularPlayButton } from "./CircularPlayButton";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [videoUrl, setVideoUrl] = useState("/videos/hero-video.mp4");

  const [buttonSize, setButtonSize] = useState(150);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setButtonSize(100);
      } else if (window.innerWidth < 768) {
        setButtonSize(120);
      } else {
        setButtonSize(150);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const fetchSite = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site`
      );
      setVideoUrl(res?.data?.data[0]?.featuredVideo);
    };
    fetchSite();
  }, []);

  const handlePlayClick = () => {
    if (!videoRef.current || isAnimating) return;

    setIsAnimating(true);

    if (isPlaying) {
      videoRef.current.pause();
      setPlayButtonVisible(true);

      setTimeout(() => {
        setIsPlaying(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setPlayButtonVisible(false);

      setTimeout(() => {
        videoRef.current.play();
        setIsPlaying(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setPlayButtonVisible(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setPlayButtonVisible(false);
  };

  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div className="relative w-full max-w-full sm:max-w-[500px] md:max-w-[600px] mx-auto aspect-video md:h-[435px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden group">
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          playsInline
          className="w-full h-full object-cover rounded-xl sm:rounded-2xl md:rounded-3xl transition-all duration-300 group-hover:brightness-90"
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
        />
        {playButtonVisible && (
          <div
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
            onClick={handlePlayClick}
          >
            <CircularPlayButton
              text="Play Video · Play Video · Play Video · Play Video ·"
              size={buttonSize}
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32"
            />
          </div>
        )}

        {/* Small Play / Pause Button (Top Left) */}
        <div
          className={`absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 transition-all duration-500 ${isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          onClick={handlePlayClick}
        >
          <div className="relative group/button">
            <div className="absolute -inset-2 sm:-inset-3 bg-yellow-400/30 rounded-full blur-md opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 -z-10"></div>

            <div className="bg-black/80 backdrop-blur-sm rounded-full p-2 sm:p-3 cursor-pointer transform hover:scale-110 transition-all duration-300 shadow-lg">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                {/* Pause Icon */}
                <div
                  className={`absolute transition-all duration-300 ${isPlaying
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-50"
                    }`}
                >
                  <div className="flex space-x-0.5 sm:space-x-1">
                    <div className="w-1 h-4 sm:w-1.5 sm:h-5 bg-white rounded-full"></div>
                    <div className="w-1 h-4 sm:w-1.5 sm:h-5 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Play Icon */}
                <div
                  className={`absolute transition-all duration-300 ${isPlaying
                      ? "opacity-0 -rotate-90 scale-50"
                      : "opacity-100 rotate-0 scale-100"
                    }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0 sm:ml-0.5"
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
    </div>
  );
}