import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { DonationsLog } from "@/components/dashboard/donations-log"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DonationStats } from "@/components/dashboard/donation-stats"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export const metadata = {
  title: "Dashboard - RoktoBindu",
  description: "Your blood donation dashboard",
}

interface Donation {
  id: string
  donation_date: string
  location: string
  notes?: string
}

async function getDonorData(userId: string) {
  try {
    const user = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `

    if (!user.length) {
      return null
    }

    const donations = await sql`
      SELECT * FROM donations WHERE donor_id = ${userId} ORDER BY donation_date DESC
    `

    return {
      user: user[0],
      donations: donations as Donation[],
    }
  } catch (error) {
    console.error("Error fetching donor data:", error)
    return null
  }
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const data = await getDonorData(session.user.id)

  if (!data) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">
            Welcome back, {data.user.name.split(" ")[0]}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1.5 sm:mt-2">
            Track your donations and make a difference
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile & Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <ProfileCard
              userId={data.user.id}
              name={data.user.name}
              email={data.user.email}
              bloodGroup={data.user.blood_group}
              phone={data.user.phone}
              location={data.user.location}
              donations={data.donations.length}
              lastDonationDate={data.donations[0]?.donation_date || null}
              isActive={data.user.is_active}
            />

            <QuickActions />
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <DonationStats
              totalDonations={data.donations.length}
              lastDonation={data.donations[0]?.donation_date || null}
              isActive={data.user.is_active}
            />

            <DonationsLog
              userId={data.user.id}
              donations={data.donations}
            />
          </div>
        </div>
      </div>
    </div>
  )
}