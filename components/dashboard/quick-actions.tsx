"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Search, BarChart3, ClipboardList, HeartPulse } from "lucide-react"

const actions = [
  {
    label: "Find Donors",
    icon: Search,
    href: "/search",
    description: "Search for blood donors",
  },
  {
    label: "Statistics",
    icon: BarChart3,
    href: "/stats",
    description: "View platform stats",
  },
  {
    label: "Blood Requests",
    icon: HeartPulse,
    href: "/blood-request",
    description: "Request blood from donors",
  },
  {
    label: "My Requests",
    icon: ClipboardList,
    href: "/my-requests",
    description: "View your blood requests",
  },
]

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
        Quick Actions
      </h3>

      <div className="space-y-1 sm:space-y-2">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-neutral-50 transition-colors group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors shrink-0">
              <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-900 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 text-sm">
                {action.label}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}