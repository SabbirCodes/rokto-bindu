import { neon } from "@neondatabase/serverless"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = body

    const result = await sql`
      UPDATE users
      SET is_active = ${isActive}
      WHERE id = ${session.user.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error toggling active status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
