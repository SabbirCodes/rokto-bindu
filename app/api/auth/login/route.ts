import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/auth"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const result = await sql`
      SELECT id, email, password, name, blood_group, phone, location, date_of_birth, is_active
      FROM users
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = result[0]

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Sign in with NextAuth
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      return NextResponse.json(
        {
          success: true,
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
        { status: 200 }
      )
    } catch (error) {
      console.error("NextAuth sign in error:", error)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}