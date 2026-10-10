import Link from "next/link";
import { notFound } from "next/navigation";

import {
  changeLabel,
  fetchJson,
  money,
  normalizeProduct,
} from "@/lib/products";

const getProduct = async (id) => {
  try {
    const raw = await fetchJson(`/products/${encodeURIComponent(id)}`);
    return normalizeProduct(raw);
  } catch (error) {
    console.error("Failed to load product by ID:", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return { title: "পণ্য বিবরণী | BazarDor" };
  }

  return {
    title: `${product.name} - আজকের বাজারদর | BazarDor`,
    description: product.description,
  };
}

const ProductDetailPage = async ({ params }) => {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const change = changeLabel(product.changePercent);
  const markets = product.markets || [];

  // Average of every market's (min + max) / 2
  const averagePrice = markets.length
    ? Math.round(
        markets.reduce(
          (total, m) => total + (Number(m.min) + Number(m.max)) / 2,
          0
        ) / markets.length
      )
    : product.price;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="btn btn-ghost btn-sm mb-6 gap-2 text-emerald-800"
      >
        ← হোমে ফিরে যান
      </Link>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

        {/* Summary */}
        <div className="border-b border-gray-100 p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-20 place-items-center rounded-3xl bg-lime-50 text-5xl">
                {product.emoji}
              </span>

              <div>
                <span className="badge badge-outline border-emerald-700 text-emerald-700">
                  {product.category}
                </span>

                <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {product.unit}
                </p>
              </div>
            </div>

            <div
              className={`rounded-2xl px-4 py-2 font-bold ${change.className}`}
            >
              {change.icon} {change.text}
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-gray-600">
            {product.description}
          </p>
        </div>

        {/* Price Summary */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-6 sm:grid-cols-4 sm:p-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">
              আজকের দাম
            </p>
            <p className="mt-2 text-lg font-black text-rose-600">
              {money(product.price)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">
              সর্বনিম্ন দাম
            </p>
            <p className="mt-2 text-lg font-bold text-emerald-700">
              {money(product.minPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">
              সর্বোচ্চ দাম
            </p>
            <p className="mt-2 text-lg font-bold text-amber-700">
              {money(product.maxPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">
              গড় দাম
            </p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {money(averagePrice)}
            </p>
          </div>
        </div>

        {/* Market Prices */}
        {markets.length > 0 && (
          <div className="border-t border-gray-100 p-6 sm:p-10">
            <h2 className="mb-3 text-lg font-bold text-gray-900">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th>সর্বনিম্ন</th>
                    <th>সর্বোচ্চ</th>
                    <th>গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((m, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap font-medium text-gray-800">
                        {m.market || `বাজার #${index + 1}`}
                      </td>

                      <td className="whitespace-nowrap text-gray-600">
                        {m.division}
                      </td>

                      <td className="whitespace-nowrap text-emerald-700">
                        {money(m.min)}
                      </td>

                      <td className="whitespace-nowrap text-amber-700">
                        {money(m.max)}
                      </td>

                      <td className="whitespace-nowrap font-bold text-gray-900">
                        {money((Number(m.min) + Number(m.max)) / 2)}
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
  );
};

export default ProductDetailPage;