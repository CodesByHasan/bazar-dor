"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson, unwrapList } from "@/lib/products";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    let alive = true;

    fetchJson("/categories")
      .then((data) => {
        if (alive) setCategories(unwrapList(data));
      })
      .catch((error) => {
        console.error("Could not load categories:", error);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-emerald-900"
        >
          🛒 বাজার দর
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <Link href="/" className="font-semibold text-gray-700 hover:text-emerald-700">
            হোম
          </Link>

          {categories.slice(0, 5).map((category, index) => {
            const id =
              category.id ??
              category.categoryId ??
              category.slug ??
              category._id;

            const label =
              category.name ??
              category.title ??
              category.categoryName ??
              String(id);

            return (
              <Link
                key={String(id ?? index)}
                href={`/category/${encodeURIComponent(String(id))}`}
                className="text-sm font-medium text-gray-600 hover:text-emerald-700"
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
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