"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { useSession } from "next-auth/react"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

interface User {
  name?: string
  email?: string
  phone?: string
  location?: string
}

interface EditFormProps {
  onSuccess: () => void
  user: User
}

export function EditForm({ onSuccess, user }: EditFormProps) {
  const { data: session, update } = useSession()
  const [phone, setPhone] = useState(user?.phone || session?.user?.phone || "")
  const [location, setLocation] = useState(user?.location || session?.user?.location || "")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, location }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const data = await response.json()
      await update({
        ...data.user,
        phone: data.user.phone,
        location: data.user.location,
      })

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Edit Profile</h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 sm:mt-1">
            Update your contact information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl"
            >
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
              <p className="text-xs sm:text-sm text-green-700">Profile updated successfully</p>
            </motion.div>
          )}

          {[
            {
              id: "name",
              label: "Full Name (Read-only)",
              type: "text",
              value: user?.name || session?.user?.name || "",
              disabled: true,
            },
            {
              id: "email",
              label: "Email (Read-only)",
              type: "email",
              value: user?.email || session?.user?.email || "",
              disabled: true,
            },
          ].map(({ id, label, type, value }) => (
            <div key={id} className="space-y-1.5 sm:space-y-2">
              <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-neutral-900">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={value}
                disabled
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 rounded-xl sm:rounded-2xl bg-neutral-50 text-neutral-600 cursor-not-allowed"
              />
            </div>
          ))}

          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-neutral-900">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+880 1XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-600 transition-all"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-neutral-900">
              Location/District
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Dhaka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-600 transition-all"
            />
          </div>

          <div className="pt-1 sm:pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 sm:py-3 bg-neutral-900 text-white text-sm sm:text-base rounded-full font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}