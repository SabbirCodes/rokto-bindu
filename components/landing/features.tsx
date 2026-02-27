"use client"

import { motion } from "motion/react"
import { Search, Bell, Shield, Heart } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Find donors quickly",
    description: "Search by blood type, location, and availability to find the right donor when you need them most.",
  },
  {
    icon: Bell,
    title: "Instant notifications",
    description: "Get alerted when someone needs your blood type in your area. Respond and save lives immediately.",
  },
  {
    icon: Shield,
    title: "Safe & verified",
    description: "All donors are verified through our secure system. Your privacy and safety are our top priorities.",
  },
  {
    icon: Heart,
    title: "Track your impact",
    description: "See how many lives you've touched. Every donation is a story of hope and survival.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export function Features() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
            How it works
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600">
            Simple, fast, and designed to save lives
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 gap-8 sm:gap-10 md:gap-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-1.5 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}