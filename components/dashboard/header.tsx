"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  Droplet,
  LogOut,
  User,
  BarChart3,
  Search,
  HeartPulse,
  ClipboardList,
  LogIn,
  Cross,
} from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };
    if (isDropdownOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDropdownOpen]);

  const isAuthenticated = status === "authenticated" && !!session;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
            <Droplet className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-base sm:text-lg font-medium tracking-tight text-neutral-900">
            RoktoBindu
          </span>
        </Link>

        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
        )}

        {/* Unauthenticated */}
        {status !== "loading" && !isAuthenticated && (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        )}

        {/* Authenticated */}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors active:scale-95"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <User className="h-5 w-5 text-neutral-900" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden z-20"
                >
                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    <Link
                      href="/search"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                    >
                      <Search className="h-4 w-4" />
                      Find Donors
                    </Link>

                    <Link
                      href="/blood-requests"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                    >
                      <HeartPulse className="h-4 w-4" />
                      Blood Requests
                    </Link>

                    <Link
                      href="/my-requests"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                    >
                      <ClipboardList className="h-4 w-4" />
                      My Requests
                    </Link>

                    <Link
                      href="/request"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                    >
                      <Cross className="h-4 w-4" />
                      Create Request
                    </Link>

                    <Link
                      href="/stats"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Statistics
                    </Link>

                    <div className="border-t border-neutral-200 my-2" />

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors active:bg-red-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.header>
  );
}
