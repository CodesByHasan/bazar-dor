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
  const [socialLoading, setSocialLoading] = useState("");

  const router = useRouter();

  // Email and password sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        console.error("Email sign-in error:", error);
        toast.error(
          error.message || "সাইন ইন করতে ব্যর্থ হয়েছে"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন করেছেন!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Email sign-in failed:", error);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Google and GitHub sign-in
  const handleSocialSignIn = async (provider) => {
    if (socialLoading) return;

    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signin",
      });

      if (error) {
        console.error(`${provider} sign-in error:`, error);

        toast.error(
          error.message || "Social sign-in failed"
        );

        setSocialLoading("");
      }
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error);

      toast.error("সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");

      setSocialLoading("");
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          সাইন ইন করুন
        </h1>

        {/* Email and password form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="signin-email"
              className="label text-sm font-semibold text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="signin-email"
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
              htmlFor="signin-password"
              className="label text-sm font-semibold text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="signin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(socialLoading)}
            className="btn mt-2 w-full bg-emerald-900 text-white hover:bg-emerald-800"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="divider my-6 text-xs text-gray-400">
          অথবা
        </div>

        {/* Social sign-in buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={loading || Boolean(socialLoading)}
            className="btn btn-outline w-full border-gray-300 text-gray-700"
          >
            {socialLoading === "google"
              ? "Google-এ সংযোগ হচ্ছে..."
              : "Google দিয়ে সাইন ইন"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={loading || Boolean(socialLoading)}
            className="btn btn-outline w-full border-gray-300 text-gray-700"
          >
            {socialLoading === "github"
              ? "GitHub-এ সংযোগ হচ্ছে..."
              : "GitHub দিয়ে সাইন ইন"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          একাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-bold text-emerald-700 hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}

