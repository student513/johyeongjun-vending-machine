"use client";
import { VendingProcessState, VendingStep } from "@/types/vending-machine";
import React, { createContext, useContext, useState } from "react";

const initialState: VendingProcessState = {
  step: VendingStep.SELECT_PRODUCT,
  selectProduct: {},
  selectPayment: {},
  insertPayment: {},
  getProduct: {},
};

interface VendingProcessContextType {
  vendingProcess: VendingProcessState;
  setVendingProcess: React.Dispatch<React.SetStateAction<VendingProcessState>>;
}

const VendingProcessContext = createContext<
  VendingProcessContextType | undefined
>(undefined);

export const VendingProcessProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [vendingProcess, setVendingProcess] =
    useState<VendingProcessState>(initialState);

  return (
    <VendingProcessContext.Provider
      value={{ vendingProcess, setVendingProcess }}
    >
      {children}
    </VendingProcessContext.Provider>
  );
};

export function useVendingProcess() {
  const context = useContext(VendingProcessContext);
  if (!context) {
    throw new Error(
      "useVendingProcess must be used within a VendingProcessProvider"
    );
  }
  return context;
}
