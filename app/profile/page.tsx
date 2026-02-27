"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "motion/react"
import { DashboardHeader } from "@/components/dashboard/header"
import { EditForm } from "@/components/profile/edit-form"
import { BadgesSection } from "@/components/profile/badges-section"
import { AlertCircle } from "lucide-react"

interface ProfileData {
  id: string
  name: string
  email: string
  blood_group: string
  phone: string
  location: string
  date_of_birth: string
  donationCount: number
  badges: Array<{
    id: number
    badge_name: string
    badge_icon: string
    earned_at: string
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setProfileData(data)
      } catch (err) {
        console.error("Profile fetch error:", err)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchProfileData()
    }
  }, [status, router])

  const handleProfileUpdate = () => {
    setIsLoading(true)
    setError("")

    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Refresh error:", err)
        setError("Failed to refresh profile")
        setIsLoading(false)
      })
  }

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-4 sm:space-y-6">
          <div className="animate-pulse bg-neutral-100 h-72 sm:h-96 rounded-2xl sm:rounded-3xl" />
          <div className="animate-pulse bg-neutral-100 h-48 sm:h-64 rounded-2xl sm:rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-5 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-1.5 sm:mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Manage your account information and donation history
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-2xl sm:rounded-3xl"
          >
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
            <span className="text-xs sm:text-sm text-red-700">{error}</span>
          </motion.div>
        )}

        {profileData && (
          <>
            <EditForm
              user={{
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                location: profileData.location,
              }}
              onSuccess={handleProfileUpdate}
            />
            <BadgesSection
              badges={profileData.badges}
              donationCount={profileData.donationCount}
            />
          </>
        )}

        {!profileData && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
            </div>
            <p className="text-sm sm:text-base text-neutral-600">
              No profile data available
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}