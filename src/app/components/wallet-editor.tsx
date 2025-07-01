"use client";
import { useUserMoney } from "@/contexts/user-money-context";
import { CASH_VALUES } from "@/lib/constants";
import { CashUnit } from "@/types/vending-machine";
import { useState } from "react";
import { InputWithButton } from "./ui/input-with-button";
import { MoneyInputGroup } from "./ui/money-input-group";

export default function WalletEditor() {
  const { userMoney, addCash, subtractCash, updateCardBalance } =
    useUserMoney();

  // 현금 개수 상태
  const [cashInputs, setCashInputs] = useState({
    tenThousand: userMoney.cash.tenThousand.count,
    fiveThousand: userMoney.cash.fiveThousand.count,
    oneThousand: userMoney.cash.oneThousand.count,
    fiveHundred: userMoney.cash.fiveHundred.count,
    oneHundred: userMoney.cash.oneHundred.count,
  });

  // 카드 잔고 상태
  const [cardBalance, setCardBalance] = useState(userMoney.card.balance);

  // 현금 개수 업데이트
  const handleCashUpdate = (value: number, newCount: number) => {
    const currentCount = userMoney.cash[getMoneyKey(value)].count;
    const difference = newCount - currentCount;

    if (difference > 0) {
      addCash(value as CashUnit, difference);
    } else if (difference < 0) {
      subtractCash(value as CashUnit, Math.abs(difference));
    }

    setCashInputs((prev) => ({
      ...prev,
      [getMoneyKey(value)]: newCount,
    }));
  };

  // 카드 잔고 업데이트 (입력값이 바뀔 때마다 바로 반영)
  const handleCardBalanceChange = (newBalance: number) => {
    setCardBalance(newBalance);
    const difference = newBalance - userMoney.card.balance;
    if (difference !== 0) {
      updateCardBalance(difference);
    }
  };

  // 화폐 키 반환 함수
  const getMoneyKey = (
    value: number
  ): keyof Omit<typeof userMoney.cash, "total"> => {
    switch (value) {
      case CASH_VALUES.TEN_THOUSAND:
        return "tenThousand";
      case CASH_VALUES.FIVE_THOUSAND:
        return "fiveThousand";
      case CASH_VALUES.ONE_THOUSAND:
        return "oneThousand";
      case CASH_VALUES.FIVE_HUNDRED:
        return "fiveHundred";
      case CASH_VALUES.ONE_HUNDRED:
        return "oneHundred";
      default:
        throw new Error(`Invalid currency value: ${value}`);
    }
  };

  // 화폐 단위 데이터
  const moneyUnits = [
    {
      value: CASH_VALUES.TEN_THOUSAND,
      label: "10,000원",
      count: cashInputs.tenThousand,
    },
    {
      value: CASH_VALUES.FIVE_THOUSAND,
      label: "5,000원",
      count: cashInputs.fiveThousand,
    },
    {
      value: CASH_VALUES.ONE_THOUSAND,
      label: "1,000원",
      count: cashInputs.oneThousand,
    },
    {
      value: CASH_VALUES.FIVE_HUNDRED,
      label: "500원",
      count: cashInputs.fiveHundred,
    },
    {
      value: CASH_VALUES.ONE_HUNDRED,
      label: "100원",
      count: cashInputs.oneHundred,
    },
  ];

  return (
    <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800">사용자 지갑 관리</h2>

      {/* 현금 관리 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">보유 현금</h3>
        <MoneyInputGroup moneyUnits={moneyUnits} onUpdate={handleCashUpdate} />

        {/* 현금 총액 표시 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            현금 총액:{" "}
            <span className="font-semibold text-gray-800">
              {userMoney.cash.total.toLocaleString()}원
            </span>
          </p>
        </div>
      </div>

      {/* 카드 잔고 관리 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">카드 잔고</h3>
        <div className="max-w-md">
          <InputWithButton
            label="카드 잔고 (원)"
            value={cardBalance}
            onChange={handleCardBalanceChange}
          />
        </div>

        {/* 카드 잔고 표시 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            카드 잔고:{" "}
            <span className="font-semibold text-gray-800">
              {userMoney.card.balance.toLocaleString()}원
            </span>
          </p>
        </div>
      </div>

      {/* 전체 잔액 표시 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-lg font-bold text-blue-800">
          전체 잔액:{" "}
          {(userMoney.cash.total + userMoney.card.balance).toLocaleString()}원
        </p>
        <p className="text-sm text-blue-600">
          (현금 {userMoney.cash.total.toLocaleString()}원 + 카드{" "}
          {userMoney.card.balance.toLocaleString()}원)
        </p>
      </div>
    </div>
  );
}
