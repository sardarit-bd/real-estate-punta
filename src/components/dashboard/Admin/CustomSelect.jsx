"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ 
  value, 
  options, 
  onChange, 
  className = "", 
  variant = "default" 
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Support both string and object options
  const getDisplayValue = (opt) => {
    return typeof opt === 'object' ? opt.label : opt;
  };

  const getOptionValue = (opt) => {
    return typeof opt === 'object' ? opt.value : opt;
  };

  const getCurrentDisplayValue = () => {
    const selectedOption = options.find(opt => getOptionValue(opt) === value);
    return selectedOption ? getDisplayValue(selectedOption) : value;
  };

  const getVariantStyles = () => {
    const base = "w-full bg-white border flex justify-between items-center cursor-pointer text-gray-700 font-medium focus:outline-none transition-all duration-200 text-sm";
    
    switch(variant) {
      case "compact":
        return `${base} px-3 py-2 border-gray-300 rounded-lg hover:border-[#103B29] focus:border-[#103B29] focus:ring-1 focus:ring-[#103B29]`;
      default:
        return `${base} px-4 py-2.5 border-gray-300 rounded-lg hover:border-[#103B29] focus:border-[#103B29] focus:ring-2 focus:ring-[#103B29]`;
    }
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={getVariantStyles()}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{getCurrentDisplayValue().charAt(0).toUpperCase() + getCurrentDisplayValue().slice(1)}</span>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div 
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option, index) => {
            const optionValue = getOptionValue(option);
            const displayValue = getDisplayValue(option);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm cursor-pointer transition-all duration-200
                          ${value === optionValue 
                            ? 'bg-[#103B29] text-white font-medium' 
                            : 'hover:bg-gray-50 text-gray-700'
                          }`}
                role="option"
                aria-selected={value === optionValue}
              >
                {displayValue.charAt(0).toUpperCase() + displayValue.slice(1)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}