import { neon } from "@neondatabase/serverless"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    console.log("Session:", session) // Debug log

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const phone = String(body.phone || "").trim()
    const location = String(body.location || "").trim()

    console.log("Update data:", { phone, location, userId: session.user.id }) // Debug log

    if (!phone || !location) {
      return NextResponse.json(
        { error: "Phone and location are required" },
        { status: 400 }
      )
    }

    if (location.length > 255) {
      return NextResponse.json(
        { error: "Location is too long" },
        { status: 400 }
      )
    }

    // Try to update with explicit type conversion
    const userId = parseInt(session.user.id)
    
    const result = await sql`
      UPDATE users
      SET
        phone = ${phone},
        location = ${location},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, name, email, phone, location, blood_group
    `

    console.log("Update result:", result) // Debug log

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: result[0],
      message: "Profile updated successfully" 
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}