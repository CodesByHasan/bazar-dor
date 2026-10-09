import Link from "next/link";
import { notFound } from "next/navigation";
import {
  changeLabel,
  fetchJson,
  money,
  normalizeProduct,
  unwrapList,
} from "@/lib/products";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const raw = await fetchJson(`/products/${encodeURIComponent(id)}`);
    const p = normalizeProduct(raw);
    return {
      title: `${p.name} - আজকের বাজারদর | BazarDor`,
      description: p.description,
    };
  } catch {
    return { title: "পণ্য বিবরণী | BazarDor" };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product = null;

  try {
    const raw = await fetchJson(`/products/${encodeURIComponent(id)}`);
    product = normalizeProduct(raw);
  } catch (err) {
    console.error("Failed to load product by ID:", err);
    notFound();
  }

  const change = changeLabel(product.changePercent);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/" className="btn btn-ghost btn-sm mb-6 gap-2 text-emerald-800">
        ← হোমে ফিরে যান
      </Link>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-20 place-items-center rounded-3xl bg-lime-50 text-5xl">
                {product.emoji}
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-2xl font-black text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
              </div>
            </div>

            <div className={`rounded-2xl px-4 py-2 font-bold ${change.className}`}>
              {change.icon} {change.text}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3 sm:p-10 bg-slate-50/50">
          <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
            <p className="text-xs text-gray-500 font-medium">আজকের গড় দাম</p>
            <p className="mt-2 text-2xl font-black text-rose-600">
              {money(product.price)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
            <p className="text-xs text-gray-500 font-medium">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-xl font-bold text-emerald-700">
              {money(product.minPrice)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
            <p className="text-xs text-gray-500 font-medium">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-xl font-bold text-amber-700">
              {money(product.maxPrice)}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">পণ্যের বিবরণ</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {product.markets && product.markets.length > 0 && (
            <div className="mt-8">
              <h3 className="text-md font-bold text-gray-900 mb-3">
                বিভিন্ন বাজারের দর
              </h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th>বাজারের নাম</th>
                      <th>আজকের দর</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.markets.map((m, idx) => (
                      <tr key={idx}>
                        <td className="font-medium text-gray-800">
                          {m.name || m.bazarName || `বাজার #${idx + 1}`}
                        </td>
                        <td className="font-bold text-emerald-700">
                          {money(m.price || product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}