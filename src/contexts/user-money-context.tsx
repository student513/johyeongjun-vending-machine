"use client";
import { CashUnit, Money, UserMoney } from "@/types/vending-machine";
import React, { createContext, useContext, useState } from "react";

// 초기 사용자 보유금액
const initialUserMoney: UserMoney = {
  cash: {
    tenThousand: { value: 10000, count: 2, total: 20000 },
    fiveThousand: { value: 5000, count: 1, total: 5000 },
    oneThousand: { value: 1000, count: 3, total: 3000 },
    fiveHundred: { value: 500, count: 2, total: 1000 },
    oneHundred: { value: 100, count: 5, total: 500 },
    total: 29500,
  },
  card: { balance: 50000 },
};

interface UserMoneyContextType {
  userMoney: UserMoney;
  setUserMoney: React.Dispatch<React.SetStateAction<UserMoney>>;

  // 현금 관련 함수들
  addCash: (value: CashUnit, count: number) => void;
  subtractCash: (value: CashUnit, count: number) => void;
  getCashTotal: () => number;

  // 카드 관련 함수들
  updateCardBalance: (amount: number) => void;
  getCardBalance: () => number;

  // 전체 잔액 조회
  getTotalBalance: () => number;

  // 초기화
  resetUserMoney: () => void;
}

const UserMoneyContext = createContext<UserMoneyContextType | undefined>(
  undefined
);

export const UserMoneyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userMoney, setUserMoney] = useState<UserMoney>(initialUserMoney);

  // 현금 추가
  const addCash = (value: CashUnit, count: number) => {
    setUserMoney((prev) => {
      const newCash = { ...prev.cash };
      const key = getMoneyKey(value);
      newCash[key] = {
        ...newCash[key],
        count: newCash[key].count + count,
        total: newCash[key].value * (newCash[key].count + count),
      };
      newCash.total = calculateTotal(newCash);

      return {
        ...prev,
        cash: newCash,
      };
    });
  };

  // 현금 차감
  const subtractCash = (value: CashUnit, count: number) => {
    setUserMoney((prev) => {
      const newCash = { ...prev.cash };
      const key = getMoneyKey(value);
      const newCount = Math.max(0, newCash[key].count - count);
      newCash[key] = {
        ...newCash[key],
        count: newCount,
        total: newCash[key].value * newCount,
      };
      newCash.total = calculateTotal(newCash);

      return {
        ...prev,
        cash: newCash,
      };
    });
  };

  // 현금 총액 조회
  const getCashTotal = () => {
    return userMoney.cash.total;
  };

  // 카드 잔액/한도 업데이트
  const updateCardBalance = (amount: number) => {
    setUserMoney((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        balance: Math.max(0, prev.card.balance + amount),
      },
    }));
  };

  // 카드 잔액 조회
  const getCardBalance = () => {
    return userMoney.card.balance;
  };

  // 전체 잔액 조회 (현금 + 카드)
  const getTotalBalance = () => {
    return userMoney.cash.total + userMoney.card.balance;
  };

  // 초기화
  const resetUserMoney = () => {
    setUserMoney(initialUserMoney);
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
    <UserMoneyContext.Provider
      value={{
        userMoney,
        setUserMoney,
        addCash,
        subtractCash,
        getCashTotal,
        updateCardBalance,
        getCardBalance,
        getTotalBalance,
        resetUserMoney,
      }}
    >
      {children}
    </UserMoneyContext.Provider>
  );
};

export function useUserMoney() {
  const context = useContext(UserMoneyContext);
  if (!context) {
    throw new Error("useUserMoney must be used within a UserMoneyProvider");
  }
  return context;
}
