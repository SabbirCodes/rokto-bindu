"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
              Every drop
              <br />
              <span className="text-red-500">saves a life</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl"
          >
            Connect with donors in your area. Request blood in emergencies. Join
            thousands making a difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-all hover:gap-3"
            >
              Become a donor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border-2 border-neutral-900 text-neutral-900 font-medium hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Find donors
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl"
        >
          {[
            { value: "10K+", label: "Active donors" },
            { value: "500+", label: "Lives saved" },
            { value: "24/7", label: "Available" },
          ].map((stat, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">
                {stat.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}