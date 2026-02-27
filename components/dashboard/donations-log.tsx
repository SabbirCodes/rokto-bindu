"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { logDonation } from "@/lib/actions"
import { Calendar, MapPin, Plus, X, FileText } from "lucide-react"

interface Donation {
  id: string
  donation_date: string
  location: string
  notes?: string
}

interface DonationsLogProps {
  userId: string
  donations: Donation[]
}

export function DonationsLog({ userId, donations }: DonationsLogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    donationDate: "",
    location: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await logDonation(
        userId,
        formData.donationDate,
        formData.location,
        formData.notes
      )

      if (result.success) {
        setIsModalOpen(false)
        setFormData({ donationDate: "", location: "", notes: "" })
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Failed to log donation", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
            Donation History
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Log Donation</span>
            <span className="sm:hidden">Log</span>
          </button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {donations.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
              </div>
              <p className="text-sm sm:text-base text-neutral-900 font-semibold mb-1">
                No donations logged yet
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                Start tracking your donation history
              </p>
            </div>
          ) : (
            donations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border border-neutral-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-neutral-900">
                      {new Date(donation.donation_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-600 mt-0.5 sm:mt-1">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      <span className="truncate">{donation.location}</span>
                    </div>
                    {donation.notes && (
                      <div className="flex items-start gap-2 mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-700 bg-neutral-50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-neutral-200">
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 shrink-0 text-neutral-500" />
                        <p className="flex-1">{donation.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full sm:max-w-md"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Log New Donation
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <X className="h-4 w-4 text-neutral-900" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
                    Donation Date
                  </label>
                  <input
                    type="date"
                    value={formData.donationDate}
                    onChange={(e) =>
                      setFormData({ ...formData, donationDate: e.target.value })
                    }
                    required
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-sm sm:text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., City Hospital, Dhaka"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    placeholder="Add any additional details..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none transition-all"
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral-900 text-white text-sm sm:text-base rounded-full font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging...
                      </span>
                    ) : (
                      "Log Donation"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral-100 text-neutral-900 text-sm sm:text-base rounded-full font-medium hover:bg-neutral-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}