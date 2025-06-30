// 화폐 단위 타입
export interface CurrencyUnit {
  value: number; // 화폐 가치 (100, 500, 1000, 5000, 10000)
  count: number; // 개수
  total: number; // 해당 화폐의 총액 (value * count)
}

// 화폐 타입
export interface Money {
  tenThousand: CurrencyUnit; // 10000원권
  fiveThousand: CurrencyUnit; // 5000원권
  oneThousand: CurrencyUnit; // 1000원권
  fiveHundred: CurrencyUnit; // 500원권
  oneHundred: CurrencyUnit; // 100원권
  total: number; // 전체 총액
}

// 카드 타입
export interface Card {
  balance: number; // 잔액/한도
}

// 사용자 소유금 타입
export interface UserMoney {
  cash: Money;
  card: Card;
}

// 음료 상품 타입
export type ProductType = "커피" | "콜라" | "생수";

// 결제수단 타입
export type PaymentMethod = "cash" | "card";
export type CashUnit = 100 | 500 | 1000 | 5000 | 10000;

// 구매 단계 Enum
export enum VendingStep {
  SELECT_PRODUCT = "SELECT_PRODUCT",
  SELECT_PAYMENT = "SELECT_PAYMENT",
  INSERT_PAYMENT = "INSERT_PAYMENT",
  RETURN_CHANGE = "RETURN_CHANGE",
}

// 단계별 상태 타입
export interface SelectProductState {
  selectedProductNumber?: number;
  selectedProductType?: ProductType;
  selectedProductPrice?: number;
}

export interface SelectPaymentState {
  paymentMethod?: PaymentMethod;
}

export interface InsertPaymentState {
  cashInserted?: {
    units: Partial<Record<CashUnit, number>>;
    total: number;
  };
}

export interface ReturnChangeState {
  change?: {
    units: Partial<Record<CashUnit, number>>;
    total: number;
  };
}

// 전체 프로세스 상태
export interface VendingProcessState {
  step: VendingStep;
  selectProduct: SelectProductState;
  selectPayment: SelectPaymentState;
  insertPayment: InsertPaymentState;
  returnChange: ReturnChangeState;
}

// 자판기 재고 아이템 타입
export interface InventoryItem {
  name: ProductType;
  quantity: number;
  price: number;
  number: number;
}

// 자판기 타입
export interface VendingMachine {
  inventory: InventoryItem[];
  changeMoney: Money; // 거스름돈
}

// 화폐 가치에 따른 키 반환 함수
export const getMoneyKey = (value: number): keyof Omit<Money, "total"> => {
  switch (value) {
    case 10000:
      return "tenThousand";
    case 5000:
      return "fiveThousand";
    case 1000:
      return "oneThousand";
    case 500:
      return "fiveHundred";
    case 100:
      return "oneHundred";
    default:
      throw new Error(`Invalid currency value: ${value}`);
  }
};

// 총액 계산 함수
export const calculateTotal = (money: Omit<Money, "total">): number => {
  return Object.values(money).reduce((sum, unit) => {
    if (typeof unit === "object" && "total" in unit) {
      return sum + unit.total;
    }
    return sum;
  }, 0);
};

// 화폐 추가 함수
export const addMoney = (money: Money, value: number, count: number): Money => {
  const key = getMoneyKey(value);
  const updatedMoney = { ...money };
  updatedMoney[key] = {
    ...updatedMoney[key],
    count: updatedMoney[key].count + count,
    total: updatedMoney[key].value * (updatedMoney[key].count + count),
  };
  updatedMoney.total = calculateTotal(updatedMoney);
  return updatedMoney;
};

// 화폐 차감 함수
export const subtractMoney = (
  money: Money,
  value: number,
  count: number
): Money => {
  const key = getMoneyKey(value);
  const updatedMoney = { ...money };
  const newCount = Math.max(0, updatedMoney[key].count - count);
  updatedMoney[key] = {
    ...updatedMoney[key],
    count: newCount,
    total: updatedMoney[key].value * newCount,
  };
  updatedMoney.total = calculateTotal(updatedMoney);
  return updatedMoney;
};
