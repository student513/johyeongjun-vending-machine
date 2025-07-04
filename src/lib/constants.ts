// 화폐 단위 정의
export const CASH_UNITS = [
  { key: "tenThousand", value: 10000 },
  { key: "fiveThousand", value: 5000 },
  { key: "oneThousand", value: 1000 },
  { key: "fiveHundred", value: 500 },
  { key: "oneHundred", value: 100 },
] as const;

// 화폐 값 상수 (개별 값으로도 접근 가능)
export const CASH_VALUES = {
  TEN_THOUSAND: 10000,
  FIVE_THOUSAND: 5000,
  ONE_THOUSAND: 1000,
  FIVE_HUNDRED: 500,
  ONE_HUNDRED: 100,
} as const;

// 화폐 키 상수
export const CASH_KEYS = {
  TEN_THOUSAND: "tenThousand",
  FIVE_THOUSAND: "fiveThousand",
  ONE_THOUSAND: "oneThousand",
  FIVE_HUNDRED: "fiveHundred",
  ONE_HUNDRED: "oneHundred",
} as const;

// 상품 정보 정의
export const PRODUCTS = {
  coffee: {
    name: "coffee",
    price: 700,
    number: 11,
    image: "/coffee.png",
  },
  coke: {
    name: "coke",
    price: 1100,
    number: 12,
    image: "/coke.png",
  },
  water: {
    name: "water",
    price: 600,
    number: 13,
    image: "/water.png",
  },
} as const;

// 상품 가격 정의 (기존 호환성을 위해 유지)
export const PRODUCT_PRICES = {
  coffee: PRODUCTS.coffee.price,
  coke: PRODUCTS.coke.price,
  water: PRODUCTS.water.price,
} as const;

// 상품 이름 정의 (기존 호환성을 위해 유지)
export const PRODUCT_NAMES = {
  coffee: PRODUCTS.coffee.name,
  coke: PRODUCTS.coke.name,
  water: PRODUCTS.water.name,
} as const;

// 상품 번호 정의
export const PRODUCT_NUMBERS = {
  coffee: PRODUCTS.coffee.number,
  coke: PRODUCTS.coke.number,
  water: PRODUCTS.water.number,
} as const;

// 상품 이미지 정의
export const PRODUCT_IMAGES = {
  coffee: PRODUCTS.coffee.image,
  coke: PRODUCTS.coke.image,
  water: PRODUCTS.water.image,
} as const;

// 상품 타입 정의
export const PRODUCT_TYPES = {
  COFFEE: "coffee",
  COKE: "coke",
  WATER: "water",
} as const;

// 자판기 기본 설정
export const VENDING_MACHINE_CONFIG = {
  // 초기 재고 수량
  INITIAL_INVENTORY: {
    coffee: 10,
    coke: 15,
    water: 20,
  },

  // 초기 거스름돈 수량
  INITIAL_CHANGE: {
    tenThousand: 5,
    fiveThousand: 10,
    oneThousand: 20,
    fiveHundred: 30,
    oneHundred: 50,
  },

  // 초기 사용자 현금 수량
  INITIAL_USER_CASH: {
    tenThousand: 2,
    fiveThousand: 1,
    oneThousand: 3,
    fiveHundred: 2,
    oneHundred: 5,
  },

  // 초기 카드 잔액
  INITIAL_CARD_BALANCE: 50000,
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  // 상품 선택 관련
  PRODUCT_NOT_SELECTED: "상품이 선택되지 않았습니다.",
  PRODUCT_NOT_EXISTS: "존재하지 않는 상품입니다. 관리자에게 문의하세요.",
  PRODUCT_OUT_OF_STOCK: "품절된 상품입니다. 관리자에게 문의하세요.",

  // 결제 관련
  CASH_INSUFFICIENT: (cashTotal: number, productPrice: number) =>
    `현금이 부족합니다. 보유 현금: ${cashTotal.toLocaleString()}원, 상품 가격: ${productPrice.toLocaleString()}원`,
  CARD_INSUFFICIENT: (cardBalance: number, productPrice: number) =>
    `카드 잔액이 부족합니다. 카드 잔액: ${cardBalance.toLocaleString()}원, 상품 가격: ${productPrice.toLocaleString()}원`,
  CARD_BALANCE_INSUFFICIENT: "카드 잔액이 부족합니다.",
  CARD_PAYMENT_FAILED: "카드 결제에 실패했습니다. 다시 시도해주세요.",

  // 거스름돈 관련
  CHANGE_INSUFFICIENT: "거스름돈이 부족합니다. 관리자에게 문의하세요.",
  CHANGE_INSUFFICIENT_WITH_RETURN:
    "거스름돈이 부족합니다. 투입된 금액을 반환합니다. 관리자에게 문의하세요.",
} as const;
