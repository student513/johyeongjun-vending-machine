"use client";
import { useUserMoney } from "@/contexts/user-money-context";
import { CashUnit } from "@/types/vending-machine";
import { useState } from "react";

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
      // 추가
      addCash(value as CashUnit, difference);
    } else if (difference < 0) {
      // 차감
      subtractCash(value as CashUnit, Math.abs(difference));
    }

    setCashInputs((prev) => ({
      ...prev,
      [getMoneyKey(value)]: newCount,
    }));
  };

  // 카드 잔고 업데이트
  const handleCardBalanceUpdate = () => {
    const difference = cardBalance - userMoney.card.balance;
    updateCardBalance(difference);
  };

  // 화폐 키 반환 함수
  const getMoneyKey = (
    value: number
  ): keyof Omit<typeof userMoney.cash, "total"> => {
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

  return (
    <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800">사용자 지갑 관리</h2>

      {/* 현금 관리 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">보유 현금</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* 10,000원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              10,000원
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={cashInputs.tenThousand}
                onChange={(e) =>
                  setCashInputs((prev) => ({
                    ...prev,
                    tenThousand: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleCashUpdate(10000, cashInputs.tenThousand)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                수정
              </button>
            </div>
          </div>

          {/* 5,000원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">5,000원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={cashInputs.fiveThousand}
                onChange={(e) =>
                  setCashInputs((prev) => ({
                    ...prev,
                    fiveThousand: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleCashUpdate(5000, cashInputs.fiveThousand)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                수정
              </button>
            </div>
          </div>

          {/* 1,000원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">1,000원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={cashInputs.oneThousand}
                onChange={(e) =>
                  setCashInputs((prev) => ({
                    ...prev,
                    oneThousand: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleCashUpdate(1000, cashInputs.oneThousand)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                수정
              </button>
            </div>
          </div>

          {/* 500원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">500원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={cashInputs.fiveHundred}
                onChange={(e) =>
                  setCashInputs((prev) => ({
                    ...prev,
                    fiveHundred: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleCashUpdate(500, cashInputs.fiveHundred)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                수정
              </button>
            </div>
          </div>

          {/* 100원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">100원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={cashInputs.oneHundred}
                onChange={(e) =>
                  setCashInputs((prev) => ({
                    ...prev,
                    oneHundred: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleCashUpdate(100, cashInputs.oneHundred)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                수정
              </button>
            </div>
          </div>
        </div>

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
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              카드 잔고 (원)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={cardBalance}
                onChange={(e) => setCardBalance(parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCardBalanceUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                수정
              </button>
            </div>
          </div>
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
