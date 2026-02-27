"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Filters } from "@/components/search/filters"
import { DonorCard } from "@/components/search/donor-card"
import { EmergencyBanner } from "@/components/search/emergency-banner"
import { AlertCircle } from "lucide-react"

interface Donor {
  id: number
  name: string
  blood_group: string
  location: string
  phone?: string
  date_of_birth: string
  created_at: string
}

export default function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [location, setLocation] = useState("")
  const [donors, setDonors] = useState<Donor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDonors = async () => {
      setIsLoading(true)
      setError("")
      try {
        const params = new URLSearchParams()
        if (bloodGroup) params.append("bloodGroup", bloodGroup)
        if (location) params.append("location", location)

        const response = await fetch(`/api/donors/search?${params}`)
        if (!response.ok) throw new Error("Failed to fetch donors")

        const data = await response.json()
        setDonors(data)
      } catch (err) {
        setError("Failed to load donors. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonors()
  }, [bloodGroup, location])

  const handleClearFilters = () => {
    setBloodGroup("")
    setLocation("")
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-5 sm:space-y-8">
        <EmergencyBanner />

        <Filters
          bloodGroup={bloodGroup}
          location={location}
          onBloodGroupChange={setBloodGroup}
          onLocationChange={setLocation}
          onClearFilters={handleClearFilters}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 sm:pb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900">
              Available Donors
            </h2>
            {!isLoading && (
              <p className="text-xs sm:text-sm text-neutral-600">
                {donors.length} {donors.length === 1 ? "donor" : "donors"} found
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-neutral-100 h-40 sm:h-48 rounded-3xl"
                />
              ))}
            </div>
          ) : donors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-14 sm:py-20 bg-neutral-50 rounded-3xl border border-neutral-200"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
              </div>
              <p className="text-neutral-900 text-lg sm:text-xl font-semibold mb-2">
                No donors found
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 sm:mb-8">
                Try adjusting your search criteria
              </p>
              {(bloodGroup || location) && (
                <button
                  onClick={handleClearFilters}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
                hidden: {},
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {donors.map((donor, index) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}