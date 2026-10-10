"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { fetchJson, unwrapList, toBengaliDigits } from "@/lib/products";

const getBengaliFormattedDate = () => {
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

  return `${daysBn[now.getDay()]}, ${toBengaliDigits(
    now.getDate()
  )} ${monthsBn[now.getMonth()]}, ${toBengaliDigits(now.getFullYear())}`;
};

const Header = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [categories, setCategories] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(getBengaliFormattedDate());

    const loadCategories = async () => {
      try {
        const response = await fetchJson("/categories");
        setCategories(unwrapList(response));
      } catch (error) {
        console.error("Could not load categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Same list is used by mobile and desktop menus
  const categoryLinks = categories
    .map((category) => {
      const id =
        category.id ??
        category.slug ??
        category.categoryId ??
        category._id;

      const label =
        category.nameBn ??
        category.name ??
        category.title ??
        category.categoryName ??
        String(id);

      return { id: id ? String(id) : "", label };
    })
    .filter((item) => item.id);

  // Close the mobile dropdown after tapping a link
  const closeMenu = () => {
    document.activeElement?.blur();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">

        {/* Mobile Menu + Logo */}
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-square btn-sm lg:hidden"
            >
              <svg
                aria-label="Menu"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>

            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content z-50 mt-3 w-56 rounded-box bg-white p-2 text-gray-700 shadow"
            >
              <li>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className={
                    pathname === "/"
                      ? "font-bold text-emerald-700"
                      : ""
                  }
                >
                  হোম
                </Link>
              </li>

              {categoryLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/category/${encodeURIComponent(item.id)}`}
                    onClick={closeMenu}
                    className={
                      pathname === `/category/${item.id}`
                        ? "font-bold text-emerald-700"
                        : ""
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-xl">
              🛒
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-black leading-tight text-gray-900">
                বাজার দর
              </span>

              <span className="text-[11px] font-medium text-gray-500">
                {formattedDate || "আজকের তারিখ"}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-gray-700">
            <li>
              <Link
                href="/"
                className={
                  pathname === "/"
                    ? "font-bold text-emerald-700"
                    : ""
                }
              >
                হোম
              </Link>
            </li>

            {categoryLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/category/${encodeURIComponent(item.id)}`}
                  className={
                    pathname === `/category/${item.id}`
                      ? "font-bold text-emerald-700"
                      : ""
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-end gap-2">
          {session?.user ? (
            <Link
              href="/profile"
              className="btn btn-sm border-emerald-900 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
            >
              প্রোফাইল
              <span className="hidden sm:inline">
                ({session.user.name || "User"})
              </span>
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
};

export default Header;