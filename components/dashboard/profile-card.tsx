"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { toggleUserActive } from "@/lib/actions"
import { Phone, MapPin, Droplet, Calendar, Award } from "lucide-react"

interface ProfileCardProps {
  userId: string
  name: string
  email: string
  bloodGroup: string
  phone: string
  location: string
  donations: number
  lastDonationDate: string | null
  isActive: boolean
}

export function ProfileCard({
  userId,
  name,
  email,
  bloodGroup,
  phone,
  location,
  donations,
  lastDonationDate,
  isActive: initialIsActive,
}: ProfileCardProps) {
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleActive = async () => {
    setIsLoading(true)
    try {
      const result = await toggleUserActive(userId)
      if (result.success) {
        setIsActive(!isActive)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Failed to toggle active status", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
    >
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold text-lg sm:text-xl shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 truncate">
              {name}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 truncate">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 rounded-full w-fit">
          <Droplet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 fill-red-500" />
          <span className="text-base sm:text-lg font-bold text-red-500">{bloodGroup}</span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {[
          { icon: Phone, label: "Phone Number", value: phone },
          { icon: MapPin, label: "Location", value: location },
          { icon: Award, label: "Total Donations", value: donations },
          {
            icon: Calendar,
            label: "Last Donation",
            value: lastDonationDate
              ? new Date(lastDonationDate).toLocaleDateString()
              : "Never",
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-neutral-50">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-600 mb-0.5">{label}</p>
              <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-neutral-900">
              Availability Status
            </p>
            <p className="text-xs text-neutral-600">
              Toggle to show if you're available
            </p>
          </div>
          <div className={`shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${
            isActive
              ? "bg-green-50 text-green-500 border border-green-200"
              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
          }`}>
            {isActive ? "Available" : "Unavailable"}
          </div>
        </div>

        <button
          onClick={handleToggleActive}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all cursor-pointer ${
            isActive
              ? "bg-green-700 hover:bg-green-800 text-white"
              : "bg-neutral-900 hover:bg-neutral-800 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </span>
          ) : isActive ? (
            "Mark as Unavailable"
          ) : (
            "Mark as Available"
          )}
        </button>
      </div>
    </motion.div>
  )
}