import React from "react";
import { Button } from "./button";
import { Input } from "./input";

interface InputWithButtonProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onButtonClick: () => void;
  buttonText: string;
  buttonVariant?: "primary" | "secondary" | "action" | "success";
  buttonSize?: "sm" | "md" | "lg";
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const InputWithButton: React.FC<InputWithButtonProps> = ({
  label,
  value,
  onChange,
  onButtonClick,
  buttonText,
  buttonVariant = "action",
  buttonSize = "md",
  min = 0,
  max,
  step = 1,
  disabled = false,
  className,
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="text-sm font-medium text-gray-600">{label}</div>
      )}
      <div className="flex space-x-2">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={onButtonClick}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
