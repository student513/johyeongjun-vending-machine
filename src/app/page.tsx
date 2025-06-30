import Image from "next/image";

interface BeverageItemProps {
  src: string;
  alt: string;
  name: string;
  number: number;
}

const BeverageItem = ({ src, alt, name, number }: BeverageItemProps) => (
  <div className="bg-white border-2 border-solid p-4 rounded-xs flex flex-col items-center">
    <Image aria-hidden src={src} alt={alt} width={100} height={100} />
    <div>
      {number}.{name}
    </div>
  </div>
);

const beverages = [
  { src: "/coffee.png", alt: "Coffee icon", name: "커피", number: 11 },
  { src: "/coke.png", alt: "Coke icon", name: "콜라", number: 12 },
  { src: "/water.png", alt: "Water icon", name: "생수", number: 13 },
];

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center gap-4">
        {beverages.map((beverage) => (
          <BeverageItem
            key={beverage.name}
            src={beverage.src}
            alt={beverage.alt}
            name={beverage.name}
            number={beverage.number}
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
