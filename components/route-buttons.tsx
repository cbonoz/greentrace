"use client";

import { useRouter } from "next/navigation";

export const RouteButtons = () => {
  const router = useRouter();
  return (
    <div className="flex space-x-4">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push("/upload")}
      >
        Upload
      </button>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push("/scan")}
      >
        Scan
      </button>
    </div>
  );
};
