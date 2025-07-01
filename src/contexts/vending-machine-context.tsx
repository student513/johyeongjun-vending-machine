"use client";
import { useUserMoney } from "@/contexts/user-money-context";
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
  updateProductQuantity: (productNumber: number, quantity: number) => void;
  decreaseProductQuantity: (productNumber: number) => boolean;

  // 거스름돈 관련 함수들
  addChangeMoney: (value: CashUnit, count: number) => void;
  subtractChangeMoney: (value: CashUnit, count: number) => boolean;
  canProvideChange: (amount: number) => boolean;
  calculateOptimalChange: (
    amount: number
  ) => Partial<Record<CashUnit, number>> | null;

  // 투입된 금액 관련 함수들
  insertedMoney: Money;
  addInsertedMoney: (value: CashUnit, count: number) => void;
  getInsertedTotal: () => number;
  returnInsertedMoney: () => void;
  resetInsertedMoney: () => void;
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

  // 투입된 금액 상태
  const [insertedMoney, setInsertedMoney] = useState<Money>({
    tenThousand: { value: 10000, count: 0, total: 0 },
    fiveThousand: { value: 5000, count: 0, total: 0 },
    oneThousand: { value: 1000, count: 0, total: 0 },
    fiveHundred: { value: 500, count: 0, total: 0 },
    oneHundred: { value: 100, count: 0, total: 0 },
    total: 0,
  });

  // userMoney context 사용
  const { addCash } = useUserMoney();

  // 재고 조회
  const getInventory = () => {
    return vendingMachine.inventory;
  };

  // 상품 번호로 상품 조회 (내부용)
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

  // 투입된 금액 추가
  const addInsertedMoney = (value: CashUnit, count: number) => {
    setInsertedMoney((prev) => {
      const newInsertedMoney = { ...prev };
      const key = getMoneyKey(value);
      newInsertedMoney[key] = {
        ...newInsertedMoney[key],
        count: newInsertedMoney[key].count + count,
        total:
          newInsertedMoney[key].value * (newInsertedMoney[key].count + count),
      };
      newInsertedMoney.total = calculateTotal(newInsertedMoney);

      return newInsertedMoney;
    });
  };

  // 투입된 금액 총액 조회
  const getInsertedTotal = () => {
    return insertedMoney.total;
  };

  // 투입된 금액 초기화 및 환불
  const returnInsertedMoney = () => {
    // insertedMoney의 각 화폐 단위별로 addCash 호출
    (
      [
        { key: "tenThousand", value: 10000 },
        { key: "fiveThousand", value: 5000 },
        { key: "oneThousand", value: 1000 },
        { key: "fiveHundred", value: 500 },
        { key: "oneHundred", value: 100 },
      ] as const
    ).forEach((unit) => {
      const count = insertedMoney[unit.key].count;
      if (count > 0) {
        addCash(unit.value, count);
      }
    });

    setInsertedMoney({
      tenThousand: { value: 10000, count: 0, total: 0 },
      fiveThousand: { value: 5000, count: 0, total: 0 },
      oneThousand: { value: 1000, count: 0, total: 0 },
      fiveHundred: { value: 500, count: 0, total: 0 },
      oneHundred: { value: 100, count: 0, total: 0 },
      total: 0,
    });
  };

  const resetInsertedMoney = () => {
    setInsertedMoney({
      tenThousand: { value: 10000, count: 0, total: 0 },
      fiveThousand: { value: 5000, count: 0, total: 0 },
      oneThousand: { value: 1000, count: 0, total: 0 },
      fiveHundred: { value: 500, count: 0, total: 0 },
      oneHundred: { value: 100, count: 0, total: 0 },
      total: 0,
    });
  };

  return (
    <VendingMachineContext.Provider
      value={{
        vendingMachine,
        setVendingMachine,
        getInventory,
        updateProductQuantity,
        decreaseProductQuantity,
        addChangeMoney,
        subtractChangeMoney,
        canProvideChange,
        calculateOptimalChange,
        insertedMoney,
        addInsertedMoney,
        getInsertedTotal,
        returnInsertedMoney,
        resetInsertedMoney,
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
