// 현금 단위 정의
export const CASH_UNITS = [
  { key: "tenThousand", value: 10000 },
  { key: "fiveThousand", value: 5000 },
  { key: "oneThousand", value: 1000 },
  { key: "fiveHundred", value: 500 },
  { key: "oneHundred", value: 100 },
] as const;

// 상품 정보 정의
export const PRODUCTS = {
  coffee: {
    name: "커피",
    price: 700,
    number: 11,
    image: "/coffee.png",
  },
  coke: {
    name: "콜라",
    price: 1100,
    number: 12,
    image: "/coke.png",
  },
  water: {
    name: "생수",
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
