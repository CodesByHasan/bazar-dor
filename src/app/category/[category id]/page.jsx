import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchJson, normalizeProduct, unwrapList } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function CategoryPage({ params }) {
  const { categoryId } = await params;
  let products = [];
  let categoryTitle = decodeURIComponent(categoryId);

  try {
    const rawData = await fetchJson(`/products?category=${encodeURIComponent(categoryId)}`);
    products = unwrapList(rawData).map(normalizeProduct);

    if (products.length === 0) {
      const allRaw = await fetchJson("/products");
      const allProducts = unwrapList(allRaw).map(normalizeProduct);
      products = allProducts.filter(
        (p) =>
          p.categoryId.toLowerCase() === categoryId.toLowerCase() ||
          p.category.toLowerCase() === categoryTitle.toLowerCase()
      );
    }

    if (products.length > 0) {
      categoryTitle = products[0].category;
    }
  } catch (err) {
    console.error("Failed to fetch category data:", err);
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="btn btn-ghost btn-sm text-emerald-800">
          ← হোম
        </Link>
        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
          ক্যাটাগরি: <span className="text-emerald-800">{categoryTitle}</span>
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-gray-500">
          এই ক্যাটাগরিতে কোন পণ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}