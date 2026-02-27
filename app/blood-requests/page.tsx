"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  Droplet,
  HeartPulse,
  SlidersHorizontal,
  X,
  Plus,
  TimerOff,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface BloodRequest {
  id: number;
  patient_name: string;
  blood_group: string;
  units_needed: number;
  hospital: string;
  location: string;
  contact_phone: string;
  urgency: "critical" | "urgent" | "normal";
  details: string | null;
  needed_by: string | null;
  created_at: string;
  status: "active" | "expired" | "fulfilled";
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgencyConfig = {
  critical: {
    label: "Critical",
    cardClass: "border-red-200",
    badgeClass: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500 animate-pulse",
    glow: "shadow-red-100",
  },
  urgent: {
    label: "Urgent",
    cardClass: "border-orange-200",
    badgeClass: "bg-orange-50 text-orange-600 border-orange-200",
    dot: "bg-orange-500",
    glow: "shadow-orange-100",
  },
  normal: {
    label: "Normal",
    cardClass: "border-neutral-200",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dot: "bg-neutral-400",
    glow: "",
  },
};

function getDaysUntilExpiry(neededBy: string | null): number | null {
  if (!neededBy) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(neededBy);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function ExpiryBadge({ neededBy }: { neededBy: string | null }) {
  const days = getDaysUntilExpiry(neededBy);
  if (days === null) return null;

  if (days < 0) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full border border-neutral-200">
        <TimerOff className="h-3 w-3 text-neutral-400" />
        <span className="text-xs text-neutral-500 font-medium">Expired</span>
      </div>
    );
  }

  if (days === 0) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full border border-red-200">
        <Clock className="h-3 w-3 text-red-500" />
        <span className="text-xs text-red-600 font-medium">Due today</span>
      </div>
    );
  }

  if (days <= 2) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full border border-orange-200">
        <Clock className="h-3 w-3 text-orange-500" />
        <span className="text-xs text-orange-600 font-medium">
          {days}d left
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-neutral-50 rounded-full border border-neutral-200">
      <Clock className="h-3 w-3 text-neutral-400" />
      <span className="text-xs text-neutral-500 font-medium">{days}d left</span>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function BloodRequestPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [showExpired, setShowExpired] = useState(false);
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (bloodGroup) params.append("bloodGroup", bloodGroup);
        if (location) params.append("location", location);
        if (showExpired) params.append("showExpired", "true");
        const response = await fetch(`/api/blood-requests?${params}`);
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError("Failed to load requests. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [bloodGroup, location, showExpired]);

  const handleClear = () => {
    setBloodGroup("");
    setLocation("");
  };

  const hasFilters = bloodGroup || location;

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-5 sm:space-y-8">
        {/* Page Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-2 sm:mb-3">
              <HeartPulse className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
              <span className="text-xs font-medium text-red-600">
                Live Requests
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              Blood Requests
            </h1>
            <p className="text-neutral-500 mt-1 sm:mt-1.5 text-xs sm:text-sm">
              People in need are waiting for your help
            </p>
          </div>
          <Link
            href="/request"
            className="shrink-0 self-start sm:self-auto inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="p-3 sm:p-4 bg-neutral-50 rounded-2xl sm:rounded-3xl border border-neutral-200"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-500 mb-3">
            <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Filter
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-start sm:items-center">
            {/* Blood Group Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsBloodGroupOpen(!isBloodGroupOpen)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all flex items-center justify-between gap-8"
              >
                <span className={bloodGroup ? "text-neutral-900" : "text-neutral-400"}>
                  {bloodGroup || "All Blood Groups"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition-transform shrink-0 ${
                    isBloodGroupOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isBloodGroupOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden min-w-40"
                  >
                    <div className="p-1.5 sm:p-2">
                      <button
                        onClick={() => {
                          setBloodGroup("");
                          setIsBloodGroupOpen(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm rounded-lg sm:rounded-xl transition-colors ${
                          bloodGroup === ""
                            ? "bg-neutral-900 text-white font-medium"
                            : "text-neutral-900 hover:bg-neutral-100"
                        }`}
                      >
                        All Blood Groups
                      </button>
                      {BLOOD_GROUPS.map((group) => (
                        <button
                          key={group}
                          onClick={() => {
                            setBloodGroup(group);
                            setIsBloodGroupOpen(false);
                          }}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm rounded-lg sm:rounded-xl transition-colors font-medium ${
                            bloodGroup === group
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-900 hover:bg-neutral-100"
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location..."
              className="w-full sm:w-auto sm:flex-1 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
            />

            {/* Show Expired Toggle */}
            <button
              onClick={() => setShowExpired(!showExpired)}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl border text-sm transition-colors ${
                showExpired
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-800"
              }`}
            >
              <TimerOff className="h-3.5 w-3.5" />
              Expired
            </button>

            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleClear}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
            {showExpired ? "Expired Requests" : "Active Requests"}
          </h2>
          {!isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-neutral-500"
            >
              {requests.length} {requests.length === 1 ? "request" : "requests"}{" "}
              found
            </motion.p>
          )}
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="animate-pulse bg-neutral-100 h-52 sm:h-64 rounded-2xl sm:rounded-3xl"
              />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-16 sm:py-24 bg-neutral-50 rounded-2xl sm:rounded-3xl border border-neutral-200"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-neutral-200 rounded-full mx-auto mb-4 sm:mb-5 flex items-center justify-center shadow-sm">
              <Droplet className="h-5 w-5 sm:h-7 sm:w-7 text-neutral-300" />
            </div>
            <p className="text-neutral-900 text-base sm:text-lg font-semibold mb-1 sm:mb-1.5">
              No {showExpired ? "expired" : "active"} requests found
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 sm:mb-8">
              {hasFilters
                ? "Try adjusting your filters"
                : showExpired
                  ? "No requests have expired yet"
                  : "No active blood requests at the moment"}
            </p>
            {hasFilters && (
              <button
                onClick={handleClear}
                className="px-6 sm:px-7 py-2 sm:py-2.5 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
          >
            {requests.map((req) => {
              const urg = urgencyConfig[req.urgency];
              const isExpired = req.status === "expired";
              return (
                <motion.div
                  key={req.id}
                  variants={cardVariants}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 hover:shadow-lg transition-shadow ${
                    isExpired
                      ? "border-neutral-200 opacity-60"
                      : `${urg.cardClass} ${urg.glow}`
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shrink-0 ${
                          isExpired
                            ? "bg-neutral-50 border-neutral-200"
                            : "bg-red-50 border-red-100"
                        }`}
                      >
                        <span
                          className={`font-bold text-xs sm:text-sm leading-none ${
                            isExpired ? "text-neutral-400" : "text-red-600"
                          }`}
                        >
                          {req.blood_group}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 leading-tight text-sm">
                          {req.patient_name}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {req.units_needed} unit
                          {req.units_needed !== 1 ? "s" : ""} needed
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {!isExpired && (
                        <span
                          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${urg.badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${urg.dot}`}
                          />
                          {urg.label}
                        </span>
                      )}
                      <ExpiryBadge neededBy={req.needed_by} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                        <HeartPulse className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-500" />
                      </div>
                      <span className="truncate">{req.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-500" />
                      </div>
                      <span className="truncate">{req.location}</span>
                    </div>
                    {req.needed_by && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-500" />
                        </div>
                        <span>
                          By{" "}
                          {new Date(req.needed_by).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {req.details && (
                    <p className="text-xs text-neutral-500 bg-neutral-50 rounded-xl sm:rounded-2xl px-3 py-2 sm:py-2.5 line-clamp-2 border border-neutral-100">
                      {req.details}
                    </p>
                  )}

                  {isExpired ? (
                    <div className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-neutral-100 text-neutral-400 text-xs sm:text-sm font-medium cursor-not-allowed">
                      <TimerOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Request Expired
                    </div>
                  ) : (
                    <a
                      href={`tel:${req.contact_phone}`}
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-neutral-900 text-white text-xs sm:text-sm font-medium hover:bg-neutral-700 transition-colors"
                    >
                      <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Contact
                    </a>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}