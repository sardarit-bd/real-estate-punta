// src/pages/Register.jsx
'use client'
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/hooks/userAuth";
import { useRouter } from "next/navigation";;

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {register} = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await register(form)
      setMessage("Registration successful! You can now log in.");
      setForm({ name: "", email: "", password: "" });
      router.push("/pages/login");
    } catch (err) {
      console.log(err)
      setMessage(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-[var(--brandColor)] mb-6 text-center">
          Create Account
        </h2>
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("successful")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brandColor)]"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076BC]"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0076BC]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F3A34] text-white py-2 rounded-lg  transition-colors font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/pages/login" className="text-[var(--brandColor)] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
