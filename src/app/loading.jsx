export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      <div className="skeleton h-48 w-full rounded-3xl" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="rounded-2xl border border-gray-100 p-5 bg-white">
            <div className="skeleton h-14 w-14 rounded-2xl" />
            <div className="skeleton mt-5 h-4 w-2/3" />
            <div className="skeleton mt-4 h-6 w-1/2" />
          </div>
        ))}
      </div>
    </main>
  );
}