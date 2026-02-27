import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest) {
  try {
    // Total donors
    const totalDonors = await sql`
      SELECT COUNT(*) as count FROM users
    `

    // Active donors
    const activeDonors = await sql`
      SELECT COUNT(*) as count FROM users WHERE is_active = true
    `

    // Total donations
    const totalDonations = await sql`
      SELECT COUNT(*) as count FROM donations
    `

    // Blood group distribution
    const bloodGroupDistribution = await sql`
      SELECT blood_group, COUNT(*) as count
      FROM users
      GROUP BY blood_group
      ORDER BY count DESC
    `

    // Recent donations
    const recentDonations = await sql`
      SELECT 
        u.name, 
        d.donation_date, 
        u.blood_group,
        d.location
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      ORDER BY d.donation_date DESC
      LIMIT 10
    `

    // Location distribution
    const locationDistribution = await sql`
      SELECT location, COUNT(*) as count
      FROM users
      GROUP BY location
      ORDER BY count DESC
    `

    return NextResponse.json({
      totalDonors: (totalDonors[0]?.count as number) || 0,
      activeDonors: (activeDonors[0]?.count as number) || 0,
      totalDonations: (totalDonations[0]?.count as number) || 0,
      bloodGroupDistribution,
      recentDonations,
      locationDistribution,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
