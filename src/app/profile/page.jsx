"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট সফল হয়েছে");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="py-12 text-center">
        <div className="skeleton mx-auto h-24 w-24 rounded-full" />
        <div className="skeleton mx-auto mt-4 h-6 w-48" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-xl font-bold text-gray-800">
          প্রোফাইল দেখতে প্রথমে সাইন ইন করুন।
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card border border-gray-100 bg-white p-6 sm:p-8 shadow-sm text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-900">
          {session.user.name?.[0]?.toUpperCase() || "U"}
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {session.user.name}
        </h1>
        <p className="text-sm text-gray-500">{session.user.email}</p>

        <div className="mt-8 border-t pt-6">
          <button
            onClick={handleSignOut}
            className="btn w-full bg-rose-600 text-white hover:bg-rose-700"
          >
            সাইন আউট করুন
          </button>
        </div>
      </div>
    </div>
  );
}