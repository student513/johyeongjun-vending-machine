"use client";
import React from "react";
import { UserMoneyProvider } from "./user-money-context";
import { VendingMachineProvider } from "./vending-machine-context";
import { VendingProcessProvider } from "./vending-process-context";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <VendingProcessProvider>
      <UserMoneyProvider>
        <VendingMachineProvider>{children}</VendingMachineProvider>
      </UserMoneyProvider>
    </VendingProcessProvider>
  );
};
