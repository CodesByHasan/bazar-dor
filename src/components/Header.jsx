"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { fetchJson, unwrapList } from "@/lib/products";
import { changeLabel, money, normalizeProduct } from "@/lib/products";
export default function Header() {
  const pathname = usePathname(); const router = useRouter();
  const { data: session } = authClient.useSession();
  const [categories, setCategories] = useState([]); const [products, setProducts] = useState([]);
  useEffect(() => { let active = true; Promise.all([fetchJson("/categories"), fetchJson("/products")]).then(([c,p]) => { if (!active) return; setCategories(unwrapList(c).map(x => ({...x, slug: String(x.slug ?? x.id ?? x._id ?? x.name), name: String(x.name ?? x.title ?? x.categoryName ?? "বিভাগ")}))); setProducts(unwrapList(p)); }).catch(() => {}); return () => { active = false; }; }, []);
  async function signOut() { const { error } = await authClient.signOut(); if (error) toast.error(error.message || "সাইন আউট করা যায়নি"); else { toast.success("সাইন আউট সফল হয়েছে"); router.push("/"); router.refresh(); } }
  const date = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return <header className="bg-white shadow-sm">
    <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-4">
      <Link href="/" className="flex items-center gap-3 no-underline"><span className="grid size-12 place-items-center rounded-2xl bg-lime-200 text-2xl">🛒</span><span><span className="block text-2xl font-black tracking-tight text-emerald-950">বাজার দর</span><span className="block text-xs text-gray-500">{date}</span></span></Link>
      <div className="flex items-center gap-2">{session?.user ? <><Link className="btn btn-sm btn-outline border-emerald-800 text-emerald-900" href="/profile">প্রোফাইল</Link><button className="btn btn-sm bg-emerald-900 text-white" onClick={signOut}>সাইন আউট</button></> : <><Link className="btn btn-sm btn-ghost" href="/signin">সাইন ইন</Link><Link className="btn btn-sm bg-emerald-900 text-white" href="/signup">সাইন আপ</Link></>}</div>
    </div>
    <nav className="container-shell flex flex-wrap items-center justify-center gap-2 pb-4" aria-label="পণ্যের বিভাগ">
      <Link className={`rounded-full px-4 py-2 text-sm font-semibold ${pathname === "/" ? "bg-lime-200 text-emerald-950" : "hover:bg-gray-100"}`} href="/">সব পণ্য</Link>
      {categories.map(c => <Link key={c.slug} href={`/category/${encodeURIComponent(c.slug)}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${pathname === `/category/${c.slug}` ? "bg-lime-200 text-emerald-950" : "hover:bg-gray-100"}`}>{c.name}</Link>)}
    </nav>
    <div className="price-ticker border-y border-emerald-100 bg-emerald-950 py-2 text-white" aria-label="আজকের বাজারদর"><div className="ticker-track">{(products.length ? [...products.map(normalizeProduct), ...products.map(normalizeProduct)] : [{id:"demo",name:"বাজারদর",emoji:"🛒",price:0,changePercent:0}]).map((p,i)=>{const c=changeLabel(p.changePercent);return <span key={`${p.id}-${i}`} className="mx-5 inline-flex items-center gap-2 text-sm"><span>{p.emoji}</span><b>{p.name}</b><span>{money(p.price)}</span><span className={`${c.className} rounded px-1.5 py-0.5 font-bold`}>{c.icon} {c.text}</span><span className="text-emerald-300">•</span></span>})}</div></div>
  </header>;
}