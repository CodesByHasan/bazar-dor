"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function SortedProducts({ products }) {
  const [sortBy, setSortBy] = useState("default");

  let sortedProducts = [...products];

  if (sortBy === "low") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sortBy === "high") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="sort" className="text-sm font-semibold">
          সাজান:
        </label>

        <select
          id="sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="select select-bordered w-full max-w-xs bg-white"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>

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
}
