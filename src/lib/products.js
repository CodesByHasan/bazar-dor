export const BASE_URL =
  "https://api.abcz.workers.dev/api/bazardor";

export function pick(obj, keys, fallback = "") {
  for (const key of keys) {
    if (
      obj?.[key] !== undefined &&
      obj?.[key] !== null &&
      obj[key] !== ""
    ) {
      return obj[key];
    }
  }

  return fallback;
}

export function emojiFor(name = "") {
  const n = String(name).toLowerCase();

  if (/চাল|rice/.test(n)) return "🍚";
  if (/ডাল|মসুর|মুগ|bean|lentil/.test(n)) return "🫘";
  if (/তেল|oil/.test(n)) return "🫙";
  if (/আলু|potato/.test(n)) return "🥔";
  if (/পেঁয়াজ|পিঁয়াজ|onion/.test(n)) return "🧅";
  if (/মরিচ|chili|pepper/.test(n)) return "🌶️";
  if (/মাছ|fish|ইলিশ/.test(n)) return "🐟";
  if (/মুরগি|মাংস|chicken|meat/.test(n)) return "🍗";
  if (/ডিম|egg/.test(n)) return "🥚";
  if (/আদা|ginger/.test(n)) return "🫚";
  if (/রসুন|garlic/.test(n)) return "🧄";
  if (/টমেটো|tomato/.test(n)) return "🍅";
  if (/বেগুন|eggplant/.test(n)) return "🍆";
  if (/লেবু|lemon/.test(n)) return "🍋";

  return "🛒";
}

export function normalizeProduct(raw = {}) {
  const id = String(
    pick(raw, ["id", "_id", "productId", "slug"], "")
  );

  const name = String(
    pick(
      raw,
      ["name", "title", "productName", "nameBn"],
      "নাম পাওয়া যায়নি"
    )
  );

  const price =
    Number(
      pick(
        raw,
        ["price", "currentPrice", "todayPrice", "averagePrice", "avgPrice"],
        0
      )
    ) || 0;

  const change =
    Number(
      pick(
        raw,
        ["changePercent", "change", "percentageChange", "priceChange"],
        0
      )
    ) || 0;

  const category = pick(
    raw,
    ["category", "categoryName", "categorySlug"],
    "অন্যান্য"
  );

  const categoryId = pick(
    raw,
    ["categoryId", "categorySlug", "category", "categoryName"],
    ""
  );

  return {
    ...raw,
    id,
    name,
    category:
      typeof category === "object"
        ? category?.name || category?.title || "অন্যান্য"
        : String(category),
    categoryId:
      typeof categoryId === "object"
        ? String(
            categoryId?.id ??
              categoryId?._id ??
              categoryId?.slug ??
              categoryId?.name ??
              ""
          )
        : String(categoryId),
    unit: String(
      pick(raw, ["unit", "unitName", "measurement"], "প্রতি কেজি")
    ),
    emoji: String(
      pick(raw, ["emoji", "icon", "imageEmoji"], emojiFor(name))
    ),
    price,
    minPrice:
      Number(pick(raw, ["minPrice", "minimumPrice", "priceMin"], price)) ||
      price,
    maxPrice:
      Number(pick(raw, ["maxPrice", "maximumPrice", "priceMax"], price)) ||
      price,
    averagePrice:
      Number(pick(raw, ["averagePrice", "avgPrice", "price"], price)) ||
      price,
    changePercent: change,
    description: String(
      pick(
        raw,
        ["description", "summary", "details"],
        "আজকের বাজারদরের সংক্ষিপ্ত তথ্য।"
      )
    ),
    markets: Array.isArray(raw.markets)
      ? raw.markets
      : Array.isArray(raw.bazars)
        ? raw.bazars
        : [],
  };
}

export function toBengaliDigits(value) {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

export function money(value) {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

  return `${toBengaliDigits(formatted)} টাকা`;
}

export function changeLabel(value) {
  const n = Number(value) || 0;

  if (n > 0) {
    return {
      icon: "▲",
      text: `${toBengaliDigits(Math.abs(n).toFixed(1))}%`,
      className: "text-emerald-700 bg-emerald-50",
    };
  }

  if (n < 0) {
    return {
      icon: "▼",
      text: `${toBengaliDigits(Math.abs(n).toFixed(1))}%`,
      className: "text-rose-700 bg-rose-50",
    };
  }

  return {
    icon: "—",
    text: "০.০%",
    className: "text-gray-600 bg-gray-100",
  };
}

export async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export function unwrapList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}