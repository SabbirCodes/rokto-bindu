import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bloodGroup = searchParams.get("bloodGroup")
    const location = searchParams.get("location")
    const showExpired = searchParams.get("showExpired") === "true"

    await sql`
      UPDATE blood_requests
      SET status = 'expired'
      WHERE status = 'active'
        AND needed_by IS NOT NULL
        AND needed_by < CURRENT_DATE
    `

    const statusFilter = showExpired ? "expired" : "active"

    let requests

    if (bloodGroup && location) {
      requests = await sql`
        SELECT id, patient_name, blood_group, units_needed, hospital, location,
               contact_phone, urgency, details, needed_by, created_at, status
        FROM blood_requests
        WHERE status = ${statusFilter}
          AND blood_group = ${bloodGroup}
          AND location ILIKE ${`%${location}%`}
        ORDER BY
          CASE urgency WHEN 'critical' THEN 1 WHEN 'urgent' THEN 2 ELSE 3 END,
          created_at DESC
      `
    } else if (bloodGroup) {
      requests = await sql`
        SELECT id, patient_name, blood_group, units_needed, hospital, location,
               contact_phone, urgency, details, needed_by, created_at, status
        FROM blood_requests
        WHERE status = ${statusFilter}
          AND blood_group = ${bloodGroup}
        ORDER BY
          CASE urgency WHEN 'critical' THEN 1 WHEN 'urgent' THEN 2 ELSE 3 END,
          created_at DESC
      `
    } else if (location) {
      requests = await sql`
        SELECT id, patient_name, blood_group, units_needed, hospital, location,
               contact_phone, urgency, details, needed_by, created_at, status
        FROM blood_requests
        WHERE status = ${statusFilter}
          AND location ILIKE ${`%${location}%`}
        ORDER BY
          CASE urgency WHEN 'critical' THEN 1 WHEN 'urgent' THEN 2 ELSE 3 END,
          created_at DESC
      `
    } else {
      requests = await sql`
        SELECT id, patient_name, blood_group, units_needed, hospital, location,
               contact_phone, urgency, details, needed_by, created_at, status
        FROM blood_requests
        WHERE status = ${statusFilter}
        ORDER BY
          CASE urgency WHEN 'critical' THEN 1 WHEN 'urgent' THEN 2 ELSE 3 END,
          created_at DESC
      `
    }

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Blood requests fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      patient_name,
      blood_group,
      units_needed,
      hospital,
      location,
      contact_phone,
      urgency,
      details,
      needed_by,
    } = body

    if (!patient_name || !blood_group || !hospital || !location || !contact_phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO blood_requests
        (requester_id, patient_name, blood_group, units_needed, hospital, location,
         contact_phone, urgency, details, needed_by, status)
      VALUES
        (${session.user.id}, ${patient_name}, ${blood_group}, ${units_needed ?? 1},
         ${hospital}, ${location}, ${contact_phone}, ${urgency ?? "normal"},
         ${details ?? null}, ${needed_by ?? null}, 'active')
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id }, { status: 201 })
  } catch (error) {
    console.error("Blood request creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}