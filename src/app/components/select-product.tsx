"use client";
import { useVendingMachine } from "@/contexts";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { VendingStep } from "@/types/vending-machine";
import { useState } from "react";

export const SelectProduct = () => {
  const { setVendingProcess } = useVendingProcess();
  const { vendingMachine } = useVendingMachine();
  const [productNumber, setProductNumber] = useState<number | undefined>();
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 빈 문자열인 경우 undefined로 설정
    if (value === "") {
      setInputValue("");
      setProductNumber(undefined);
      return;
    }

    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, "");

    // 앞의 0 제거 (001 -> 1)
    const cleanValue = numericValue.replace(/^0+/, "");

    // 빈 문자열이 되면 undefined로 설정
    if (cleanValue === "") {
      setInputValue("");
      setProductNumber(undefined);
      return;
    }

    const numValue = parseInt(cleanValue, 10);

    // 0인 경우 입력 제한
    if (numValue === 0) {
      return;
    }

    setInputValue(cleanValue);
    setProductNumber(numValue);
  };

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
    // 입력값도 초기화
    setInputValue("");
    setProductNumber(undefined);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div>구매하실 상품의 번호를 입력해주세요.</div>
      <input
        type="text"
        className="mt-0.5 h-10 w-full rounded border-gray-500 shadow-sm sm:text-sm"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="상품 번호 입력"
      />
      <div className="flex gap-4">
        <button
          className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSelectProduct}
          disabled={!productNumber}
        >
          선택
        </button>
        <button
          className="inline-block rounded-sm border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-3 focus:outline-hidden"
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
};
