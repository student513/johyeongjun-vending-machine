"use client";
import { useVendingMachine } from "@/contexts/vending-machine-context";
import { CASH_VALUES, PRODUCTS } from "@/lib/constants";
import { CashUnit } from "@/types/vending-machine";
import { useState } from "react";
import { MoneyInputGroup } from "./ui/money-input-group";
import { ProductInputGroup } from "./ui/product-input-group";

export default function InventoryEditor() {
  const {
    vendingMachine,
    updateProductQuantity,
    addChangeMoney,
    subtractChangeMoney,
  } = useVendingMachine();

  // 재고 개수 상태
  const [inventoryInputs, setInventoryInputs] = useState({
    coffee:
      vendingMachine.inventory.find(
        (item) => item.name === PRODUCTS.coffee.name
      )?.quantity ?? 0,
    coke:
      vendingMachine.inventory.find((item) => item.name === PRODUCTS.coke.name)
        ?.quantity ?? 0,
    water:
      vendingMachine.inventory.find((item) => item.name === PRODUCTS.water.name)
        ?.quantity ?? 0,
  });

  // 거스름돈 개수 상태
  const [changeInputs, setChangeInputs] = useState({
    tenThousand: vendingMachine.changeMoney.tenThousand.count,
    fiveThousand: vendingMachine.changeMoney.fiveThousand.count,
    oneThousand: vendingMachine.changeMoney.oneThousand.count,
    fiveHundred: vendingMachine.changeMoney.fiveHundred.count,
    oneHundred: vendingMachine.changeMoney.oneHundred.count,
  });

  // 재고 개수 업데이트
  const handleInventoryUpdate = (productType: string, newQuantity: number) => {
    const productNumber = PRODUCTS[productType as keyof typeof PRODUCTS].number;
    updateProductQuantity(productNumber, newQuantity);
    setInventoryInputs((prev) => ({
      ...prev,
      [productType]: newQuantity,
    }));
  };

  // 거스름돈 개수 업데이트
  const handleChangeUpdate = (value: number, newCount: number) => {
    const currentCount = vendingMachine.changeMoney[getMoneyKey(value)].count;
    const difference = newCount - currentCount;

    if (difference > 0) {
      addChangeMoney(value as CashUnit, difference);
    } else if (difference < 0) {
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

  // 제품 데이터
  const products = [
    {
      name: PRODUCTS.coffee.name,
      price: PRODUCTS.coffee.price,
      quantity: inventoryInputs.coffee,
    },
    {
      name: PRODUCTS.coke.name,
      price: PRODUCTS.coke.price,
      quantity: inventoryInputs.coke,
    },
    {
      name: PRODUCTS.water.name,
      price: PRODUCTS.water.price,
      quantity: inventoryInputs.water,
    },
  ];

  // 화폐 단위 데이터
  const moneyUnits = [
    {
      value: CASH_VALUES.TEN_THOUSAND,
      label: "10,000원",
      count: changeInputs.tenThousand,
    },
    {
      value: CASH_VALUES.FIVE_THOUSAND,
      label: "5,000원",
      count: changeInputs.fiveThousand,
    },
    {
      value: CASH_VALUES.ONE_THOUSAND,
      label: "1,000원",
      count: changeInputs.oneThousand,
    },
    {
      value: CASH_VALUES.FIVE_HUNDRED,
      label: "500원",
      count: changeInputs.fiveHundred,
    },
    {
      value: CASH_VALUES.ONE_HUNDRED,
      label: "100원",
      count: changeInputs.oneHundred,
    },
  ];

  return (
    <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800">자판기 재고 관리</h2>

      {/* 음료 재고 관리 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">음료 재고</h3>
        <ProductInputGroup
          products={products}
          onUpdate={handleInventoryUpdate}
        />
      </div>

      {/* 거스름돈 관리 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">거스름돈</h3>
        <MoneyInputGroup
          moneyUnits={moneyUnits}
          onUpdate={handleChangeUpdate}
        />
      </div>
    </div>
  );
}
