"use client";

import { useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";

const SortedProducts = ({ products }) => {
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sortBy === "low") {
      return list.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "high") {
      return list.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return list;
  }, [products, sortBy]);

  return (
    <div>
      {/* Sort */}
      <div className="mb-6 flex items-center gap-3">
        <label
          htmlFor="sort"
          className="text-sm font-semibold text-gray-700"
        >
          সাজান:
        </label>

        <div className="relative w-full max-w-xs">
          <select
            id="sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            className="select select-bordered w-full bg-white bg-none pr-10 text-black"
          >
            <option value="default">ডিফল্ট</option>

            <option value="low">
              দাম: কম থেকে বেশি
            </option>

            <option value="high">
              দাম: বেশি থেকে কম
            </option>
          </select>

          {/* Chevron icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id || product.slug}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default SortedProducts;