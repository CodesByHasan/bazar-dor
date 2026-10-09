import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-7xl font-black text-emerald-800">404</p>
        <h1 className="mt-4 text-2xl font-bold">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-gray-600">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরানো হয়েছে বা অস্তিত্ব নেই।
        </p>
        <Link href="/" className="btn mt-6 bg-emerald-900 text-white hover:bg-emerald-800">
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}