"use client";

import { motion } from "motion/react";
import { HeartPulse, Droplet, ShieldPlus } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function BloodDonationDocument() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.h1
            variants={item}
            className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-neutral-900"
          >
            Why Your Donation Matters
          </motion.h1>
          <motion.p variants={item} className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600">
            A simple act of kindness that saves lives and strengthens our community.
          </motion.p>
        </div>

        <div className="space-y-4 sm:space-y-12">
          {[
            {
              icon: Droplet,
              title: "Blood Saves Lives",
              desc: "Every unit of donated blood can save up to three lives. From surgeries to cancer treatments, patients depend on donors like you. Blood cannot be manufactured—it only comes from generosity.",
            },
            {
              icon: HeartPulse,
              title: "Immediate Emergency Action",
              desc: "In crises or accidents, blood is needed within minutes. A stable network of voluntary donors ensures that hospitals can respond instantly without life-threatening delays.",
            },
            {
              icon: ShieldPlus,
              title: "Safe and Rewarding",
              desc: "Donating is a secure process handled by professionals. Beyond the health benefits, it fosters social responsibility and gives someone a second chance at life.",
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group border border-neutral-200 rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="shrink-0 p-2 rounded-lg bg-neutral-50 border border-neutral-200 group-hover:bg-red-50 transition-colors">
                  <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-900 group-hover:text-red-600 transition-colors" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900">
                  {section.title}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pl-0 sm:pl-14">
                {section.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={item}
          className="mt-10 sm:mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-8 text-center"
        >
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed italic">
            "Donating blood is more than a medical act—it is a humanitarian responsibility.
            Your small step can become someone else's hope."
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}