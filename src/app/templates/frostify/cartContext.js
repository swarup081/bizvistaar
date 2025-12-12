'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { businessData } from './data.js'; // Import data to find products by ID

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // Array: [{ id: 1, quantity: 2 }]
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('frostifyCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('frostifyCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Add new item
        return [...prevItems, { id: product.id, quantity: quantity }];
      }
    });
    triggerToast();
    openCart(); // Opens the drawer immediately
  };
  
  // Alias for adding single item
  const addItem = (product) => {
    addToCart(product, 1);
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevItems.filter(item => item.id !== productId);
      } else {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // --- Derived State (Rehydrating Data) ---

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Re-attach full product details (image, name, price) based on IDs
  const cartDetails = useMemo(() => {
    return cartItems.map(cartItem => {
      const product = businessData.allProducts.find(p => p.id === cartItem.id);
      if (!product) return null;
      return {
        ...product,
        quantity: cartItem.quantity,
      };
    }).filter(Boolean);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartDetails]);
  
  const shipping = subtotal > 0 ? 5.00 : 0; 
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const value = {
    cartItems,
    cartDetails,
    cartCount,
    subtotal,
    shipping,
    total,
    isCartOpen,
    showToast,
    addToCart,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);