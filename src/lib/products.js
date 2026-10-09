export const BASE_URL =
  "https://api.abcz.workers.dev/api/bazardor";

export function pick(obj, keys, fallback = "") {
  for (const key of keys) {
    const value = obj?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
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
  if (/দুধ|দই|milk|yogurt/.test(n)) return "🥛";
  if (/আদা|ginger/.test(n)) return "🫚";
  if (/রসুন|garlic/.test(n)) return "🧄";
  if (/টমেটো|tomato/.test(n)) return "🍅";
  if (/বেগুন|eggplant/.test(n)) return "🍆";
  if (/লেবু|lemon/.test(n)) return "🍋";

  return "🛒";
}

function normalizeUnit(unit) {
  const units = {
    kg: "কেজি",
    kilogram: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  const value = String(unit || "kg");
  return units[value.toLowerCase()] || value;
}

export function normalizeProduct(raw = {}) {
  // Support APIs that wrap a product inside { data: {...} }.
  const product =
    raw?.data && !Array.isArray(raw.data) && typeof raw.data === "object"
      ? raw.data
      : raw;

  const id = String(
    pick(product, ["id", "_id", "productId", "slug"], "")
  );

  const slug = String(pick(product, ["slug"], id));

  const name = String(
    pick(
      product,
      ["nameBn", "name", "title", "productName"],
      "নাম পাওয়া যায়নি"
    )
  );

  const categorySlug = String(
    pick(
      product,
      ["category", "categorySlug", "categoryId"],
      ""
    )
  );

  const categoryName = String(
    pick(
      product,
      ["categoryNameBn", "categoryName", "categoryTitle"],
      categorySlug || "অন্যান্য"
    )
  );

  // Actual API field: today
  const price = Number(
    pick(
      product,
      ["today", "price", "currentPrice", "todayPrice", "averagePrice", "avgPrice"],
      0
    )
  ) || 0;

  const markets = Array.isArray(product.markets)
    ? product.markets
    : Array.isArray(product.bazars)
      ? product.bazars
      : [];

  // API stores min/max prices inside each market.
  const marketMins = markets
    .map((market) => Number(market.min))
    .filter(Number.isFinite);

  const marketMaxes = markets
    .map((market) => Number(market.max))
    .filter(Number.isFinite);

  const minPrice = Number(
    pick(product, ["minPrice", "minimumPrice", "priceMin"], "")
  );

  const maxPrice = Number(
    pick(product, ["maxPrice", "maximumPrice", "priceMax"], "")
  );

  // Actual API shape: change: { dir: "up", pct: 2.1 }
  const rawChange = product.change;

  const changePercent = Number(
    typeof rawChange === "object" && rawChange !== null
      ? pick(
          rawChange,
          ["pct", "percentage", "percent"],
          pick(
            product,
            ["changePercent", "percentageChange", "priceChange"],
            0
          )
        )
      : pick(
          product,
          ["changePercent", "change", "percentageChange", "priceChange"],
          0
        )
  ) || 0;

  const changeDirection =
    typeof rawChange === "object" && rawChange !== null
      ? String(pick(rawChange, ["dir", "direction"], ""))
      : changePercent > 0
        ? "up"
        : changePercent < 0
          ? "down"
          : "flat";

  const image = String(
    pick(
      product,
      ["image", "emoji", "icon", "imageEmoji"],
      emojiFor(name)
    )
  );

  return {
    ...product,

    id,
    slug,
    name,
    nameBn: name,

    category: categoryName,
    categoryName,
    categoryNameBn: categoryName,
    categoryId: categorySlug,
    categorySlug,

    unit: normalizeUnit(product.unit),

    // API provides an emoji in its image field.
    image,
    emoji: image,

    price,
    today: price,

    yesterday: Number(product.yesterday) || 0,
    lastWeek: Number(product.lastWeek) || 0,
    lastMonth: Number(product.lastMonth) || 0,

    minPrice:
      Number.isFinite(minPrice) && minPrice > 0
        ? minPrice
        : marketMins.length
          ? Math.min(...marketMins)
          : price,

    maxPrice:
      Number.isFinite(maxPrice) && maxPrice > 0
        ? maxPrice
        : marketMaxes.length
          ? Math.max(...marketMaxes)
          : price,

    averagePrice:
      Number(product.averagePrice ?? product.avgPrice) || price,

    changePercent,
    changeDirection,

    change: {
      ...(typeof rawChange === "object" && rawChange !== null
        ? rawChange
        : {}),
      dir: changeDirection,
      pct: changePercent,
    },

    description: String(
      pick(
        product,
        ["description", "summary", "details"],
        `${name} এর আজকের বাজারদর ও বিভিন্ন বাজারের মূল্যতথ্য।`
      )
    ),

    markets,
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
  const normalizedPath = String(path).startsWith("/")
    ? path
    : `/${path}`;

  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed (${response.status}): ${normalizedPath}`
    );
  }

  return response.json();
}

export function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;

  if (!payload || typeof payload !== "object") return [];

  for (const key of [
    "products",
    "categories",
    "results",
    "items",
    "data",
  ]) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }

    if (
      payload[key] &&
      typeof payload[key] === "object"
    ) {
      for (const nestedKey of [
        "products",
        "categories",
        "results",
        "items",
      ]) {
        if (Array.isArray(payload[key][nestedKey])) {
          return payload[key][nestedKey];
        }
      }
    }
  }

  // A single product/category object isn't a list.
  return [];
}