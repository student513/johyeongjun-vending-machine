import { InventoryItem } from "@/types/vending-machine";
import Image from "next/image";

interface BeverageItemProps {
  src: string;
  alt: string;
  name: string;
  price: number;
  quantity: number;
}

const BeverageItem = ({
  src,
  alt,
  name,
  price,
  quantity,
}: BeverageItemProps) => (
  <div className="bg-white border-2 border-solid p-4 rounded-xs flex flex-col items-center">
    <Image aria-hidden src={src} alt={alt} width={100} height={100} />
    <div className="text-lg font-semibold">{name}</div>
    <div className="text-sm text-gray-600">{price.toLocaleString()}원</div>
    <div className="text-xs text-gray-500">재고: {quantity}개</div>
  </div>
);

const beverages: InventoryItem[] = [
  { name: "커피", quantity: 10, price: 700 },
  { name: "콜라", quantity: 15, price: 1100 },
  { name: "생수", quantity: 20, price: 600 },
];

const beverageImages = {
  커피: "/coffee.png",
  콜라: "/coke.png",
  생수: "/water.png",
};

export default function Home() {
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
          />
        ))}
      </div>
      <div>
        {/* 단계별 안내 메세지 */}
        구매하실 상품의 번호를 입력해주세요.
      </div>
      <div className="flex justify-center items-center bg-gray-200">
        <div>상품 선택: </div>
        <input type="number" />
        <button>선택</button>
        <button>취소</button>
      </div>
      <div className="bg-gray-200">
        <div>결제 수단 선택</div>
        <button>현금</button>
        <button>카드</button>
      </div>
      <div className="bg-red-200">
        <div>현금 투입</div>
        <div>가격: 1000원</div>
        <div>투입된 금액: -원</div>
        <div>내 지갑</div>
      </div>
      <div className="bg-blue-200">
        <div>카드 투입</div>
        {/* TODO: 라디오버튼으로 선택 가능하게 */}
        <div>체크카드 잔액: 10000원</div>
        <div>신용카드 사용가능 한도: 5000원</div>
      </div>
      <div>
        <div>잔돈 반환</div>
        <div>잔돈: 0원</div>
        <button>수령하기</button>
      </div>
    </div>
  );
}
