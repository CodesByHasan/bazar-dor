import Link from "next/link";
import {
  changeLabel,
  money,
  normalizeProduct,
} from "@/lib/products";

export default function ProductCard({ product }) {
  const p = normalizeProduct(product);
  const change = changeLabel(p.changePercent);

  return (
    <Link
      href={`/product/${encodeURIComponent(p.id)}`}
      className="group card border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <div className="card-body p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-14 place-items-center rounded-2xl bg-lime-50 text-3xl">
            {p.emoji}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${change.className}`}
          >
            {change.icon} {change.text}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold text-emerald-700">
          {p.category}
        </p>

        <h3 className="card-title text-lg text-gray-900 group-hover:text-emerald-800">
          {p.name}
        </h3>

        <p className="text-sm text-gray-500">{p.unit}</p>

        <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-lg font-black text-rose-600">
              {money(p.price)}
            </p>
          </div>

          <span className="text-xs font-semibold text-emerald-800">
            বিস্তারিত ↗
          </span>
        </div>
      </div>
    </Link>
  );
}