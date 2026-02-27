"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  AlertCircle,
  MapPin,
  Clock,
  HeartPulse,
  Trash2,
  Loader2,
  CheckCircle2,
  ClipboardList,
  Plus,
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
  is_fulfilled: boolean;
  created_at: string;
}

const urgencyConfig = {
  critical: {
    label: "Critical",
    badgeClass: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500 animate-pulse",
  },
  urgent: {
    label: "Urgent",
    badgeClass: "bg-orange-50 text-orange-600 border-orange-200",
    dot: "bg-orange-500",
  },
  normal: {
    label: "Normal",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dot: "bg-neutral-400",
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyRequests = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("/api/blood-requests/mine");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRequests(data);
      } catch {
        setError("Failed to load your requests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyRequests();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/blood-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete request. Please try again.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 mb-3">
              <ClipboardList className="h-3.5 w-3.5 text-neutral-500" />
              <span className="text-xs font-medium text-neutral-600">
                My Requests
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              My Blood Requests
            </h1>
            <p className="text-neutral-500 mt-1.5 text-sm">
              Manage and track your submitted requests
            </p>
          </div>
          <Link
            href="/request"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
          >
            <Plus className="h-4 w-4 fill-white" />
            New Request
          </Link>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h2 className="text-xl font-bold text-neutral-900">
            Submitted Requests
          </h2>
          {!isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-neutral-500"
            >
              {requests.length} {requests.length === 1 ? "request" : "requests"}{" "}
              total
            </motion.p>
          )}
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                className="animate-pulse bg-neutral-100 h-64 rounded-3xl"
              />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-24 bg-neutral-50 rounded-3xl border border-neutral-200"
          >
            <div className="w-16 h-16 bg-white border border-neutral-200 rounded-full mx-auto mb-5 flex items-center justify-center shadow-sm">
              <ClipboardList className="h-7 w-7 text-neutral-300" />
            </div>
            <p className="text-neutral-900 text-lg font-semibold mb-1.5">
              No requests yet
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              You haven't submitted any blood requests
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-2 px-7 py-2.5 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4 fill-white" />
              Create First Request
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {requests.map((req) => {
                const urg = urgencyConfig[req.urgency];
                const isConfirming = confirmId === req.id;
                const isDeleting = deletingId === req.id;

                return (
                  <motion.div
                    key={req.id}
                    variants={cardVariants}
                    exit="exit"
                    layout
                    className="bg-white rounded-3xl border border-neutral-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                          <span className="text-red-600 font-bold text-sm leading-none">
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
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${urg.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${urg.dot}`}
                        />
                        {urg.label}
                      </span>
                    </div>

                    {/* Status pill */}
                    <div className="flex items-center gap-2">
                      {req.is_fulfilled ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Fulfilled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Active
                        </span>
                      )}
                      <span className="text-xs text-neutral-400">
                        {new Date(req.created_at).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          <HeartPulse className="h-3.5 w-3.5 text-neutral-500" />
                        </div>
                        <span className="truncate">{req.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                        </div>
                        <span className="truncate">{req.location}</span>
                      </div>
                      {req.needed_by && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                            <Clock className="h-3.5 w-3.5 text-neutral-500" />
                          </div>
                          <span>
                            By{" "}
                            {new Date(req.needed_by).toLocaleDateString(
                              "en-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {req.details && (
                      <p className="text-xs text-neutral-500 bg-neutral-50 rounded-2xl px-3 py-2.5 line-clamp-2 border border-neutral-100">
                        {req.details}
                      </p>
                    )}

                    {/* Delete area */}
                    <div className="mt-auto pt-1">
                      <AnimatePresence mode="wait">
                        {isConfirming ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            <p className="text-xs text-neutral-500 mr-auto">
                              Are you sure?
                            </p>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(req.id)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60 inline-flex items-center gap-1.5"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                              Delete
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="trigger"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmId(req.id)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm text-neutral-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Request
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
