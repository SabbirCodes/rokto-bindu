import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import Link from "next/link";
import { Droplet } from "lucide-react";
import { Trust } from "@/components/landing/trust";
import { BloodDonationDocument } from "@/components/landing/blood-donation-document";

export const metadata = {
  title: "RoktoBindu - Blood Donation Platform",
  description:
    "Find blood donors or become a lifesaver. RoktoBindu connects donors and recipients for emergency blood needs.",
};

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
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

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-14 sm:pt-16">
        <Hero />
        <Features />
        <Trust />
        <BloodDonationDocument />
      </main>

      <footer className="border-t border-neutral-300 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-neutral-500">
            © 2026{" "}
            <Link href="/privacy-policy" className="hover:underline font-medium">
              RoktoBindu
            </Link>
            . Saving lives together.
          </p>
        </div>
      </footer>
    </div>
  );
}