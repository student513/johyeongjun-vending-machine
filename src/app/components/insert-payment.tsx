"use client";
import { useUserMoney } from "@/contexts/user-money-context";
import { useVendingMachine } from "@/contexts/vending-machine-context";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { CASH_UNITS, ERROR_MESSAGES } from "@/lib/constants";
import { getOptimalCashInsert } from "@/lib/utils";
import { CashUnit, VendingStep } from "@/types/vending-machine";
import React from "react";
import { Button } from "./ui/button";

export const InsertPayment = () => {
  const { userMoney, subtractCash, subtractCard } = useUserMoney();
  const {
    addInsertedMoney,
    getInsertedTotal,
    returnInsertedMoney,
    decreaseProductQuantity,
  } = useVendingMachine();
  const { vendingProcess, setVendingProcess } = useVendingProcess();
  const { canProvideChange } = useVendingMachine();
  const paymentMethod = vendingProcess.selectPayment.paymentMethod;

  // 선택된 상품의 가격
  const selectedProduct = vendingProcess.selectProduct.selectedProductPrice;
  const productPrice = selectedProduct ?? 0;

  // 투입된 금액 총합
  const insertedTotal = getInsertedTotal();

  // 투입 불가 조건
  const isOverPrice = insertedTotal >= productPrice;

  // 카드 결제 관련 상태 (조건문 밖에서 선언)
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  if (paymentMethod === "cash") {
    const handleClickInsert = (value: CashUnit) => {
      // 사용자의 현금 차감 및 자판기의 투입된 금액 증가
      subtractCash(value, 1);
      addInsertedMoney(value, 1);
    };

    // 최적화된 현금 투입 핸들러
    const handleClickOptimalInsert = () => {
      const cashTotal = Object.values(userMoney.cash)
        .filter(
          (v): v is { total: number } =>
            typeof v === "object" && v !== null && "total" in v
        )
        .reduce((sum, v) => sum + (v.total ?? 0), 0);
      if (cashTotal < productPrice) {
        alert(
          `현금이 부족합니다. 보유 현금: ${cashTotal.toLocaleString()}원, 상품 가격: ${productPrice.toLocaleString()}원`
        );
        return;
      }
      const optimal = getOptimalCashInsert(productPrice, userMoney.cash);
      // getOptimalCashInsert가 null을 반환하는 경우는 이론상 cashTotal < productPrice에서 이미 걸러짐
      if (!optimal) return;
      // 각 화폐 단위별로 차감/추가
      Object.entries(optimal.insert).forEach(([key, count]) => {
        if (count > 0) {
          subtractCash(
            CASH_UNITS.find((u) => u.key === key)!.value as CashUnit,
            count
          );
          addInsertedMoney(
            CASH_UNITS.find((u) => u.key === key)!.value as CashUnit,
            count
          );
        }
      });
    };

    const handleClickCashPay = () => {
      // 거스름돈 계산
      const changeAmount = insertedTotal - productPrice;

      // 거스름돈이 필요한 경우 (투입된 금액이 상품 가격보다 많을 때)
      if (changeAmount > 0) {
        // 자판기에서 거스름돈을 제공할 수 있는지 확인
        if (!canProvideChange(changeAmount)) {
          // 거스름돈이 부족한 경우 투입된 돈을 반환하고 프로세스 초기화
          returnInsertedMoney();
          setVendingProcess({
            step: VendingStep.SELECT_PRODUCT,
            selectProduct: {},
            selectPayment: {},
            insertPayment: {},
            getProduct: {},
          });
          alert(ERROR_MESSAGES.CHANGE_INSUFFICIENT_WITH_RETURN);
          return;
        }
      }

      // 거스름돈이 충분하거나 필요없는 경우 정상 결제 진행
      // 상품 수량 감소
      if (vendingProcess.selectProduct.selectedProductNumber) {
        decreaseProductQuantity(
          vendingProcess.selectProduct.selectedProductNumber
        );
      }

      // 다음 단계 진입
      setVendingProcess({
        ...vendingProcess,
        step: VendingStep.GET_PRODUCT,
      });
    };
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="mb-2">현금을 투입해주세요.</div>
        <div className="mb-2">
          투입된 금액: {insertedTotal.toLocaleString()}원
        </div>
        <div className="mb-2">내 지갑</div>
        <div className="flex flex-col gap-2">
          {CASH_UNITS.map((unit) => (
            <div key={unit.value} className="flex items-center gap-2">
              <span>
                {unit.value}원 x {userMoney.cash[unit.key].count}
              </span>
              <Button
                variant="action"
                size="sm"
                disabled={userMoney.cash[unit.key].count === 0 || isOverPrice}
                onClick={() => handleClickInsert(unit.value as CashUnit)}
              >
                투입
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            disabled={isOverPrice || productPrice === 0}
            onClick={handleClickOptimalInsert}
          >
            최적 투입
          </Button>
        </div>
        {isOverPrice && (
          <div className="text-red-500 text-sm mt-2">
            이미 상품 가격 이상이 투입되었습니다.
          </div>
        )}
        <div className="flex gap-4">
          <Button
            variant="primary"
            disabled={!isOverPrice}
            onClick={handleClickCashPay}
          >
            결제
          </Button>
          <Button variant="secondary" onClick={() => returnInsertedMoney()}>
            반환
          </Button>
        </div>
      </div>
    );
  }

  if (paymentMethod === "card") {
    const canPay = userMoney.card.balance >= productPrice;

    const handleClickCardPay = async () => {
      if (!canPay) {
        alert(ERROR_MESSAGES.CARD_BALANCE_INSUFFICIENT);
        return;
      }
      setIsLoading(true);
      setHasError(false);
      // 3초 대기
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // 30% 확률로 실패
      if (Math.random() < 0.3) {
        setIsLoading(false);
        setHasError(true);
        alert(ERROR_MESSAGES.CARD_PAYMENT_FAILED);
        return;
      }
      // vendingProcess 초기화 및 step 변경
      setVendingProcess({
        ...vendingProcess,
        step: VendingStep.GET_PRODUCT,
      });
      // 카드 잔액 차감
      subtractCard(productPrice);
      // 상품 수량 감소
      if (vendingProcess.selectProduct.selectedProductNumber) {
        decreaseProductQuantity(
          vendingProcess.selectProduct.selectedProductNumber
        );
      }
      setIsLoading(false);
    };

    return (
      <div>
        <div className="mb-2">카드를 투입해주세요.</div>
        <div className="mb-1">
          카드 잔액: {userMoney.card.balance.toLocaleString()}원
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant="primary"
            disabled={!canPay || isLoading}
            onClick={handleClickCardPay}
          >
            {isLoading ? "결제 중..." : "결제"}
          </Button>
        </div>
        {hasError && (
          <div className="text-red-500 text-sm mt-2">
            {ERROR_MESSAGES.CARD_PAYMENT_FAILED}
          </div>
        )}
      </div>
    );
  }

  return null;
};
