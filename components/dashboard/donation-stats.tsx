"use client"

import { motion } from "motion/react"
import { Heart, Calendar, Activity } from "lucide-react"

interface DonationStatsProps {
  totalDonations: number
  lastDonation: string | null
  isActive: boolean
}

export function DonationStats({ totalDonations, lastDonation, isActive }: DonationStatsProps) {
  const calculateDaysSince = (dateString: string | null) => {
    if (!dateString) return null
    const lastDate = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lastDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysSinceLastDonation = calculateDaysSince(lastDonation)
  const canDonateAgain = !lastDonation || (daysSinceLastDonation && daysSinceLastDonation >= 90)

  const stats = [
    {
      label: "Total Donations",
      value: totalDonations,
      icon: Heart,
      color: "red",
    },
    {
      label: "Days Since Last",
      value: daysSinceLastDonation || "—",
      icon: Calendar,
      color: "neutral",
    },
    {
      label: "Status",
      value: isActive ? "Active" : "Inactive",
      icon: Activity,
      color: isActive ? "green" : "neutral",
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-3 gap-2 sm:gap-4"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-3 sm:p-4"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 sm:mb-3 ${
              stat.color === "red" ? "bg-red-50" :
              stat.color === "green" ? "bg-green-50" :
              "bg-neutral-100"
            }`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                stat.color === "red" ? "text-red-500" :
                stat.color === "green" ? "text-green-500" :
                "text-neutral-900"
              }`} />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-neutral-900 mb-0.5 sm:mb-1 truncate">
              {stat.value}
            </p>
            <p className="text-xs text-neutral-600 leading-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {canDonateAgain && totalDonations > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-green-50 border border-green-200 rounded-2xl sm:rounded-3xl p-3 sm:p-4"
        >
          <p className="text-xs sm:text-sm font-medium text-green-900">
            ✓ You're eligible to donate again!
          </p>
          <p className="text-xs text-green-700 mt-0.5 sm:mt-1">
            It's been {daysSinceLastDonation} days since your last donation.
          </p>
        </motion.div>
      )}

      {!canDonateAgain && lastDonation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-neutral-50 border border-neutral-200 rounded-2xl sm:rounded-3xl p-3 sm:p-4"
        >
          <p className="text-xs sm:text-sm font-medium text-neutral-900">
            Please wait before donating again
          </p>
          <p className="text-xs text-neutral-600 mt-0.5 sm:mt-1">
            You can donate again in {90 - (daysSinceLastDonation || 0)} days.
          </p>
        </motion.div>
      )}
    </div>
  )
}