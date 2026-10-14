
"use client";

import { useEffect, useState } from "react";
import { fetchJson, money } from "@/lib/products";

export default function PriceMarquee() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchJson("/products")
      .then((data) => {
        setProducts(data.products || data.data || data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="overflow-hidden border-b bg-white py-3">
      <div className="animate-marquee flex w-max gap-6 whitespace-nowrap">
        {products.map((product) => (
          <span key={product.id} className="text-sm">
            <b>{product.name}</b>{" "}
            {money(product.price)}/{product.unit}
            <span className="ml-6 text-gray-300">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
