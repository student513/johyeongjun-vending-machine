"use client";
import {
  CashUnit,
  InventoryItem,
  Money,
  VendingMachine,
} from "@/types/vending-machine";
import React, { createContext, useContext, useState } from "react";

// 초기 자판기 상태
const initialVendingMachine: VendingMachine = {
  inventory: [
    { name: "커피", quantity: 10, price: 700, number: 11 },
    { name: "콜라", quantity: 15, price: 1100, number: 12 },
    { name: "생수", quantity: 20, price: 600, number: 13 },
  ],
  changeMoney: {
    tenThousand: { value: 10000, count: 5, total: 50000 },
    fiveThousand: { value: 5000, count: 10, total: 50000 },
    oneThousand: { value: 1000, count: 20, total: 20000 },
    fiveHundred: { value: 500, count: 30, total: 15000 },
    oneHundred: { value: 100, count: 50, total: 5000 },
    total: 140000,
  },
};

interface VendingMachineContextType {
  vendingMachine: VendingMachine;
  setVendingMachine: React.Dispatch<React.SetStateAction<VendingMachine>>;

  // 재고 관련 함수들
  getInventory: () => InventoryItem[];
  getProductByNumber: (number: number) => InventoryItem | undefined;
  updateProductQuantity: (productNumber: number, quantity: number) => void;
  decreaseProductQuantity: (productNumber: number) => boolean;
  increaseProductQuantity: (productNumber: number, amount: number) => void;
  isProductAvailable: (productNumber: number) => boolean;

  // 거스름돈 관련 함수들
  getChangeMoney: () => Money;
  addChangeMoney: (value: CashUnit, count: number) => void;
  subtractChangeMoney: (value: CashUnit, count: number) => boolean;
  getChangeTotal: () => number;
  canProvideChange: (amount: number) => boolean;
  calculateOptimalChange: (
    amount: number
  ) => Partial<Record<CashUnit, number>> | null;

  // 자판기 상태 조회
  getMachineStatus: () => {
    totalProducts: number;
    changeAvailable: number;
  };

  // 초기화
  resetVendingMachine: () => void;
  refillInventory: () => void;
  refillChangeMoney: () => void;
}

const VendingMachineContext = createContext<
  VendingMachineContextType | undefined
>(undefined);

