import { useUserMoney } from "@/contexts/user-money-context";
import { useVendingMachine } from "@/contexts/vending-machine-context";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { CashUnit, VendingStep } from "@/types/vending-machine";

export const GetProduct = () => {
  const {
    getInsertedTotal,
    calculateOptimalChange,
    subtractChangeMoney,
    resetInsertedMoney,
  } = useVendingMachine();
  const { addCash } = useUserMoney();
  const { vendingProcess, setVendingProcess } = useVendingProcess();

  const changeAmount =
    getInsertedTotal() -
    (vendingProcess.selectProduct.selectedProductPrice ?? 0);
  const optimalChange = calculateOptimalChange(changeAmount);

  const resetVendingProcess = () => {
    setVendingProcess({
      step: VendingStep.SELECT_PRODUCT,
      selectProduct: {},
      selectPayment: {},
      insertPayment: {},
      getProduct: {},
    });
  };

  const handleReceiveChange = () => {
    const changeAmount = getInsertedTotal();
    if (changeAmount === 0) return; // 반환할 잔돈 없음

    const optimalChange = calculateOptimalChange(changeAmount);
    if (!optimalChange) {
      // 거스름돈 부족 안내
      alert("거스름돈이 부족합니다. 관리자에게 문의하세요.");
      return;
    }

    // 각 화폐 단위별로 처리
    Object.entries(optimalChange).forEach(([unit, count]) => {
      if (count > 0) {
        subtractChangeMoney(Number(unit) as CashUnit, count);
        addCash(Number(unit) as CashUnit, count);
      }
    });

    resetInsertedMoney(); // 투입 금액 초기화
    resetVendingProcess();
  };

  return (
    <div>
      <div>상품을 수령해주세요.</div>
      {changeAmount > 0 ? (
        <div>
          <div>잔돈을 가져가주세요.</div>
          <div>잔돈: {changeAmount.toLocaleString()}원</div>
          {optimalChange && (
            <ul>
              {Object.entries(optimalChange).map(([unit, count]) =>
                count > 0 ? (
                  <li key={unit}>
                    {unit}원: {count}개
                  </li>
                ) : null
              )}
            </ul>
          )}
          <button
            className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleReceiveChange}
          >
            수령하고 돌아가기
          </button>
        </div>
      ) : (
        <button
          className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={resetVendingProcess}
        >
          돌아가기
        </button>
      )}
    </div>
  );
};
