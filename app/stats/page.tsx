"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatCard } from "@/components/stats/stat-card"
import { RecentDonationsList } from "@/components/stats/recent-donations-list"
import { DistributionChart } from "@/components/stats/distribution-chart"
import { Users, Activity, Heart, TrendingUp } from "lucide-react"

interface StatsData {
  totalDonors: number
  activeDonors: number
  totalDonations: number
  bloodGroupDistribution: Array<{ blood_group: string; count: number }>
  recentDonations: Array<{
    name: string
    donation_date: string
    blood_group: string
    location: string
  }>
  locationDistribution: Array<{ location: string; count: number }>
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/platform")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-5 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">
            Platform Statistics
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1.5 sm:mt-2">
            Real-time insights and platform analytics
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 sm:h-32 bg-neutral-100 rounded-2xl sm:rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatCard
                label="Total Donors"
                value={stats.totalDonors}
                icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
                index={0}
              />
              <StatCard
                label="Active Donors"
                value={stats.activeDonors}
                icon={<Activity className="h-5 w-5 sm:h-6 sm:w-6" />}
                index={1}
              />
              <StatCard
                label="Total Donations"
                value={stats.totalDonations}
                icon={<Heart className="h-5 w-5 sm:h-6 sm:w-6" />}
                index={2}
              />
              <StatCard
                label="Avg. per Donor"
                value={
                  stats.totalDonors > 0
                    ? (stats.totalDonations / stats.totalDonors).toFixed(1)
                    : 0
                }
                icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
                index={3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <DistributionChart
                title="Blood Group Distribution"
                items={stats.bloodGroupDistribution}
                icon="droplet"
              />
              <DistributionChart
                title="Location Distribution"
                items={stats.locationDistribution}
                icon="location"
              />
            </div>

            <RecentDonationsList donations={stats.recentDonations} />
          </>
        ) : null}
      </div>
    </div>
  )
}