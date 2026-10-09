
"use client";

import { useEffect, useState } from "react";
import {
  fetchJson,
  normalizeProduct,
  unwrapList,
  money,
  changeLabel,
} from "@/lib/products";

export default function PriceMarquee() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchJson("/products")
      .then((data) =>
        setProducts(unwrapList(data).map(normalizeProduct))
      )
      .catch(console.error);
  }, []);

  if (!products.length) return null;

  return (
    <div className="overflow-hidden border-b bg-white py-3">
      <div className="animate-marquee flex w-max gap-6 whitespace-nowrap">
        {[...products, ...products].map((p, i) => {
          const change = changeLabel(p.changePercent);

          return (
            <span key={`${p.id}-${i}`} className="text-sm">
              <b>{p.name}</b>{" "}
              {money(p.price)}/{p.unit}{" "}
              <b className={change.className}>
                {change.icon} {change.text}
              </b>
              <span className="ml-6 text-gray-300">|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}