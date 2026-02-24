'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'albisht-cart';

const getInitialCart = () => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('خطأ في قراءة بيانات السلة', error);
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCart);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const count = items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    items,
    itemCount: count,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart يجب أن يُستخدم داخل CartProvider');
  }
  return context;
};

