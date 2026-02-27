"use client";

import { motion } from "motion/react";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Trust() {
  return (
    <section className="py-14 sm:py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.h2
          variants={item}
          className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-neutral-900"
        >
          Your Safety Comes First
        </motion.h2>

        <motion.p variants={item} className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600">
          A secure community built on trust, privacy, and urgent care.
        </motion.p>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Donors",
              desc: "Donor profiles are reviewed to ensure reliability and trust.",
            },
            {
              icon: Lock,
              title: "Data Privacy",
              desc: "Your personal information is securely stored and protected.",
            },
            {
              icon: AlertCircle,
              title: "Emergency Focused",
              desc: "Designed specifically for urgent blood requirements.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-2xl border border-neutral-200 p-5 sm:p-6 bg-white group"
            >
              <card.icon className="h-6 w-6 sm:h-7 sm:w-7 mx-auto text-neutral-900 group-hover:text-red-500 transition-colors" />
              <h3 className="mt-3 sm:mt-4 font-medium text-neutral-900">
                {card.title}
              </h3>
              <p className="mt-1.5 sm:mt-2 text-sm text-neutral-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}