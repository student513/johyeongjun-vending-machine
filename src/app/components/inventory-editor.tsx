"use client";
import { useVendingMachine } from "@/contexts/vending-machine-context";
import { CashUnit } from "@/types/vending-machine";
import { useState } from "react";
import { Button } from "./ui/button";

export default function InventoryEditor() {
  const {
    vendingMachine,
    updateProductQuantity,
    addChangeMoney,
    subtractChangeMoney,
  } = useVendingMachine();

  // 재고 수량 상태
  const [inventoryInputs, setInventoryInputs] = useState({
    coffee:
      vendingMachine.inventory.find((item) => item.name === "커피")?.quantity ||
      0,
    coke:
      vendingMachine.inventory.find((item) => item.name === "콜라")?.quantity ||
      0,
    water:
      vendingMachine.inventory.find((item) => item.name === "생수")?.quantity ||
      0,
  });

  // 거스름돈 개수 상태
  const [changeInputs, setChangeInputs] = useState({
    tenThousand: vendingMachine.changeMoney.tenThousand.count,
    fiveThousand: vendingMachine.changeMoney.fiveThousand.count,
    oneThousand: vendingMachine.changeMoney.oneThousand.count,
    fiveHundred: vendingMachine.changeMoney.fiveHundred.count,
    oneHundred: vendingMachine.changeMoney.oneHundred.count,
  });

  // 재고 수량 업데이트
  const handleInventoryUpdate = (productName: string, newQuantity: number) => {
    const product = vendingMachine.inventory.find(
      (item) => item.name === productName
    );
    if (product) {
      updateProductQuantity(product.number, newQuantity);
      setInventoryInputs((prev) => ({
        ...prev,
        [productName === "커피"
          ? "coffee"
          : productName === "콜라"
          ? "coke"
          : "water"]: newQuantity,
      }));
    }
  };

  // 거스름돈 개수 업데이트
  const handleChangeUpdate = (value: number, newCount: number) => {
    const currentCount = vendingMachine.changeMoney[getMoneyKey(value)].count;
    const difference = newCount - currentCount;

    if (difference > 0) {
      // 추가
      addChangeMoney(value as CashUnit, difference);
    } else if (difference < 0) {
      // 차감
      subtractChangeMoney(value as CashUnit, Math.abs(difference));
    }

    setChangeInputs((prev) => ({
      ...prev,
      [getMoneyKey(value)]: newCount,
    }));
  };

  // 화폐 키 반환 함수
  const getMoneyKey = (
    value: number
  ): keyof Omit<typeof vendingMachine.changeMoney, "total"> => {
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
      <h2 className="text-xl font-bold mb-6 text-gray-800">자판기 재고 관리</h2>
      {/* 음료 재고 관리 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">음료 재고</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 커피 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              커피 (700원)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={inventoryInputs.coffee}
                onChange={(e) =>
                  setInventoryInputs((prev) => ({
                    ...prev,
                    coffee: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="action"
                size="md"
                onClick={() =>
                  handleInventoryUpdate("커피", inventoryInputs.coffee)
                }
              >
                수정
              </Button>
            </div>
          </div>

          {/* 콜라 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              콜라 (1,100원)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={inventoryInputs.coke}
                onChange={(e) =>
                  setInventoryInputs((prev) => ({
                    ...prev,
                    coke: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="action"
                size="md"
                onClick={() =>
                  handleInventoryUpdate("콜라", inventoryInputs.coke)
                }
              >
                수정
              </Button>
            </div>
          </div>

          {/* 생수 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">
              생수 (600원)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={inventoryInputs.water}
                onChange={(e) =>
                  setInventoryInputs((prev) => ({
                    ...prev,
                    water: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="action"
                size="md"
                onClick={() =>
                  handleInventoryUpdate("생수", inventoryInputs.water)
                }
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 거스름돈 관리 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">거스름돈</h3>
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
                value={changeInputs.tenThousand}
                onChange={(e) =>
                  setChangeInputs((prev) => ({
                    ...prev,
                    tenThousand: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="success"
                size="md"
                onClick={() =>
                  handleChangeUpdate(10000, changeInputs.tenThousand)
                }
              >
                수정
              </Button>
            </div>
          </div>

          {/* 5,000원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">5,000원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={changeInputs.fiveThousand}
                onChange={(e) =>
                  setChangeInputs((prev) => ({
                    ...prev,
                    fiveThousand: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="success"
                size="md"
                onClick={() =>
                  handleChangeUpdate(5000, changeInputs.fiveThousand)
                }
              >
                수정
              </Button>
            </div>
          </div>

          {/* 1,000원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">1,000원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={changeInputs.oneThousand}
                onChange={(e) =>
                  setChangeInputs((prev) => ({
                    ...prev,
                    oneThousand: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="success"
                size="md"
                onClick={() =>
                  handleChangeUpdate(1000, changeInputs.oneThousand)
                }
              >
                수정
              </Button>
            </div>
          </div>

          {/* 500원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">500원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={changeInputs.fiveHundred}
                onChange={(e) =>
                  setChangeInputs((prev) => ({
                    ...prev,
                    fiveHundred: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="success"
                size="md"
                onClick={() =>
                  handleChangeUpdate(500, changeInputs.fiveHundred)
                }
              >
                수정
              </Button>
            </div>
          </div>

          {/* 100원 */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">100원</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={changeInputs.oneHundred}
                onChange={(e) =>
                  setChangeInputs((prev) => ({
                    ...prev,
                    oneHundred: parseInt(e.target.value) || 0,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="success"
                size="md"
                onClick={() => handleChangeUpdate(100, changeInputs.oneHundred)}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
