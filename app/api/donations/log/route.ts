import { neon } from "@neondatabase/serverless"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { location, recipientName } = body

    // Log donation
    const result = await sql`
      INSERT INTO donations (donor_id, location, recipient_name)
      VALUES (${session.user.id}, ${location}, ${recipientName})
      RETURNING *
    `

    // Get total donation count
    const donationCount = await sql`
      SELECT COUNT(*) as count FROM donations WHERE donor_id = ${session.user.id}
    `

    const count = Number(donationCount[0]?.count) || 0

    // Get donations in the current year for consistency badges
    const yearlyDonations = await sql`
      SELECT COUNT(*) as count 
      FROM donations 
      WHERE donor_id = ${session.user.id} 
      AND EXTRACT(YEAR FROM donation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `

    const yearCount = Number(yearlyDonations[0]?.count) || 0

    // Award badges based on milestones
    const badgesToAward = []

    // First donation
    if (count === 1) {
      badgesToAward.push({ name: "First Drop", icon: "heart" })
    }

    // Milestone badges
    if (count === 5) {
      badgesToAward.push({ name: "Lifesaver", icon: "shield" })
    }
    if (count === 10) {
      badgesToAward.push({ name: "Blood Hero", icon: "trophy" })
    }
    if (count === 20) {
      badgesToAward.push({ name: "Champion", icon: "crown" })
    }
    if (count === 50) {
      badgesToAward.push({ name: "Legend", icon: "star" })
    }

    // Yearly consistency badges
    if (yearCount === 3) {
      badgesToAward.push({ name: "Regular Donor", icon: "zap" })
    }
    if (yearCount === 6) {
      badgesToAward.push({ name: "Consistent Hero", icon: "medal" })
    }

    // Insert badges
    for (const badge of badgesToAward) {
      await sql`
        INSERT INTO badges (user_id, badge_name, badge_icon)
        VALUES (${session.user.id}, ${badge.name}, ${badge.icon})
        ON CONFLICT (user_id, badge_name) DO NOTHING
      `
    }

    return NextResponse.json({ 
      donation: result[0],
      badgesEarned: badgesToAward.length > 0 ? badgesToAward : null
    }, { status: 201 })
  } catch (error) {
    console.error("Error logging donation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}