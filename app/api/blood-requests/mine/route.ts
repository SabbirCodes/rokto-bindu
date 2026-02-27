import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const requests = await sql`
      SELECT id, patient_name, blood_group, units_needed, hospital, location,
             contact_phone, urgency, details, needed_by, is_fulfilled, created_at
      FROM blood_requests
      WHERE requester_id = ${session.user.id}
      ORDER BY created_at DESC
    `

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Fetch my requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}