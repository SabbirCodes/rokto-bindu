"use server"

import { revalidatePath } from "next/cache"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function toggleUserActive(userId: string) {
  try {
    await sql`
      UPDATE users 
      SET is_active = NOT is_active 
      WHERE id = ${userId}
    `
    
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Toggle active error:", error)
    return { success: false, error: "Failed to update status" }
  }
}

export async function logDonation(userId: string, donationDate: string, location: string, notes?: string) {
  try {
    await sql`
      INSERT INTO donations (donor_id, donation_date, location, notes)
      VALUES (${userId}, ${donationDate}, ${location}, ${notes || null})
    `
    
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Log donation error:", error)
    return { success: false, error: "Failed to log donation" }
  }
}