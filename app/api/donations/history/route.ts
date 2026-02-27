import { neon } from "@neondatabase/serverless"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const donations = await sql`
      SELECT * FROM donations
      WHERE donor_id = ${session.user.id}
      ORDER BY donation_date DESC
    `

    return NextResponse.json(donations)
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
