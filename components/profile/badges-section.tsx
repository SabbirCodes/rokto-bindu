"use client"

import { motion } from "motion/react"
import { Award, Heart, Star, Trophy, Crown, Shield } from "lucide-react"

interface Badge {
  id: number
  badge_name: string
  badge_icon: string
  earned_at: string
}

interface BadgesSectionProps {
  badges: Badge[]
  donationCount: number
}

const BADGE_MILESTONES = [
  { name: "First Drop", icon: "Heart", count: 1, IconComponent: Heart },
  { name: "Lifesaver", icon: "Shield", count: 5, IconComponent: Shield },
  { name: "Blood Hero", icon: "Trophy", count: 10, IconComponent: Trophy },
  { name: "Champion", icon: "Crown", count: 20, IconComponent: Crown },
  { name: "Legend", icon: "Star", count: 50, IconComponent: Star },
]

export function BadgesSection({ badges, donationCount }: BadgesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-900" />
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Achievements</h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600">Your earned badges and progress</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {BADGE_MILESTONES.map((milestone, index) => {
            const Icon = milestone.IconComponent
            const earnedBadge = badges.find((b) => b.badge_name === milestone.name)
            const isEarned = !!earnedBadge

            const isNew =
              earnedBadge &&
              Math.floor(
                (Date.now() - new Date(earnedBadge.earned_at).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) <= 7

            return (
              <motion.div
                key={milestone.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.05 }}
                className={`group relative ${!isEarned ? "opacity-50" : ""}`}
              >
                <div
                  className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-center transition-all ${
                    isEarned
                      ? "bg-neutral-900 hover:bg-neutral-800"
                      : "bg-neutral-50 border-2 border-dashed border-neutral-300"
                  }`}
                >
                  <div
                    className={`mx-auto w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-colors ${
                      isEarned ? "bg-white/10" : "bg-neutral-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 sm:h-6 sm:w-6 ${
                        isEarned ? "text-white" : "text-neutral-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight ${
                      isEarned ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {milestone.name}
                  </h3>
                  <p
                    className={`text-xs leading-tight ${
                      isEarned ? "text-neutral-300" : "text-neutral-600"
                    }`}
                  >
                    {milestone.count} don{milestone.count !== 1 ? "s" : ""}
                  </p>
                  {!isEarned && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {donationCount}/{milestone.count}
                    </p>
                  )}
                </div>

                {/* "New" badge */}
                {isNew && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                    New
                  </div>
                )}

                {/* Tooltip — hidden on mobile, shown on hover for sm+ */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden sm:group-hover:block z-10 pointer-events-none">
                  <div className="bg-neutral-900 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-xl">
                    <p className="font-semibold">{milestone.name}</p>
                    <p className="text-neutral-300 mt-0.5">
                      Reach {milestone.count} donation{milestone.count !== 1 ? "s" : ""}
                    </p>
                    {isEarned && earnedBadge && (
                      <p className="text-neutral-400 mt-1">
                        Earned {new Date(earnedBadge.earned_at).toLocaleDateString()}
                      </p>
                    )}
                    {!isEarned && (
                      <p className="text-neutral-400 mt-1">
                        {milestone.count - donationCount} more needed
                      </p>
                    )}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-neutral-900" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress Message */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-neutral-50 rounded-xl sm:rounded-2xl border border-neutral-200">
          <p className="text-xs sm:text-sm text-neutral-900 font-medium">
            {donationCount === 0 && "Make your first donation to unlock your first badge!"}
            {donationCount > 0 && donationCount < 5 && `${5 - donationCount} more donation${5 - donationCount > 1 ? "s" : ""} until Lifesaver!`}
            {donationCount >= 5 && donationCount < 10 && `${10 - donationCount} more donation${10 - donationCount > 1 ? "s" : ""} until Blood Hero!`}
            {donationCount >= 10 && donationCount < 20 && `${20 - donationCount} more donation${20 - donationCount > 1 ? "s" : ""} until Champion!`}
            {donationCount >= 20 && donationCount < 50 && `${50 - donationCount} more donation${50 - donationCount > 1 ? "s" : ""} until Legend!`}
            {donationCount >= 50 && "You've unlocked all badges! You're a legend!!!"}
          </p>
        </div>
      </div>
    </motion.div>
  )
}