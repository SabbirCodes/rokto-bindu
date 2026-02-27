import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - RoktoBindu",
  description: "Sign in to your blood donation account",
}

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <LoginForm />
    </div>
  )
}