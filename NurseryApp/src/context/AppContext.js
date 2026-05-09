import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = useCallback((plant, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === plant.id);
      if (existing) {
        return prev.map(i => i.id === plant.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...plant, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isInWishlist = useCallback((id) => wishlist.some(p => p.id === id), [wishlist]);

  const toggleWishlist = useCallback((plant) => {
    setWishlist(prev =>
      prev.some(p => p.id === plant.id)
        ? prev.filter(p => p.id !== plant.id)
        : [...prev, plant]
    );
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      cart, wishlist,
      addToCart, removeFromCart, updateQty, clearCart,
      toggleWishlist, isInWishlist,
      cartCount, cartTotal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
