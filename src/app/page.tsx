"use client";

import { VendingProcessProvider } from "@/contexts/vending-process-context";
import { VendingMachine } from "./VendingMachine";

export default function Home() {
  return (
    <VendingProcessProvider>
      <VendingMachine />
    </VendingProcessProvider>
  );
}
