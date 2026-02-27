import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bloodGroup = searchParams.get("bloodGroup")
    const location = searchParams.get("location")

    let donors

    // Build query based on filters
    if (bloodGroup && location) {
      donors = await sql`
        SELECT id, name, blood_group, phone, location, is_active, date_of_birth, created_at 
        FROM users 
        WHERE is_active = true 
          AND blood_group = ${bloodGroup}
          AND location ILIKE ${`%${location}%`}
        ORDER BY created_at DESC
      `
    } else if (bloodGroup) {
      donors = await sql`
        SELECT id, name, blood_group, phone, location, is_active, date_of_birth, created_at 
        FROM users 
        WHERE is_active = true 
          AND blood_group = ${bloodGroup}
        ORDER BY created_at DESC
      `
    } else if (location) {
      donors = await sql`
        SELECT id, name, blood_group, phone, location, is_active, date_of_birth, created_at 
        FROM users 
        WHERE is_active = true 
          AND location ILIKE ${`%${location}%`}
        ORDER BY created_at DESC
      `
    } else {
      // No filters - return all active donors
      donors = await sql`
        SELECT id, name, blood_group, phone, location, is_active, date_of_birth, created_at 
        FROM users 
        WHERE is_active = true
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json(donors)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}