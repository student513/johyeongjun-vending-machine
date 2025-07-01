"use client";
import { useUserMoney } from "@/contexts/user-money-context";
import { CASH_UNITS, PRODUCTS, VENDING_MACHINE_CONFIG } from "@/lib/constants";
import {
  CashUnit,
  InventoryItem,
  Money,
  VendingMachine,
  calculateTotal,
  getMoneyKey,
} from "@/types/vending-machine";
import React, { createContext, useContext, useState } from "react";

// 초기 자판기 상태
const initialVendingMachine: VendingMachine = {
  inventory: [
    {
      name: PRODUCTS.coffee.name,
      quantity: VENDING_MACHINE_CONFIG.INITIAL_INVENTORY.coffee,
      price: PRODUCTS.coffee.price,
      number: PRODUCTS.coffee.number,
    },
    {
      name: PRODUCTS.coke.name,
      quantity: VENDING_MACHINE_CONFIG.INITIAL_INVENTORY.coke,
      price: PRODUCTS.coke.price,
      number: PRODUCTS.coke.number,
    },
    {
      name: PRODUCTS.water.name,
      quantity: VENDING_MACHINE_CONFIG.INITIAL_INVENTORY.water,
      price: PRODUCTS.water.price,
      number: PRODUCTS.water.number,
    },
  ],
  changeMoney: {
    tenThousand: {
      value: CASH_UNITS[0].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_CHANGE.tenThousand,
      total:
        CASH_UNITS[0].value * VENDING_MACHINE_CONFIG.INITIAL_CHANGE.tenThousand,
    },
    fiveThousand: {
      value: CASH_UNITS[1].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_CHANGE.fiveThousand,
      total:
        CASH_UNITS[1].value *
        VENDING_MACHINE_CONFIG.INITIAL_CHANGE.fiveThousand,
    },
    oneThousand: {
      value: CASH_UNITS[2].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_CHANGE.oneThousand,
      total:
        CASH_UNITS[2].value * VENDING_MACHINE_CONFIG.INITIAL_CHANGE.oneThousand,
    },
    fiveHundred: {
      value: CASH_UNITS[3].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_CHANGE.fiveHundred,
      total:
        CASH_UNITS[3].value * VENDING_MACHINE_CONFIG.INITIAL_CHANGE.fiveHundred,
    },
    oneHundred: {
      value: CASH_UNITS[4].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_CHANGE.oneHundred,
      total:
        CASH_UNITS[4].value * VENDING_MACHINE_CONFIG.INITIAL_CHANGE.oneHundred,
    },
    total: CASH_UNITS.reduce((sum, unit) => {
      const count =
        VENDING_MACHINE_CONFIG.INITIAL_CHANGE[
          unit.key as keyof typeof VENDING_MACHINE_CONFIG.INITIAL_CHANGE
        ];
      return sum + unit.value * count;
    }, 0),
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
    const changeUnits: CashUnit[] = [
      CASH_UNITS[0].value,
      CASH_UNITS[1].value,
      CASH_UNITS[2].value,
      CASH_UNITS[3].value,
      CASH_UNITS[4].value,
    ];
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
    CASH_UNITS.forEach((unit) => {
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
