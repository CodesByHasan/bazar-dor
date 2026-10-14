
import Link from "next/link";
import { money } from "@/lib/products";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="card border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{product.emoji}</span>
          <span className="badge badge-success">
            {product.changePercent > 0
              ? `↑ ${product.changePercent}%`
              : product.changePercent < 0
              ? `↓ ${Math.abs(product.changePercent)}%`
              : "No change"}
          </span>
        </div>

        <p className="mt-3 text-sm text-emerald-700">
          {product.category}
        </p>

        <h3 className="card-title text-lg">{product.name}</h3>

        <p className="text-sm text-gray-500">{product.unit}</p>

        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-lg font-bold text-rose-600">
            {money(product.price)}
          </p>
        </div>

        <p className="text-sm text-emerald-800">বিস্তারিত ↗</p>
      </div>
    </Link>
  );
}
