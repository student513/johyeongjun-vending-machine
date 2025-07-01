"use client";
import { useRouter } from "next/navigation";
import InventoryEditor from "../components/inventory-editor";

export default function AdminPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">관리자 페이지</h1>
      <button onClick={() => router.back()}>돌아가기</button>
      <InventoryEditor />
    </div>
  );
}
