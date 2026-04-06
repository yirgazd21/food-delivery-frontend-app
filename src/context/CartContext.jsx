import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService';
import { getCurrentUser } from '../services/authService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const user = getCurrentUser();
    if (!user) {
      setCart({ items: [], total: 0 });
      setLoading(false);
      return;
    }
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (foodId, quantity) => {
    try {
      const data = await addToCart(foodId, quantity);
      setCart(data.cart);
      return true;
    } catch (error) {
      console.error('Add to cart failed', error);
      return false;
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const data = await updateCartItem(itemId, quantity);
      setCart(data.cart);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const data = await removeCartItem(itemId);
      setCart(data.cart);
    } catch (error) {
      console.error('Remove failed', error);
    }
  };

  const emptyCart = async () => {
    try {
      const data = await clearCart();
      setCart(data.cart);
    } catch (error) {
      console.error('Clear cart failed', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, emptyCart, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};