import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL || "")

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const result = await sql`
            SELECT id, email, name, password, blood_group, phone, location, date_of_birth, is_active
            FROM users
            WHERE email = ${credentials.email}
          `

          if (result.length === 0) {
            return null
          }

          const user = result[0]
          const passwordMatch = await bcrypt.compare(
            credentials.password as string, 
            user.password as string
          )

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            bloodGroup: user.blood_group,
            phone: user.phone,
            location: user.location,
            dateOfBirth: user.date_of_birth,
            isActive: user.is_active,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.bloodGroup = user.bloodGroup
        token.phone = user.phone
        token.location = user.location
        token.isActive = user.isActive
      }
      
      // Handle session updates (when update() is called)
      if (trigger === "update" && session) {
        if (session.phone) token.phone = session.phone
        if (session.location) token.location = session.location
      }
      
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id
        session.user.bloodGroup = token.bloodGroup
        session.user.phone = token.phone
        session.user.location = token.location
        session.user.isActive = token.isActive
      }
      return session
    },
  },
}