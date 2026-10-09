import Link from "next/link";
import { fetchJson, normalizeProduct, unwrapList } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  const { categoryId } = await params;

  try {
    const res = await fetchJson(
      `/categories/${encodeURIComponent(categoryId)}`
    );

    const category = unwrapList(res)[0] || res?.data || res;

    return {
      title: `${category?.name || category?.title || categoryId} - বাজার দর | BazarDor`,
    };
  } catch {
    return {
      title: "ক্যাটাগরি | BazarDor",
    };
  }
}

const CategoryPage = async ({ params }) => {
  const { categoryId } = await params;

  let categoryTitle = categoryId;
  let products = [];

  // Fetch category information
  try {
    const res = await fetchJson(
      `/categories/${encodeURIComponent(categoryId)}`
    );

    const category = unwrapList(res)[0] || res?.data || res;

    categoryTitle =
      category?.name ||
      category?.title ||
      category?.categoryName ||
      categoryId;
  } catch (error) {
    console.error("Category fetch error:", error);
  }

  // Fetch category products
  try {
    const res = await fetchJson(
      `/products?category=${encodeURIComponent(categoryId)}`
    );

    products = unwrapList(res).map(normalizeProduct);
  } catch (error) {
    console.error("Products fetch error:", error);
  }

  // If the category endpoint returns no products, filter all products
  if (products.length === 0) {
    try {
      const res = await fetchJson("/products");
      const allProducts = unwrapList(res).map(normalizeProduct);

      products = allProducts.filter((product) => {
        return (
          String(product.categoryId).toLowerCase() ===
            String(categoryId).toLowerCase() ||
          String(product.category).toLowerCase() ===
            String(categoryId).toLowerCase() ||
          String(product.categorySlug || "").toLowerCase() ===
            String(categoryId).toLowerCase()
        );
      });
    } catch (error) {
      console.error("All products fetch error:", error);
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="btn btn-ghost btn-sm text-emerald-800"
        >
          ← হোম
        </Link>

        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
          ক্যাটাগরি:{" "}
          <span className="text-emerald-800">{categoryTitle}</span>
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
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
};

export default CategoryPage;