"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter your name");
      return;
    }
    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: trimmed });
      if (error) {
        toast.error(error.message || "Update failed");
        return;
      }
      toast.success("Information updated successfully!");
      router.push("/profile");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) return <p className="p-8 text-center">Loading...</p>;

  if (!session?.user) {
    return (
      <div className="p-8 text-center">
        <p>Please sign in to update your profile.</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => router.push("/signin")}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Update Information</h1>
          <form onSubmit={handleUpdate} className="mt-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
            <button
              type="submit"
              className="btn btn-primary mt-6 w-full"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Information"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}