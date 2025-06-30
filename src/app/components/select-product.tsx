"use client";
import { useVendingMachine } from "@/contexts";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { VendingStep } from "@/types/vending-machine";
import { useState } from "react";

export const SelectProduct = () => {
  const { setVendingProcess } = useVendingProcess();
  const { vendingMachine } = useVendingMachine();
  const [productNumber, setProductNumber] = useState<number>();

  const handleSelectProduct = () => {
    const selectedProduct = vendingMachine.inventory.find(
      (beverage) => beverage.number === productNumber
    );

    if (!selectedProduct) {
      alert("존재하지 않는 상품입니다.");
      return;
    }

    setVendingProcess((prev) => ({
      ...prev,
      step: VendingStep.SELECT_PAYMENT,
      selectProduct: {
        selectedProductNumber: selectedProduct.number,
        selectedProductType: selectedProduct.name,
        selectedProductPrice: selectedProduct.price,
      },
    }));
  };

  const handleCancel = () => {
    setVendingProcess((prev) => ({
      ...prev,
      step: VendingStep.SELECT_PRODUCT,
      selectProduct: {
        selectedProductNumber: undefined,
        selectedProductType: undefined,
        selectedProductPrice: undefined,
      },
    }));
  };

  return (
    <div>
      <div>상품 선택</div>
      <input
        type="number"
        value={productNumber}
        onChange={(e) => setProductNumber(Number(e.target.value))}
      />
      <button onClick={handleSelectProduct}>선택</button>
      <button onClick={handleCancel}>취소</button>
    </div>
  );
};
