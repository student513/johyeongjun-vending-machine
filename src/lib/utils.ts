import { CASH_UNITS } from "@/lib/constants";
import { Money, getMoneyKey } from "@/types/vending-machine";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 가장 적은 거스름돈이 발생하는 최적의 현금 투입 조합을 계산
 * @param price 상품 가격
 * @param userCash 사용자의 현금 (Money 타입)
 * @returns { insert: Record<string, number>, totalInserted: number, change: number } | null
 */
export function getOptimalCashInsert(
  price: number,
  userCash: Money
): {
  insert: Record<string, number>;
  totalInserted: number;
  change: number;
} | null {
  const units = CASH_UNITS.map((u) => u.value);
  const userCounts = units.map((v) => userCash[getMoneyKey(v)].count);

  function dfs(
    idx: number,
    insert: number[],
    sum: number,
    best: { insert: number[]; total: number; change: number } | null
  ): { insert: number[]; total: number; change: number } | null {
    if (idx === units.length) {
      if (sum >= price) {
        const change = sum - price;
        if (
          best === null ||
          change < best.change ||
          (change === best.change &&
            insert.reduce((a, b) => a + b, 0) <
              best.insert.reduce((a, b) => a + b, 0))
        ) {
          return { insert: [...insert], total: sum, change };
        }
      }
      return best;
    }
    for (let cnt = 0; cnt <= userCounts[idx]; cnt++) {
      insert[idx] = cnt;
      best = dfs(idx + 1, insert, sum + units[idx] * cnt, best);
    }
    return best;
  }

  const best = dfs(0, Array(units.length).fill(0), 0, null);
  if (!best) return null;
  const result: Record<string, number> = {};
  for (let i = 0; i < units.length; i++) {
    result[getMoneyKey(units[i])] = best.insert[i];
  }
  return {
    insert: result,
    totalInserted: best.total,
    change: best.change,
  };
}
