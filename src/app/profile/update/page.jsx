"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  async function handleUpdate(event) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({ name: name.trim() });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return <p className="p-8 text-center">লোড হচ্ছে...</p>;
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center">
        <p>তথ্য আপডেট করতে আগে সাইন ইন করুন।</p>
        <button className="btn btn-primary mt-4" onClick={() => router.push("/signin")}>
          সাইন ইন
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="card border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">তথ্য আপডেট করুন</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="label font-semibold text-gray-700">
              আপনার নাম
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered w-full bg-white text-black"
              placeholder="আপনার নাম লিখুন"
              maxLength={100}
              required
            />
          </div>
          <button type="submit" disabled={saving} className="btn w-full bg-emerald-900 text-white hover:bg-emerald-800">
            {saving ? "আপডেট হচ্ছে..." : "Update Information"}
          </button>
        </form>
      </div>
    </div>
  );
}
