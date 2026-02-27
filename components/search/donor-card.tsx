"use client";

import { motion } from "motion/react";
import { Phone, MapPin, Droplet } from "lucide-react";

interface DonorCardProps {
  donor: {
    id: number;
    name: string;
    blood_group: string;
    location: string;
    phone?: string;
    date_of_birth: string;
    created_at: string;
  };
  index: number;
}

// Calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}


export function DonorCard({ donor, index }: DonorCardProps) {
  const age = calculateAge(donor.date_of_birth);
  console.log(donor)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 p-4 sm:p-6 hover:border-neutral-300 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold text-base sm:text-lg shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            {donor.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 truncate">
              {donor.name}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              {age} years old
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-50 rounded-full shrink-0 ml-2">
          <Droplet className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500 fill-red-500" />
          <span className="text-xs sm:text-sm font-bold text-red-500">
            {donor.blood_group}
          </span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-neutral-600">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate">{donor.location}</span>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 border-t border-neutral-200">
        {donor.phone ? (
          <a
            href={`tel:${donor.phone}`}
            className="block w-full px-4 py-2.5 sm:py-3 bg-neutral-900 text-white text-center text-xs sm:text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline-block mr-2 -mt-0.5" />
            Contact Donor
          </a>
        ) : (
          <button
            disabled
            className="block w-full px-4 py-2.5 sm:py-3 bg-neutral-100 text-neutral-400 text-center text-xs sm:text-sm font-medium rounded-full cursor-not-allowed"
          >
            No Contact Info
          </button>
        )}
      </div>
    </motion.div>
  );
}
