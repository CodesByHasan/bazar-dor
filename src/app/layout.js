import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="min-h-screen">
        <Header />
        <main className="container-shell mt-8">{children}</main>
        <footer className="mt-16 border-t border-emerald-100 bg-white">
          <div className="container-shell flex flex-col gap-3 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black text-emerald-950">🛒 বাজার দর</p>
              <p className="text-gray-600">প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
            </div>
            <p className="max-w-lg text-gray-500">
              সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
            </p>
          </div>
        </footer>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
