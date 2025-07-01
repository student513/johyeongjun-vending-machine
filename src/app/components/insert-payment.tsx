"use client";
import { useUserMoney } from "@/contexts/user-money-context";
import { useVendingMachine } from "@/contexts/vending-machine-context";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { CashUnit, VendingStep } from "@/types/vending-machine";

export const InsertPayment = () => {
  const { userMoney, subtractCash, subtractCard } = useUserMoney();
  const {
    addInsertedMoney,
    getInsertedTotal,
    addChangeMoney,
    resetInsertedMoney,
    insertedMoney,
  } = useVendingMachine();
  const { vendingProcess, setVendingProcess } = useVendingProcess();
  const { returnInsertedMoney, decreaseProductQuantity } = useVendingMachine();
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
      subtractCash(value, 1);
      addInsertedMoney(value, 1);
    };

    const handleClickCashPay = () => {
      // 투입된 금액을 자판기의 거스름돈에 추가
      const cashUnits = [
        { key: "tenThousand", value: 10000 },
        { key: "fiveThousand", value: 5000 },
        { key: "oneThousand", value: 1000 },
        { key: "fiveHundred", value: 500 },
        { key: "oneHundred", value: 100 },
      ] as const;

      cashUnits.forEach((unit) => {
        const count = insertedMoney[unit.key].count;
        if (count > 0) {
          addChangeMoney(unit.value as CashUnit, count);
        }
      });

      // 투입된 금액 초기화
      resetInsertedMoney();

      // 다음 단계 진입
      setVendingProcess({
        ...vendingProcess,
        step: VendingStep.GET_PRODUCT,
      });
      // 상품 수량 감소
      if (vendingProcess.selectProduct.selectedProductNumber) {
        decreaseProductQuantity(
          vendingProcess.selectProduct.selectedProductNumber
        );
      }
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
              <button
                className="bg-yellow-200 px-2 py-1 rounded disabled:opacity-50"
                disabled={userMoney.cash[unit.key].count === 0 || isOverPrice}
                onClick={() => handleClickInsert(unit.value as CashUnit)}
              >
                투입
              </button>
            </div>
          ))}
        </div>
        {isOverPrice && (
          <div className="text-red-500 text-sm mt-2">
            이미 상품 가격 이상이 투입되었습니다.
          </div>
        )}
        <div className="flex gap-4">
          <button
            className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isOverPrice}
            onClick={handleClickCashPay}
          >
            결제
          </button>
          <button
            className="inline-block rounded-sm border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-3 focus:outline-hidden"
            onClick={() => returnInsertedMoney()}
          >
            반환
          </button>
        </div>
      </div>
    );
  }

  if (paymentMethod === "card") {
    const canPay = userMoney.card.balance >= productPrice;

    return (
      <div>
        <div className="mb-2">카드를 투입해주세요.</div>
        <div className="mb-1">
          카드 잔액: {userMoney.card.balance.toLocaleString()}원
        </div>
        <div className="flex gap-4">
          <button
            className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canPay}
            onClick={() => {
              if (!canPay) return;
              // 카드 잔액 차감
              subtractCard(productPrice);
              // vendingProcess 초기화 및 step 변경
              setVendingProcess({
                ...vendingProcess,
                step: VendingStep.GET_PRODUCT,
              });
              if (vendingProcess.selectProduct.selectedProductNumber) {
                decreaseProductQuantity(
                  vendingProcess.selectProduct.selectedProductNumber
                );
              }
            }}
          >
            결제
          </button>
        </div>
      </div>
    );
  }

  return null;
};
