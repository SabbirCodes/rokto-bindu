"use client"

import { motion } from "motion/react"
import { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: number | string
  icon: ReactNode
  index: number
}

export function StatCard({ label, value, icon, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-white border border-neutral-300 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 hover:border-neutral-400 hover:shadow-lg transition-all group"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-tight">
          {label}
        </p>
        <p className="text-xl sm:text-3xl font-bold text-neutral-900">
          {value}
        </p>
      </div>
    </motion.div>
  )
}