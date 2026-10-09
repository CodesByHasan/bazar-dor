"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson, unwrapList, toBengaliDigits } from "@/lib/products";
import { authClient } from "@/lib/auth-client";

// Helper function to format today's date in Bengali locale (e.g., "মঙ্গলবার, ৬ অক্টোবর, ২০২৬")
function getBengaliFormattedDate() {
  const daysBn = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const monthsBn = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const now = new Date();
  const dayName = daysBn[now.getDay()];
  const dateNum = toBengaliDigits(now.getDate());
  const monthName = monthsBn[now.getMonth()];
  const yearNum = toBengaliDigits(now.getFullYear());

  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    let alive = true;

    // Set client-side formatted date to prevent hydration mismatch
    setFormattedDate(getBengaliFormattedDate());

    async function loadCategories() {
      try {
        const response = await fetchJson("/categories");
        const categoryData = unwrapList(response);

        if (alive) {
          setCategories(categoryData);
        }
      } catch (error) {
        console.error("Could not load categories:", error);
        if (alive) setCategories([]);
      }
    }

    loadCategories();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Date Section */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-2xl shadow-sm transition group-hover:bg-emerald-700">
            🛒
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black leading-tight text-gray-900">
              বাজার দর
            </span>
            <span className="text-xs font-medium text-gray-500">
              {formattedDate || "আজকের তারিখ"}
            </span>
          </div>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden items-center gap-5 md:flex">
          <Link
            href="/"
            className="font-semibold text-gray-700 hover:text-emerald-700"
          >
            হোম
          </Link>

          {categories.map((category, index) => {
            const catId =
              category.id ??
              category.slug ??
              category.categoryId ??
              category._id;

            const label =
              category.nameBn ??
              category.name ??
              category.title ??
              category.categoryName ??
              String(catId);

            if (!catId) return null;

            return (
              <Link
                key={String(catId ?? index)}
                href={`/category/${encodeURIComponent(String(catId))}`}
                className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-emerald-700"
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {session?.user ? (
            <Link
              href="/profile"
              className="btn btn-sm border-emerald-900 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
            >
              প্রোফাইল ({session.user.name || "User"})
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-sm border-emerald-900 text-emerald-900 hover:bg-emerald-50"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="btn btn-sm border-0 bg-emerald-900 text-white hover:bg-emerald-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}