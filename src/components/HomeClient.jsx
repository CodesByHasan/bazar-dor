"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchJson,
  normalizeProduct,
  unwrapList,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";

function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
        এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id ?? product.slug ?? index}
          product={product}
        />
      ))}
    </div>
  );
}

function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="card animate-pulse border border-gray-200 bg-white p-5"
        >
          <div className="skeleton h-14 w-14" />
          <div className="skeleton mt-5 h-3 w-1/3" />
          <div className="skeleton mt-3 h-6 w-2/3" />
          <div className="skeleton mt-6 h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function HomeClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      setLoading(true);
      setFailed(false);

      try {
        const data = await fetchJson("/products");
        const list = unwrapList(data);

        if (!Array.isArray(list)) {
          throw new Error("Invalid products response");
        }

        const normalizedProducts = list
          .map(normalizeProduct)
          .filter(Boolean);

        if (alive) {
          setProducts(normalizedProducts);
        }
      } catch (error) {
        console.error("Failed to load BazarDor products:", error);

        if (alive) {
          setProducts([]);
          setFailed(true);
          toast.error("পণ্যের তথ্য আনা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      alive = false;
    };
  }, [retry]);

  const risers = useMemo(
    () =>
      [...products]
        .filter((product) => Number(product.changePercent) > 0)
        .sort(
          (a, b) =>
            Number(b.changePercent) - Number(a.changePercent)
        )
        .slice(0, 6),
    [products]
  );

  const fallers = useMemo(
    () =>
      [...products]
        .filter((product) => Number(product.changePercent) < 0)
        .sort(
          (a, b) =>
            Number(a.changePercent) - Number(b.changePercent)
        )
        .slice(0, 6),
    [products]
  );

  return (
    <>
      {/* Hero */}
      <section className="hero-pattern rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-lime-200 px-3 py-1 text-sm font-bold text-emerald-950">
              বাংলাদেশের নিত্যপণ্যের বাজারদর
            </p>

            <h1 className="max-w-2xl text-4xl font-black leading-tight text-emerald-950 sm:text-5xl">
              প্রতিদিনের বাজার,{" "}
              <span className="text-emerald-700">
                দাম জানুন সহজেই।
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-gray-600">
              চাল, ডাল, সবজি ও নিত্যপ্রয়োজনীয় পণ্যের দাম এক
              জায়গায় দেখুন। বাজার করতে বের হওয়ার আগেই থাকুন
              প্রস্তুত।
            </p>

            <a
              href="#সব-পণ্য"
              className="btn mt-7 border-0 bg-emerald-900 px-6 text-white hover:bg-emerald-800"
            >
              সব পণ্যের দাম দেখুন ↓
            </a>
          </div>

          <div className="mx-auto grid aspect-square w-full max-w-sm place-items-center rounded-[2.5rem] bg-white shadow-xl shadow-emerald-900/10">
            <div className="text-center">
              <div className="text-8xl sm:text-9xl">🧺</div>
              <p className="mt-4 font-bold text-emerald-900">
                সঠিক সিদ্ধান্ত, সচেতন বাজার
              </p>
              <div className="mt-3 flex justify-center gap-2 text-3xl">
                🍚 🥬 🧅
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price increases */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">
              PRICE WATCH
            </p>
            <h2 className="mt-1 text-2xl font-black">
              আজ দাম বেড়েছে{" "}
              <span className="text-emerald-600">▲</span>
            </h2>
          </div>
          <span className="text-sm text-gray-500">শীর্ষ ৬ পণ্য</span>
        </div>

        {loading ? (
          <ProductSkeleton count={3} />
        ) : failed ? (
          <p className="text-gray-500">
            দাম বৃদ্ধির তথ্য এখন পাওয়া যাচ্ছে না।
          </p>
        ) : (
          <ProductGrid products={risers} />
        )}
      </section>

      {/* Price decreases */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-rose-600">
              PRICE DROP
            </p>
            <h2 className="mt-1 text-2xl font-black">
              আজ দাম কমেছে{" "}
              <span className="text-rose-600">▼</span>
            </h2>
          </div>
          <span className="text-sm text-gray-500">শীর্ষ ৬ পণ্য</span>
        </div>

        {loading ? (
          <ProductSkeleton count={3} />
        ) : failed ? (
          <p className="text-gray-500">
            দাম কমার তথ্য এখন পাওয়া যাচ্ছে না।
          </p>
        ) : (
          <ProductGrid products={fallers} />
        )}
      </section>

      {/* All products */}
      <section id="সব-পণ্য" className="mt-14 scroll-mt-6">
        <div className="mb-6">
          <p className="text-sm font-bold text-emerald-700">
            TODAY'S MARKET
          </p>
          <h2 className="mt-1 text-3xl font-black">সব পণ্য</h2>
          <p className="mt-2 text-gray-600">
            নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম ও পরিবর্তন এক নজরে দেখুন।
          </p>
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : failed ? (
          <div className="alert flex flex-col items-start gap-3">
            <p>
              API থেকে পণ্যের তথ্য আনা যায়নি। আবার চেষ্টা করুন।
            </p>
            <button
              type="button"
              className="btn btn-sm bg-emerald-900 text-white"
              onClick={() => setRetry((value) => value + 1)}
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </>
  );
}
