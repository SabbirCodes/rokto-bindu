import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await sql`
      UPDATE blood_requests
      SET status = 'expired'
      WHERE 
        status = 'active'
        AND needed_by IS NOT NULL
        AND needed_by < CURRENT_DATE
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      expired: result.length,
      message: `${result.length} request(s) marked as expired`,
    })
  } catch (error) {
    console.error("Expire requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}