export const VendingMachineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [vendingMachine, setVendingMachine] = useState<VendingMachine>(
    initialVendingMachine
  );

  // 재고 조회
  const getInventory = () => {
    return vendingMachine.inventory;
  };

  // 상품 번호로 상품 조회
  const getProductByNumber = (number: number) => {
    return vendingMachine.inventory.find(
      (product) => product.number === number
    );
  };

  // 상품 수량 업데이트
  const updateProductQuantity = (productNumber: number, quantity: number) => {
    setVendingMachine((prev) => ({
      ...prev,
      inventory: prev.inventory.map((product) =>
        product.number === productNumber
          ? { ...product, quantity: Math.max(0, quantity) }
          : product
      ),
    }));
  };

  // 상품 수량 감소 (구매 시)
  const decreaseProductQuantity = (productNumber: number): boolean => {
    const product = getProductByNumber(productNumber);
    if (!product || product.quantity <= 0) {
      return false;
    }

    setVendingMachine((prev) => ({
      ...prev,
      inventory: prev.inventory.map((product) =>
        product.number === productNumber
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ),
    }));
    return true;
  };

  // 상품 수량 증가 (보충 시)
  const increaseProductQuantity = (productNumber: number, amount: number) => {
    setVendingMachine((prev) => ({
      ...prev,
      inventory: prev.inventory.map((product) =>
        product.number === productNumber
          ? { ...product, quantity: product.quantity + amount }
          : product
      ),
    }));
  };

  // 상품 구매 가능 여부 확인
  const isProductAvailable = (productNumber: number): boolean => {
    const product = getProductByNumber(productNumber);
    return product ? product.quantity > 0 : false;
  };

  // 거스름돈 조회
  const getChangeMoney = () => {
    return vendingMachine.changeMoney;
  };

  // 거스름돈 추가
  const addChangeMoney = (value: CashUnit, count: number) => {
    setVendingMachine((prev) => {
      const newChangeMoney = { ...prev.changeMoney };
      const key = getMoneyKey(value);
      newChangeMoney[key] = {
        ...newChangeMoney[key],
        count: newChangeMoney[key].count + count,
        total: newChangeMoney[key].value * (newChangeMoney[key].count + count),
      };
      newChangeMoney.total = calculateTotal(newChangeMoney);

      return {
        ...prev,
        changeMoney: newChangeMoney,
      };
    });
  };

  // 거스름돈 차감
  const subtractChangeMoney = (value: CashUnit, count: number): boolean => {
    const currentMoney = vendingMachine.changeMoney;
    const key = getMoneyKey(value);

    if (currentMoney[key].count < count) {
      return false; // 보유량 부족
    }

    setVendingMachine((prev) => {
      const newChangeMoney = { ...prev.changeMoney };
      const newCount = Math.max(0, newChangeMoney[key].count - count);
      newChangeMoney[key] = {
        ...newChangeMoney[key],
        count: newCount,
        total: newChangeMoney[key].value * newCount,
      };
      newChangeMoney.total = calculateTotal(newChangeMoney);

      return {
        ...prev,
        changeMoney: newChangeMoney,
      };
    });
    return true;
  };

  // 거스름돈 총액 조회
  const getChangeTotal = () => {
    return vendingMachine.changeMoney.total;
  };

  // 거스름돈 제공 가능 여부 확인
  const canProvideChange = (amount: number): boolean => {
    if (amount > vendingMachine.changeMoney.total) {
      return false;
    }

    const change = calculateOptimalChange(amount);
    return change !== null;
  };

  // 최적 거스름돈 계산
  const calculateOptimalChange = (
    amount: number
  ): Partial<Record<CashUnit, number>> | null => {
    const changeUnits: CashUnit[] = [10000, 5000, 1000, 500, 100];
    const result: Partial<Record<CashUnit, number>> = {};
    let remainingAmount = amount;

    for (const unit of changeUnits) {
      const key = getMoneyKey(unit);
      const availableCount = vendingMachine.changeMoney[key].count;
      const neededCount = Math.floor(remainingAmount / unit);
      const useCount = Math.min(availableCount, neededCount);

      if (useCount > 0) {
        result[unit] = useCount;
        remainingAmount -= unit * useCount;
      }
    }

    return remainingAmount === 0 ? result : null;
  };

  // 자판기 상태 조회
  const getMachineStatus = () => {
    const totalProducts = vendingMachine.inventory.reduce(
      (sum, product) => sum + product.quantity,
      0
    );
    const changeAvailable = getChangeTotal();

    return {
      totalProducts,
      changeAvailable,
    };
  };

  // 자판기 초기화
  const resetVendingMachine = () => {
    setVendingMachine(initialVendingMachine);
  };

  // 재고 보충
  const refillInventory = () => {
    setVendingMachine((prev) => ({
      ...prev,
      inventory: prev.inventory.map((product) => ({
        ...product,
        quantity:
          product.name === "커피" ? 10 : product.name === "콜라" ? 15 : 20,
      })),
    }));
  };

  // 거스름돈 보충
  const refillChangeMoney = () => {
    setVendingMachine((prev) => ({
      ...prev,
      changeMoney: {
        tenThousand: { value: 10000, count: 5, total: 50000 },
        fiveThousand: { value: 5000, count: 10, total: 50000 },
        oneThousand: { value: 1000, count: 20, total: 20000 },
        fiveHundred: { value: 500, count: 30, total: 15000 },
        oneHundred: { value: 100, count: 50, total: 5000 },
        total: 140000,
      },
    }));
  };

  // 화폐 키 반환 함수
  const getMoneyKey = (value: number): keyof Omit<Money, "total"> => {
    switch (value) {
      case 10000:
        return "tenThousand";
      case 5000:
        return "fiveThousand";
      case 1000:
        return "oneThousand";
      case 500:
        return "fiveHundred";
      case 100:
        return "oneHundred";
      default:
        throw new Error(`Invalid currency value: ${value}`);
    }
  };

  // 총액 계산 함수
  const calculateTotal = (money: Omit<Money, "total">): number => {
    return Object.values(money).reduce((sum, unit) => {
      if (typeof unit === "object" && "total" in unit) {
        return sum + unit.total;
      }
      return sum;
    }, 0);
  };

  return (
    <VendingMachineContext.Provider
      value={{
        vendingMachine,
        setVendingMachine,
        getInventory,
        getProductByNumber,
        updateProductQuantity,
        decreaseProductQuantity,
        increaseProductQuantity,
        isProductAvailable,
        getChangeMoney,
        addChangeMoney,
        subtractChangeMoney,
        getChangeTotal,
        canProvideChange,
        calculateOptimalChange,
        getMachineStatus,
        resetVendingMachine,
        refillInventory,
        refillChangeMoney,
      }}
    >
      {children}
    </VendingMachineContext.Provider>
  );
};

export function useVendingMachine() {
  const context = useContext(VendingMachineContext);
  if (!context) {
    throw new Error(
      "useVendingMachine must be used within a VendingMachineProvider"
    );
  }
  return context;
}
