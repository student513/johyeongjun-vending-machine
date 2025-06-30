import { useVendingProcess } from "@/contexts/vending-process-context";
import { VendingStep } from "@/types/vending-machine";

export const SelectPayment = () => {
  const { setVendingProcess } = useVendingProcess();

  const handleSelectPayment = (paymentType: "cash" | "card") => {
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
        <button
          className="inline-block rounded-sm border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-3 focus:outline-hidden"
          onClick={() => handleSelectPayment("cash")}
        >
          현금
        </button>
        <button
          className="inline-block rounded-sm border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-3 focus:outline-hidden"
          onClick={() => handleSelectPayment("card")}
        >
          카드
        </button>
      </div>
    </div>
  );
};
