"use client";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { beverages, VendingStep } from "@/types/vending-machine";
import { useState } from "react";

export const SelectProduct = () => {
  const { setVendingProcess } = useVendingProcess();
  const [productNumber, setProductNumber] = useState<number>();

  const handleSelectProduct = () => {
    const selectedProduct = beverages.find(
      (beverage) => beverage.number === productNumber
    );

    if (!selectedProduct) {
      // TODO: 상품 선택 실패 메시지 출력
      return;
    }

    setVendingProcess((prev) => ({
      ...prev,
      step: VendingStep.SELECT_PAYMENT,
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
