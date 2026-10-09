
import "./globals.css";
import Header from "@/components/Header";
import PriceMarquee from "@/components/PriceMarquee";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক জায়গায় দেখুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="flex min-h-screen flex-col bg-[#f8faf7] text-gray-900">
        <Toaster position="top-center" />
        <Header />
        <PriceMarquee />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="mt-auto border-t border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-600 sm:flex-row sm:px-6 lg:px-8">
            <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
            <p>সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।</p>
          </div>
        </footer>
      </body>
    </html>
  );
}