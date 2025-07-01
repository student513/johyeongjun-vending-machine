import { useUserMoney } from "@/contexts/user-money-context";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { VendingStep } from "@/types/vending-machine";
import { Button } from "./ui/button";

export const SelectPayment = () => {
  const { setVendingProcess, vendingProcess } = useVendingProcess();
  const { getCashTotal, getCardBalance } = useUserMoney();

  const handleSelectPayment = (paymentType: "cash" | "card") => {
    const selectedProductPrice =
      vendingProcess.selectProduct.selectedProductPrice;

    if (!selectedProductPrice) {
      alert("상품이 선택되지 않았습니다.");
      return;
    }

    // 현금 선택 시 잔액 확인
    if (paymentType === "cash") {
      const cashTotal = getCashTotal();
      if (cashTotal < selectedProductPrice) {
        alert(
          `현금이 부족합니다. 보유 현금: ${cashTotal.toLocaleString()}원, 상품 가격: ${selectedProductPrice.toLocaleString()}원`
        );
        return;
      }
    }

    // 카드 선택 시 잔액 확인
    if (paymentType === "card") {
      const cardBalance = getCardBalance();
      if (cardBalance < selectedProductPrice) {
        alert(
          `카드 잔액이 부족합니다. 카드 잔액: ${cardBalance.toLocaleString()}원, 상품 가격: ${selectedProductPrice.toLocaleString()}원`
        );
        return;
      }
    }

    setVendingProcess((prev) => ({
      ...prev,
      selectPayment: {
        paymentMethod: paymentType,
      },
      step: VendingStep.INSERT_PAYMENT,
    }));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div>결제 수단을 선택해주세요.</div>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => handleSelectPayment("cash")}>
          현금
        </Button>
        <Button variant="secondary" onClick={() => handleSelectPayment("card")}>
          카드
        </Button>
      </div>
    </div>
  );
};
