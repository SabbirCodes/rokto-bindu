"use client"

import { motion } from "motion/react"
import { Calendar, Droplet, MapPin } from "lucide-react"

interface Donation {
  name: string
  donation_date: string
  blood_group: string
  location: string
}

interface RecentDonationsListProps {
  donations: Donation[]
}

export function RecentDonationsList({ donations }: RecentDonationsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-neutral-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4 sm:mb-6">
        Recent Donations
      </h3>

      {donations.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {donations.map((donation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.7 + index * 0.1,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 text-sm sm:text-base font-bold shrink-0">
                {donation.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1.5 sm:mb-2">
                  <h4 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                    {donation.name}
                  </h4>
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-red-50 rounded-full shrink-0">
                    <Droplet className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500 fill-red-500" />
                    <span className="text-xs font-bold text-red-500">
                      {donation.blood_group}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    <span>{formatDate(donation.donation_date)}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">{donation.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 text-xs sm:text-sm text-neutral-500">
          No recent donations found
        </div>
      )}
    </motion.div>
  )
}