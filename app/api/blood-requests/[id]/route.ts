import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

const sql = neon(process.env.DATABASE_URL || "")

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: idParam } = await params
    const id = parseInt(idParam, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }

    const existing = await sql`
      SELECT id FROM blood_requests
      WHERE id = ${id} AND requester_id = ${session.user.id}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    await sql`DELETE FROM blood_requests WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete blood request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: idParam } = await params
    const id = parseInt(idParam, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }

    const body = await request.json()
    const { hospital, location, contact_phone, units_needed, urgency, details, needed_by } = body

    if (!hospital || !location || !contact_phone || !urgency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      UPDATE blood_requests
      SET
        hospital = ${hospital},
        location = ${location},
        contact_phone = ${contact_phone},
        units_needed = ${units_needed},
        urgency = ${urgency},
        details = ${details ?? null},
        needed_by = ${needed_by ?? null}
      WHERE id = ${id}
        AND requester_id = ${session.user.id}
      RETURNING *
    `

    if (!result.length) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update blood request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}