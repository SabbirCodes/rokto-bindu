"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Droplet, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const fieldClass =
  "w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-neutral-300 rounded-xl sm:rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:bg-neutral-50 disabled:text-neutral-600 transition-all text-sm"

const labelClass = "block text-xs sm:text-sm font-medium text-neutral-900 mb-1 sm:mb-1.5"

export default function RequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    const body = {
      patient_name: formData.get("patient_name"),
      blood_group: formData.get("blood_group"),
      units_needed: Number(formData.get("units_needed")),
      hospital: formData.get("hospital"),
      location: formData.get("location"),
      contact_phone: formData.get("contact_phone"),
      urgency: formData.get("urgency"),
      details: formData.get("details") || null,
      needed_by: formData.get("needed_by") || null,
    }

    try {
      const res = await fetch("/api/blood-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit request")
      }

      setSuccess(true)
      setTimeout(() => router.push("/blood-requests"), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/blood-requests"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-5 sm:mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
            Back to requests
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-3 sm:mb-4">
              <Droplet className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 fill-red-100" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Request Blood</h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Fill in the details below. Donors in your area will be able to contact you.
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-6"
              >
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-6"
              >
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
                <p className="text-xs sm:text-sm text-green-700">Request submitted! Redirecting...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Patient Name */}
            <div>
              <label className={labelClass}>
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patient_name"
                required
                placeholder="Full name of the patient"
                disabled={isSubmitting}
                className={fieldClass}
              />
            </div>

            {/* Blood Group + Units */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="blood_group"
                  required
                  defaultValue=""
                  disabled={isSubmitting}
                  className={fieldClass}
                >
                  <option value="" disabled>Select group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Units Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="units_needed"
                  required
                  min="1"
                  max="20"
                  defaultValue="1"
                  disabled={isSubmitting}
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Hospital */}
            <div>
              <label className={labelClass}>
                Hospital / Clinic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hospital"
                required
                placeholder="e.g. Cumilla Medical College Hospital"
                disabled={isSubmitting}
                className={fieldClass}
              />
            </div>

            {/* Location */}
            <div>
              <label className={labelClass}>
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Kotbari, Cumilla"
                disabled={isSubmitting}
                className={fieldClass}
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className={labelClass}>
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contact_phone"
                required
                placeholder="+880 1XXX-XXXXXX"
                disabled={isSubmitting}
                className={fieldClass}
              />
            </div>

            {/* Urgency + Needed By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>
                  Urgency <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  required
                  defaultValue="normal"
                  disabled={isSubmitting}
                  className={fieldClass}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Needed By</label>
                <input
                  type="date"
                  name="needed_by"
                  min={new Date().toISOString().split("T")[0]}
                  disabled={isSubmitting}
                  className={fieldClass}
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <label className={labelClass}>Additional Details</label>
              <textarea
                name="details"
                rows={3}
                placeholder="Any relevant information for potential donors..."
                disabled={isSubmitting}
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="pt-0.5 sm:pt-1">
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full px-4 py-2.5 sm:py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Submitted!
                  </span>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}