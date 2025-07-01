"use client";
import { CASH_UNITS, VENDING_MACHINE_CONFIG } from "@/lib/constants";
import {
  CashUnit,
  UserMoney,
  calculateTotal,
  getMoneyKey,
} from "@/types/vending-machine";
import React, { createContext, useContext, useState } from "react";

// 초기 사용자 보유금액
const initialUserMoney: UserMoney = {
  cash: {
    tenThousand: {
      value: CASH_UNITS[0].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.tenThousand,
      total:
        CASH_UNITS[0].value *
        VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.tenThousand,
    },
    fiveThousand: {
      value: CASH_UNITS[1].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.fiveThousand,
      total:
        CASH_UNITS[1].value *
        VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.fiveThousand,
    },
    oneThousand: {
      value: CASH_UNITS[2].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.oneThousand,
      total:
        CASH_UNITS[2].value *
        VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.oneThousand,
    },
    fiveHundred: {
      value: CASH_UNITS[3].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.fiveHundred,
      total:
        CASH_UNITS[3].value *
        VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.fiveHundred,
    },
    oneHundred: {
      value: CASH_UNITS[4].value,
      count: VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.oneHundred,
      total:
        CASH_UNITS[4].value *
        VENDING_MACHINE_CONFIG.INITIAL_USER_CASH.oneHundred,
    },
    total: CASH_UNITS.reduce((sum, unit) => {
      const count =
        VENDING_MACHINE_CONFIG.INITIAL_USER_CASH[
          unit.key as keyof typeof VENDING_MACHINE_CONFIG.INITIAL_USER_CASH
        ];
      return sum + unit.value * count;
    }, 0),
  },
  card: { balance: VENDING_MACHINE_CONFIG.INITIAL_CARD_BALANCE },
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
  subtractCard: (amount: number) => void;
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

  // 카드 잔액 차감 함수
  const subtractCard = (amount: number) => {
    setUserMoney((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        balance: Math.max(0, prev.card.balance - amount),
      },
    }));
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
        subtractCard,
      }}
    >
      {children}
    </UserMoneyContext.Provider>
  );
};

export const useUserMoney = () => {
  const context = useContext(UserMoneyContext);
  if (context === undefined) {
    throw new Error("useUserMoney must be used within a UserMoneyProvider");
  }
  return context;
};
