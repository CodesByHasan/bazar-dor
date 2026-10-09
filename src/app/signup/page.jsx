"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        console.error("Sign-up error:", error);

        toast.error(
          error.message || "সাইন আপ করতে ব্যর্থ হয়েছে"
        );

        return;
      }

      toast.success("একাউন্ট তৈরি সফল হয়েছে!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign-up failed:", error);

      toast.error(
        "একাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          নতুন একাউন্ট খুলুন
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="label text-sm font-semibold text-gray-700"
            >
              নাম
            </label>

            <input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="আপনার নাম"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="label text-sm font-semibold text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="label text-sm font-semibold text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="signup-password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="কমপক্ষে ৮ অক্ষর"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn mt-2 w-full bg-emerald-900 text-white hover:bg-emerald-800"
          >
            {loading
              ? "একাউন্ট তৈরি হচ্ছে..."
              : "সাইন আপ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ইতোমধ্যে একাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-bold text-emerald-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

