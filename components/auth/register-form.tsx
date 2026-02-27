"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Loader2,
  Droplet,
  Check,
  ChevronDown,
} from "lucide-react";

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    phone: "",
    location: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupSelect = (group: string) => {
    setFormData((prev) => ({ ...prev, bloodGroup: group }));
    setIsBloodGroupOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.bloodGroup) {
      setError("Please select a blood group");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          bloodGroup: formData.bloodGroup,
          phone: formData.phone,
          location: formData.location,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-5 sm:mb-6"
          >
            <Check
              className="h-8 w-8 sm:h-10 sm:w-10 text-white"
              strokeWidth={3}
            />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 sm:mb-3">
            Registration Successful!
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Redirecting to login...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl border border-neutral-300 rounded-2xl shadow-sm p-5 sm:p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-12">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500 flex items-center justify-center">
              <Droplet className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-neutral-900">
              RoktoBindu
            </span>
          </Link>
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-neutral-900">
            Create your account
          </h1>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-neutral-600">
            Join thousands saving lives every day
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0" />
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ben Tennyson"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+880 1XX XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5 sm:space-y-2 relative">
              <label
                htmlFor="bloodGroup"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Blood Group
              </label>
              <button
                type="button"
                onClick={() => setIsBloodGroupOpen(!isBloodGroupOpen)}
                disabled={isLoading}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-left text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50 flex items-center justify-between"
              >
                <span
                  className={
                    formData.bloodGroup
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }
                >
                  {formData.bloodGroup || "Select blood group"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 transition-transform ${
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
                    className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-1 p-1.5 sm:p-2">
                      {BLOOD_GROUPS.map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => handleBloodGroupSelect(group)}
                          className={`px-3 sm:px-4 py-2 sm:py-3 text-center text-sm rounded-lg sm:rounded-xl font-medium transition-colors ${
                            formData.bloodGroup === group
                              ? "bg-neutral-900 text-white"
                              : "hover:bg-neutral-100 text-neutral-900"
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

            {/* Location */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="location"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Location/District
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Cumilla, Chittagong"
                value={formData.location}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-neutral-900"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl sm:rounded-2xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 sm:py-4 bg-neutral-900 text-white text-sm sm:text-base font-medium rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-xs sm:text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-neutral-900 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
