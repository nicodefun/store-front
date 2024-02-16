"use client";
import React from "react";
import { useState, useEffect } from "react";
import { ContainerEl } from "@/components/ui/container-el";
import useCart from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import Summary from "@/components/summary";

export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  if (!isMounted) return null;
  return (
    <div className="bg-white">
    <ContainerEl>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
          <div className="lg:col-span-7">
            {cart.items.length === 0 && <p className="text-neutral-500">No items added to cart.</p>}
            <ul>
              {cart.items.map((item) => (
                <CartItem key={item.id} data={item} />
              ))}
            </ul>
          </div>
          <Summary />
        </div>
      </div>
    </ContainerEl>
  </div>
  );
};

export default CartPage;
