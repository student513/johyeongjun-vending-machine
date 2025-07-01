import { useVendingMachine } from "@/contexts";
import { useVendingProcess } from "@/contexts/vending-process-context";
import { VendingStep } from "@/types/vending-machine";
import Image from "next/image";
import { GetProduct } from "./components/get-product";
import { InsertPayment } from "./components/insert-payment";
import { SelectPayment } from "./components/select-payment";
import { SelectProduct } from "./components/select-product";
import { StepIndicator } from "./components/step-indicator";

interface BeverageItemProps {
  src: string;
  alt: string;
  name: string;
  price: number;
  quantity: number;
  number: number;
  isSelected?: boolean;
}

const BeverageItem = ({
  src,
  alt,
  name,
  price,
  quantity,
  number,
  isSelected = false,
}: BeverageItemProps) => (
  <div
    className={`bg-white border-2 border-solid p-4 rounded-xs flex flex-col items-center
      ${isSelected ? "border-red-400" : "border-gray-200"}`}
  >
    <Image aria-hidden src={src} alt={alt} width={100} height={100} />
    <div className="text-lg font-semibold">
      {number}.{name}
    </div>
    <div className="text-sm text-gray-600">{price.toLocaleString()}원</div>
    <div className="text-xs text-gray-500">재고: {quantity}개</div>
  </div>
);

const beverageImages = {
  커피: "/coffee.png",
  콜라: "/coke.png",
  생수: "/water.png",
};

export const VendingMachine = () => {
  const { vendingProcess } = useVendingProcess();
  const { getInventory } = useVendingMachine();

  const selectedBeverageNumber =
    vendingProcess.selectProduct.selectedProductNumber;

  const renderStep = () => {
    switch (vendingProcess.step) {
      case VendingStep.SELECT_PRODUCT:
        return <SelectProduct />;
      case VendingStep.SELECT_PAYMENT:
        return <SelectPayment />;
      case VendingStep.INSERT_PAYMENT:
        return <InsertPayment />;
      case VendingStep.GET_PRODUCT:
        return <GetProduct />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 h-screen">
      <StepIndicator />
      <div className="flex gap-8 h-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex justify-center items-center gap-4">
            {getInventory().map((beverage) => (
              <BeverageItem
                key={beverage.name}
                src={
                  beverageImages[beverage.name as keyof typeof beverageImages]
                }
                alt={`${beverage.name} icon`}
                name={beverage.name}
                price={beverage.price}
                quantity={beverage.quantity}
                number={beverage.number}
                isSelected={beverage.number === selectedBeverageNumber}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
