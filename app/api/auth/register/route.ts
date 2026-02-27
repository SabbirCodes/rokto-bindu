import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, bloodGroup, phone, location, dateOfBirth } = body

    // Validate input
    if (!email || !password || !name || !bloodGroup || !phone || !location || !dateOfBirth) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password, name, blood_group, phone, location, date_of_birth, is_active)
      VALUES (${email}, ${hashedPassword}, ${name}, ${bloodGroup}, ${phone}, ${location}, ${dateOfBirth}, true)
      RETURNING id, email, name, blood_group, phone, location, date_of_birth, is_active
    `

    const user = result[0]

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          bloodGroup: user.blood_group,
          phone: user.phone,
          location: user.location,
          dateOfBirth: user.date_of_birth,
          isActive: user.is_active,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
