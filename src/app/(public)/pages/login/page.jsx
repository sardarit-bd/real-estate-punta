'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/userAuth"

export default function Login() {
  const router = useRouter()
  const { login, user } = useAuth()

  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await login(form)
      setMessage("Login successful! Redirecting...")
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed. Check credentials."
      )
      setLoading(false)
    }
  }


  useEffect(() => {
    if (!user) return

    if (user.role === "admin") {
      router.replace("/dashboard")
    } else if (user.role === "owner") {
      router.replace("/dashboard")
    } else if (user.role === "tenant") {
      router.replace("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-brandColor mb-6 text-center">
          Login
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${message.includes("successful")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004087] text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Do not have an account?{" "}
          <Link href="/pages/register" className="text-brandColor font-medium">
            Register
          </Link>
        </p>

        <p className="mt-2 text-center text-gray-500">
          <Link href="/pages/forgot-password" className="text-brandColor hover:underline">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}
