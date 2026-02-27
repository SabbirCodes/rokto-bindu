import Link from "next/link"
import { Droplet, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group mb-12">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
            <Droplet className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-lg font-medium tracking-tight text-neutral-900">
            RoktoBindu
          </span>
        </Link>

        {/* 404 */}
        <div className="mb-8">
          <p className="text-8xl font-bold text-neutral-900 leading-none tracking-tight">
            404
          </p>
          <div className="w-16 h-1 bg-red-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-900 text-neutral-900 text-sm font-medium rounded-full hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}