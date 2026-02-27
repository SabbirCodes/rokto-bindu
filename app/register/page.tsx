import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Register - RoktoBindu",
  description: "Create your blood donation account",
}

export default async function RegisterPage() {
  const session = await auth()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <RegisterForm />
    </div>
  )
}