import { neon } from "@neondatabase/serverless"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

// Badge definitions with icon names instead of emojis
const BADGE_MILESTONES = [
  { name: "First Drop", icon: "Heart", count: 1 },
  { name: "Lifesaver", icon: "Shield", count: 5 },
  { name: "Blood Hero", icon: "Trophy", count: 10 },
  { name: "Champion", icon: "Crown", count: 20 },
  { name: "Legend", icon: "Star", count: 50 },
]

async function awardBadges(userId: number, donationCount: number) {
  try {
    // Find which badges the user should have based on donation count
    const earnedBadges = BADGE_MILESTONES.filter(
      (badge) => donationCount >= badge.count
    )

    // Award each badge (UNIQUE constraint prevents duplicates)
    for (const badge of earnedBadges) {
      await sql`
        INSERT INTO badges (user_id, badge_name, badge_icon)
        VALUES (${userId}, ${badge.name}, ${badge.icon})
        ON CONFLICT (user_id, badge_name) DO NOTHING
      `
    }
  } catch (error) {
    console.error("Error awarding badges:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await sql`
      SELECT * FROM users WHERE id = ${session.user.id}
    `

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const donations = await sql`
      SELECT COUNT(*) as count FROM donations WHERE donor_id = ${session.user.id}
    `

    const donationCount = Number(donations[0]?.count) || 0

    // Award badges based on donation count
    await awardBadges(Number(session.user.id), donationCount)

    // Fetch badges after awarding
    const badges = await sql`
      SELECT * FROM badges WHERE user_id = ${session.user.id}
      ORDER BY earned_at DESC
    `

    const userWithData = {
      ...user[0],
      donationCount,
      badges,
    }

    return NextResponse.json(userWithData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}