import { Play } from "lucide-react";
import { useState } from "react";

export function CircularPlayButton({
  text = "Play Video",
  onClick,
  size = 200,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-2 pb-0.5 rounded-full shadow-lg">
        <button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group rounded-full focus:outline-none"
          style={{ width: size, height: size }}
          aria-label="Play video"
        >
          {/* Outer white border */}
          <div
            className="absolute inset-0 rounded-full border-4 border-white"
            style={{
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            }}
          />

          {/* Gradient circle (PRIMARY COLOR BASED) */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: `
                conic-gradient(
                  from 0deg,
                  #004087,
                  #1a5fb4,
                  #003366,
                  #004087
                )
              `,
            }}
          >
            {/* Center play button */}
            <div
              className="absolute bg-black group-hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                width: size * 0.45,
                height: size * 0.45,
              }}
            >
              <Play
                size={size * 0.2}
                className="text-white fill-white ml-1 group-hover:text-[#004087] group-hover:fill-[#004087] transition-colors duration-300"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Rotating circular text */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{
              pointerEvents: "none",
              animation: "spinText 12s linear infinite",
            }}
            viewBox="0 0 200 200"
          >
            <defs>
              <path
                id="circlePath"
                d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
                fill="none"
              />
            </defs>

            <text
              fill="white"
              fontWeight="bold"
              dominantBaseline="middle"
              style={{
                fontSize: `${size * 0.08}px`,
                letterSpacing: "4px",
              }}
            >
              <textPath
                href="#circlePath"
                startOffset="47%"
                textAnchor="middle"
              >
                {text}
              </textPath>
            </text>
          </svg>

          {/* Inline animation */}
          <style jsx>{`
            @keyframes spinText {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </button>
      </div>
    </div>
  );
}
