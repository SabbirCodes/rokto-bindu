"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, X } from "lucide-react";

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

interface FiltersProps {
  bloodGroup: string;
  location: string;
  onBloodGroupChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
}

export function Filters({
  bloodGroup,
  location,
  onBloodGroupChange,
  onLocationChange,
  onClearFilters,
}: FiltersProps) {
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4 sm:mb-6">
        Search Filters
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Blood Group Filter */}
        <div className="relative">
          <label className="block text-xs sm:text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
            Blood Group
          </label>
          <button
            type="button"
            onClick={() => setIsBloodGroupOpen(!isBloodGroupOpen)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm sm:text-base"
          >
            <span
              className={bloodGroup ? "text-neutral-900" : "text-neutral-400"}
            >
              {bloodGroup || "All blood groups"}
            </span>
            <ChevronDown
              className={`h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 transition-transform ${
                isBloodGroupOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isBloodGroupOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-1.5 sm:p-2">
                  <button
                    onClick={() => {
                      onBloodGroupChange("");
                      setIsBloodGroupOpen(false);
                    }}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm rounded-lg sm:rounded-xl transition-colors ${
                      bloodGroup === ""
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    All blood groups
                  </button>
                  {BLOOD_GROUPS.map((group) => (
                    <button
                      key={group}
                      onClick={() => {
                        onBloodGroupChange(group);
                        setIsBloodGroupOpen(false);
                      }}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm rounded-lg sm:rounded-xl transition-colors font-medium ${
                        bloodGroup === group
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-900 hover:bg-neutral-100"
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Enter location..."
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
          />
        </div>

        {/* Clear Button */}
        <div className="flex items-end sm:col-span-2 md:col-span-1">
          <button
            onClick={onClearFilters}
            disabled={!bloodGroup && !location}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-100 text-neutral-900 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
