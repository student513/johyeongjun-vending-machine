"use client";

import { AppProvider } from "@/contexts";
import { VendingMachine } from "./VendingMachine";

export default function Home() {
  return (
    <AppProvider>
      <VendingMachine />
    </AppProvider>
  );
}
