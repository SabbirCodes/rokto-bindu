"use client"

import { useState, useEffect } from "react"
import { Heart, Zap, Droplets, ShieldCheck, Apple, CalendarClock, UserCheck, Megaphone, ThumbsUp, Phone } from "lucide-react"

const BANNER_MESSAGES = [
  {
    icon: Zap,
    title: "Every Second Counts",
    description:
      "In critical situations, contact multiple donors at once to increase your chances of finding a match quickly.",
  },
  {
    icon: Heart,
    title: "One Donation, Three Lives",
    description:
      "A single donation can be split into red cells, plasma, and platelets — each saving a different patient.",
  },
  {
    icon: Droplets,
    title: "Know Your Blood Type",
    description:
      "O− is the universal donor and AB+ is the universal receiver. Knowing compatibility saves precious time.",
  },
  {
    icon: ShieldCheck,
    title: "Verify Before You Donate",
    description:
      "Always confirm blood group compatibility and review the patient's test reports before proceeding.",
  },
  {
    icon: Apple,
    title: "Prepare Before You Give",
    description:
      "Eat a healthy meal, stay hydrated, and rest well before donating. A healthy donor means a safer donation.",
  },
  {
    icon: CalendarClock,
    title: "Donate Every 3 Months",
    description:
      "Your body replenishes donated blood within weeks. Regular donors keep the supply steady year-round.",
  },
  {
    icon: UserCheck,
    title: "Keep Your Profile Updated",
    description:
      "Accurate contact information helps patients reach you faster. A few seconds of updating could save a life.",
  },
  {
    icon: Megaphone,
    title: "Spread the Word",
    description:
      "Share this platform with friends and family. A larger donor network means faster matches and more lives saved.",
  },
  {
    icon: ThumbsUp,
    title: "First-Time Donor?",
    description:
      "Donating for the first time is safe and simple. Staff will guide you through every step of the process.",
  },
  {
    icon: Phone,
    title: "Stay Reachable",
    description:
      "If you've registered as a donor, keep your phone on and respond promptly — someone may be counting on you right now.",
  },
]

export function EmergencyBanner() {
  const [message, setMessage] = useState(BANNER_MESSAGES[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BANNER_MESSAGES.length)
    setMessage(BANNER_MESSAGES[randomIndex])
  }, [])

  const Icon = message.icon

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-red-900 mb-0.5 sm:mb-1">
            {message.title}
          </h3>
          <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
            {message.description}
          </p>
        </div>
      </div>
    </div>
  )
}