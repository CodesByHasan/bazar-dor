import Link from "next/link";

import {
  fetchJson,
  normalizeProduct,
  unwrapList,
} from "@/lib/products";

import SortedProducts from "@/components/SortedProducts";

async function getCategoryData(categoryId) {
  const rawProducts = await fetchJson("/products");
  const allProducts = unwrapList(rawProducts);

  const matchingRawProducts = allProducts.filter((product) => {
    const slug = String(
      product?.category ??
        product?.categorySlug ??
        product?.categoryId ??
        ""
    );

    return slug.toLowerCase() === String(categoryId).toLowerCase();
  });

  const categoryTitle =
    matchingRawProducts[0]?.categoryNameBn ||
    matchingRawProducts[0]?.categoryName ||
    categoryId;

  return {
    categoryTitle,
    products: matchingRawProducts.map(normalizeProduct),
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams?.categoryId;

  if (!categoryId) {
    return { title: "ক্যাটাগরি | BazarDor" };
  }

  try {
    const { categoryTitle } = await getCategoryData(categoryId);

    return {
      title: `${categoryTitle} - বাজার দর | BazarDor`,
    };
  } catch (error) {
    console.error("Could not load category metadata:", error);

    return {
      title: "ক্যাটাগরি | BazarDor",
    };
  }
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams?.categoryId;

  let products = [];
  let categoryTitle = categoryId || "ক্যাটাগরি";
  let loadError = false;

  if (categoryId) {
    try {
      const result = await getCategoryData(categoryId);

      categoryTitle = result.categoryTitle;
      products = result.products;
    } catch (error) {
      console.error("Could not load category products:", error);
      loadError = true;
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="btn btn-ghost btn-sm text-emerald-800"
        >
          ← হোম
        </Link>

        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
          ক্যাটাগরি:{" "}
          <span className="text-emerald-800">
            {categoryTitle}
          </span>
        </h1>
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-white p-12 text-center text-red-600 shadow-sm">
          পণ্যের তথ্য লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </div>
      ) : (
        <SortedProducts products={products} />
      )}
    </div>
  );
}