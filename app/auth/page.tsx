"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import type { User } from "@/lib/types/user-types"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleLogin = (user: User) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        isAuthenticated: true,
      }),
    )

    // Redirect based on user role
    if (user.role === "Cliente") {
      router.push("/")
    } else if (user.role === "Farmacia") {
      router.push("/farmacia/panel")
    } else if (user.role === "Repartidor") {
      router.push("/repartidor/panel")
    }
  }

  const handleRegister = (user: User) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        isAuthenticated: true,
      }),
    )

    // Redirect based on user role
    if (user.role === "Cliente") {
      router.push("/")
    } else if (user.role === "Farmacia") {
      router.push("/farmacia/panel")
    } else if (user.role === "Repartidor") {
      router.push("/repartidor/panel")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} onLogin={handleLogin} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} onRegister={handleRegister} />
        )}
      </div>
    </div>
  )
}
