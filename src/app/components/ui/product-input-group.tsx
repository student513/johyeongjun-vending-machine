import React from "react";
import { InputWithButton } from "./input-with-button";

interface Product {
  name: string;
  price: number;
  quantity: number;
}

interface ProductInputGroupProps {
  products: Product[];
  onUpdate: (productName: string, newQuantity: number) => void;
  buttonVariant?: "primary" | "secondary" | "action" | "success";
  className?: string;
}

export const ProductInputGroup: React.FC<ProductInputGroupProps> = ({
  products,
  onUpdate,
  buttonVariant = "action",
  className,
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {products.map(({ name, price, quantity }) => (
        <InputWithButton
          key={name}
          label={`${name} (${price.toLocaleString()}원)`}
          value={quantity}
          onChange={(newQuantity) => onUpdate(name, newQuantity)}
          onButtonClick={() => onUpdate(name, quantity)}
          buttonText="수정"
          buttonVariant={buttonVariant}
        />
      ))}
    </div>
  );
};
