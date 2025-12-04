"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        onClick={() => setOpen(!open)}
        className="bg-white px-4 py-2 rounded-xl border flex justify-between items-center shadow-sm 
                   cursor-pointer hover:border-[#E7C464] transition text-[#05314A] font-medium"
      >
        <span className="capitalize">{value}</span>
        <ChevronDown size={18} className="text-gray-500" />
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-xl z-20">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-[#E7C464] hover:text-black transition capitalize"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
