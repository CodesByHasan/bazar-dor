"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fetchJson, normalizeProduct, unwrapList } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <div className="skeleton size-14 rounded-2xl" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton mt-4 h-4 w-1/3" />
      <div className="skeleton mt-2 h-6 w-2/3" />
      <div className="skeleton mt-2 h-4 w-1/4" />
      <div className="mt-4 flex justify-between border-t pt-3">
        <div className="skeleton h-8 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  );
}

function ProductGrid({ title, products, emptyText }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm border">
        {emptyText || "কোন তথ্য পাওয়া যায়নি।"}
      </div>
    );
  }

  return (
    <section className="mb-10">
      {title && (
        <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function HomeClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJson("/products");
      const normalized = unwrapList(data).map(normalizeProduct);
      setProducts(normalized);
    } catch (err) {
      console.error(err);
      setError("বাজারদরের তথ্য লোড করা যায়নি। দয়া করে পুনরায় চেষ্টা করুন।");
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const priceRises = useMemo(
    () => products.filter((p) => p.changePercent > 0).slice(0, 6),
    [products]
  );

  const priceDrops = useMemo(
    () => products.filter((p) => p.changePercent < 0).slice(0, 6),
    [products]
  );

  return (
    <div>
      <section className="hero-pattern mb-8 rounded-3xl border border-emerald-100 p-6 sm:p-10 text-center sm:text-left">
        <div className="max-w-2xl">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            লাইভ আপডেট
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-emerald-950 sm:text-5xl">
            আজকের নিত্যপ্রয়োজনীয় বাজারদর
          </h1>
          <p className="mt-3 text-gray-600 sm:text-lg">
            সচেতন থাকুন, সঠিক দামে কিনুন। ঢাকার বিভিন্ন বাজারের সঠিক তথ্য এক প্ল্যাটফর্মে।
          </p>

          <div className="mt-6">
            <input
              type="text"
              placeholder="পণ্য বা ক্যাটাগরি খুঁজুন (যেমন: চাল, তেল)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full max-w-md bg-white text-black focus:outline-emerald-600"
            />
          </div>
        </div>
      </section>

      {error ? (
        <div className="my-12 text-center">
          <p className="text-rose-600 font-semibold">{error}</p>
          <button
            onClick={loadData}
            className="btn btn-sm mt-4 bg-emerald-900 text-white hover:bg-emerald-800"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : searchQuery ? (
        <ProductGrid
          title={`অনুসন্ধানের ফলাফল (${filteredProducts.length})`}
          products={filteredProducts}
          emptyText="আপনার অনুসন্ধানের সাথে কোন পণ্য মেলেনি।"
        />
      ) : (
        <>
          {priceRises.length > 0 && (
            <ProductGrid title="📈 দাম বৃদ্ধি পাওয়া পণ্য" products={priceRises} />
          )}

          {priceDrops.length > 0 && (
            <ProductGrid title="📉 দাম কমে যাওয়া পণ্য" products={priceDrops} />
          )}

          <ProductGrid title="🛒 সকল পণ্য" products={products} />
        </>
      )}
    </div>
  );
}