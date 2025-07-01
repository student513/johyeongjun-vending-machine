"use client";
import { useVendingMachine } from "@/contexts";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { ERROR_MESSAGES } from "@/lib/constants";
import { VendingStep } from "@/types/vending-machine";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export const SelectProduct = () => {
  const { setVendingProcess } = useVendingProcess();
  const { vendingMachine } = useVendingMachine();
  const [productNumber, setProductNumber] = useState<number | undefined>();
  const [inputValue, setInputValue] = useState<string>("");
  const router = useRouter();

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
      alert(ERROR_MESSAGES.PRODUCT_NOT_EXISTS);
      return;
    }

    if (selectedProduct.quantity === 0) {
      alert(ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
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

  const handleAdminMode = () => {
    router.push("/admin");
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
        <Button
          variant="primary"
          onClick={handleSelectProduct}
          disabled={!productNumber}
        >
          선택
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          취소
        </Button>
      </div>
      <Button variant="primary" onClick={handleAdminMode}>
        관리자 모드
      </Button>
    </div>
  );
};
