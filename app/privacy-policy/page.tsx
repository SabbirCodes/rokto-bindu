"use client";

import { motion } from "motion/react";
import { ShieldCheck, Eye, Database, Share2, Bell, Droplet, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

export default function PrivacyPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="py-24 bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <Droplet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white fill-white" />
            </div>
            <span className="text-base sm:text-lg font-medium tracking-tight text-neutral-900">
              RoktoBindu
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Register
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="sm:hidden border-t border-neutral-200 bg-white px-4 py-3 flex flex-col gap-2"
          >
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors text-center"
            >
              Register
            </Link>
          </motion.div>
        )}
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4 sm:px-6"
      >
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.h1
            variants={item}
            className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-neutral-900"
          >
            Privacy Policy
          </motion.h1>
          <motion.p variants={item} className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600">
            Last Updated: January 2026. Your data security is our heartbeat.
          </motion.p>
        </div>

        {/* Introduction */}
        <motion.div
          variants={item}
          className="mb-8 sm:mb-12 p-4 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-200"
        >
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            At our Blood Donation Platform, we respect your privacy. This policy outlines how we handle your personal and medical information to ensure a safe experience for both donors and recipients.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-8 sm:space-y-12">
          {[
            {
              icon: Database,
              title: "Information We Collect",
              desc: "We collect basic profile details (name, blood type, location) and health screening answers required by medical standards to determine donation eligibility.",
            },
            {
              icon: Eye,
              title: "How We Use Your Data",
              desc: "Your data is used solely to match you with urgent blood requests, notify you of local drives, and maintain a secure history of your life-saving contributions.",
            },
            {
              icon: ShieldCheck,
              title: "Data Protection",
              desc: "We use industry-standard encryption to protect your sensitive health data. Access is strictly limited to authorized medical personnel and emergency coordinators.",
            },
            {
              icon: Share2,
              title: "Third-Party Sharing",
              desc: "We never sell your data. We only share necessary contact details with verified hospitals or blood banks when a direct match for an emergency is found.",
            },
            {
              icon: Bell,
              title: "Your Controls",
              desc: "You have full control over your visibility. You can toggle your 'Available' status, update your health records, or delete your account at any time.",
            },
          ].map((policy, i) => (
            <motion.div key={i} variants={item} className="group">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-50 border border-neutral-200 group-hover:bg-red-50 transition-colors shrink-0">
                  <policy.icon className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-900 group-hover:text-red-600 transition-colors" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
                  {policy.title}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pl-10 sm:pl-14">
                {policy.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={item}
          className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-neutral-200 text-center"
        >
          <p className="text-sm sm:text-base text-neutral-600">
            Have questions about your data? Contact our privacy team at
          </p>
          <a
            href="mailto:privacy@roktobindu.com"
            className="text-red-600 font-medium hover:underline mt-2 inline-block text-sm sm:text-base"
          >
            privacy@roktobindu.com
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}