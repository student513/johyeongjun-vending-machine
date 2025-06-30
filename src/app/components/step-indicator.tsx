import { useVendingProcess } from "@/contexts/vending-process-context";
import { VendingStep } from "@/types/vending-machine";

const steps = [
  { step: VendingStep.SELECT_PRODUCT, label: "상품 선택" },
  { step: VendingStep.SELECT_PAYMENT, label: "결제 수단 선택" },
  { step: VendingStep.INSERT_PAYMENT, label: "결제" },
  { step: VendingStep.GET_PRODUCT, label: "상품 수령" },
];

export const StepIndicator = () => {
  const { vendingProcess } = useVendingProcess();

  return (
    <div className="w-full max-w-xl my-4">
      <div className="flex items-center justify-between">
        {steps.map((stepInfo, index) => (
          <div key={stepInfo.step} className="flex items-center">
            <span
              className={`ml-2 text-sm font-medium ${
                vendingProcess.step === stepInfo.step
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {index + 1}. {stepInfo.label}
            </span>
            {index < steps.length - 1 && (
              <div className="mx-4 flex-1 h-0.5 bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
