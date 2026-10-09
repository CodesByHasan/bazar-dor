import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক জায়গায় দেখুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="min-h-screen bg-[#f8faf7] text-gray-900">
        <Toaster position="top-center" />
        <Header />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="mt-16 border-t border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BazarDor — সচেতন বাজার, সঠিক সিদ্ধান্ত।
        </footer>
      </body>
    </html>
  );
}
