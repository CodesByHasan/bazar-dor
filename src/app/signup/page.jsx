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
    setLoading(true);

    await authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success("একাউন্ট তৈরি সফল হয়েছে!");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "সাইন আপ করতে ব্যর্থ হয়েছে");
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          নতুন একাউন্ট খুলুন
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="label text-sm font-semibold text-gray-700">
              নাম
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="আপনার নাম"
            />
          </div>

          <div>
            <label className="label text-sm font-semibold text-gray-700">
              ইমেইল
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label text-sm font-semibold text-gray-700">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-emerald-900 text-white hover:bg-emerald-800 mt-2"
          >
            {loading ? "একাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ইতোমধ্যে একাউন্ট আছে?{" "}
          <Link href="/signin" className="text-emerald-700 font-bold hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}