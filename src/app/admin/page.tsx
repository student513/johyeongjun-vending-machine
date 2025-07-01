"use client";
import { useRouter } from "next/navigation";
import InventoryEditor from "../components/inventory-editor";
import WalletEditor from "../components/wallet-editor";

export default function AdminPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <h1 className="text-3xl font-bold">관리자 페이지</h1>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        돌아가기
      </button>

      <div className="w-full max-w-7xl space-y-8">
        <InventoryEditor />
        <WalletEditor />
      </div>
    </div>
  );
}
