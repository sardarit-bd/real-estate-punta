'use client'

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/userAuth"

export default function ForgotPassword() {
  const { sendResetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      await sendResetPassword({ email })
      setMessage("Password reset link has been sent to your email. Please check your inbox.")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-brandColor mb-2 text-center">
          Forgot Password
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004087]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004087] text-white py-2 rounded-lg font-semibold hover:bg-[#003066] transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-center text-gray-500">
            Remember your password?{" "}
            <Link href="/pages/login" className="text-brandColor font-medium hover:underline">
              Back to Login
            </Link>
          </p>
          
          <p className="text-center text-gray-500">
            Need an account?{" "}
            <Link href="/pages/register" className="text-brandColor font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}