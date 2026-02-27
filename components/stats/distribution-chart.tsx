"use client"

import { motion } from "motion/react"
import { Droplet, MapPin } from "lucide-react"

interface DistributionChartProps {
  title: string
  items: Array<{ blood_group?: string; location?: string; count: number }>
  icon: "droplet" | "location"
}

export function DistributionChart({ title, items, icon }: DistributionChartProps) {
  const maxCount = Math.max(...items.map((item) => item.count), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-neutral-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
          {icon === "droplet" ? (
            <Droplet className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-900" />
          ) : (
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-900" />
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900">{title}</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const percentage = (item.count / maxCount) * 100
          const label = item.blood_group || item.location || "Unknown"

          return (
            <div key={index} className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-neutral-900 truncate mr-2">{label}</span>
                <span className="text-neutral-600 shrink-0">{item.count}</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full bg-neutral-900 rounded-full"
                />
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-neutral-500">
          No data available
        </div>
      )}
    </motion.div>
  )
}