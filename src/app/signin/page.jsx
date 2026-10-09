"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন ইন করেছেন!");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "সাইন ইন করতে ব্যর্থ হয়েছে");
          setLoading(false);
        },
      }
    );
  };

  const handleSocialSignIn = async (provider) => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          সাইন ইন করুন
        </h1>

        <form onSubmit={handleSignIn} className="space-y-4">
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
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="divider my-6 text-xs text-gray-400">অথবা</div>

        <div className="space-y-2">
          <button
            onClick={() => handleSocialSignIn("google")}
            className="btn btn-outline w-full text-gray-700 border-gray-300"
          >
            Google দিয়ে সাইন ইন
          </button>
          <button
            onClick={() => handleSocialSignIn("github")}
            className="btn btn-outline w-full text-gray-700 border-gray-300"
          >
            GitHub দিয়ে সাইন ইন
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          একাউন্ট নেই?{" "}
          <Link href="/signup" className="text-emerald-700 font-bold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}