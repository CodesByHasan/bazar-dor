"use client";

import { useEffect, useState } from "react";
import {
  fetchJson,
  money,
  normalizeProduct,
  unwrapList,
} from "@/lib/products";

export default function PriceMarquee() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetchJson("/products")
      .then((data) => {
        const list = unwrapList(data).map(normalizeProduct);

        if (!cancelled) {
          setProducts(list.filter((product) => product.id));
        }
      })
      .catch((error) => {
        console.error("Price marquee failed to load:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-hidden border-b bg-white py-3">
      <div className="animate-marquee flex w-max gap-6 whitespace-nowrap">
        {products.map((product) => (
          <span key={product.id} className="text-sm">
            <b>
              {product.image} {product.name}
            </b>{" "}
            {money(product.price)}/{product.unit}
            <span className="ml-6 text-gray-300">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

