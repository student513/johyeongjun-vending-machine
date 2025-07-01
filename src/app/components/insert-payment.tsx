"use client";
import { useUserMoney } from "@/contexts/user-money-context";
import { useVendingMachine } from "@/contexts/vending-machine-context";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { CashUnit, VendingStep } from "@/types/vending-machine";
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

  if (paymentMethod === "cash") {
    const cashUnits = [
      { key: "tenThousand", value: 10000 },
      { key: "fiveThousand", value: 5000 },
      { key: "oneThousand", value: 1000 },
      { key: "fiveHundred", value: 500 },
      { key: "oneHundred", value: 100 },
    ] as const;

    const handleClickInsert = (value: CashUnit) => {
      // 사용자의 현금 차감 및 자판기의 투입된 금액 증가
      subtractCash(value, 1);
      addInsertedMoney(value, 1);
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
          alert(
            "거스름돈이 부족합니다. 투입된 금액을 반환합니다. 관리자에게 문의하세요."
          );
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
          {cashUnits.map((unit) => (
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

    const handleClickCardPay = () => {
      if (!canPay) {
        alert("카드 잔액이 부족합니다.");
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
    };

    return (
      <div>
        <div className="mb-2">카드를 투입해주세요.</div>
        <div className="mb-1">
          카드 잔액: {userMoney.card.balance.toLocaleString()}원
        </div>
        <div className="flex gap-4">
          <Button
            variant="primary"
            disabled={!canPay}
            onClick={handleClickCardPay}
          >
            결제
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
