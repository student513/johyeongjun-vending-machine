import React from "react";
import { InputWithButton } from "./input-with-button";

interface MoneyInputGroupProps {
  moneyUnits: Array<{
    value: number;
    label: string;
    count: number;
  }>;
  onUpdate: (value: number, newCount: number) => void;
  className?: string;
}

export const MoneyInputGroup: React.FC<MoneyInputGroupProps> = ({
  moneyUnits,
  onUpdate,
  className,
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 ${className}`}
    >
      {moneyUnits.map(({ value, label, count }) => (
        <InputWithButton
          key={value}
          label={label}
          value={count}
          onChange={(newCount) => onUpdate(value, newCount)}
        />
      ))}
    </div>
  );
};
