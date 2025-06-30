import { useVendingProcess } from "@/contexts/vending-process-context";
import { beverages, VendingStep } from "@/types/vending-machine";
import Image from "next/image";
import { InsertPayment } from "./components/insert-payment";
import { ReturnChange } from "./components/return-change";
import { SelectPayment } from "./components/select-payment";
import { SelectProduct } from "./components/select-product";

interface BeverageItemProps {
  src: string;
  alt: string;
  name: string;
  price: number;
  quantity: number;
  number: number;
}

const BeverageItem = ({
  src,
  alt,
  name,
  price,
  quantity,
  number,
}: BeverageItemProps) => (
  <div className="bg-white border-2 border-solid p-4 rounded-xs flex flex-col items-center">
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

  const renderStep = () => {
    switch (vendingProcess.step) {
      case VendingStep.SELECT_PRODUCT:
        return <SelectProduct />;
      case VendingStep.SELECT_PAYMENT:
        return <SelectPayment />;
      case VendingStep.INSERT_PAYMENT:
        return <InsertPayment />;
      case VendingStep.RETURN_CHANGE:
        return <ReturnChange />;
    }
  };

  const renderMessage = () => {
    switch (vendingProcess.step) {
      case VendingStep.SELECT_PRODUCT:
        return "구매하실 상품의 번호를 입력해주세요.";
      case VendingStep.SELECT_PAYMENT:
        return "결제 수단을 선택해주세요.";
      case VendingStep.INSERT_PAYMENT:
        return "금액을 투입해주세요.";
      case VendingStep.RETURN_CHANGE:
        return "잔돈을 가져가주세요.";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-4">
        {beverages.map((beverage) => (
          <BeverageItem
            key={beverage.name}
            src={beverageImages[beverage.name as keyof typeof beverageImages]}
            alt={`${beverage.name} icon`}
            name={beverage.name}
            price={beverage.price}
            quantity={beverage.quantity}
            number={beverage.number}
          />
        ))}
      </div>
      <div>{renderMessage()}</div>
      <div>{renderStep()}</div>
    </div>
  );
};
