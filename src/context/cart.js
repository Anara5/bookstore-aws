import React, { useState, useEffect } from "react";

const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load cart from local storage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Update total whenever cart changes
  useEffect(() => {
    const updatedTotal = cart.reduce((total, { amount, price }) => total + amount * price, 0);
    setTotal(parseFloat(updatedTotal.toFixed(2)));
  }, [cart]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const total = [...cart].reduce((total, { amount, price }) => {
      return (total += amount * price);
    }, 0);
    setTotal(parseFloat(total.toFixed(2)));
  }, [cart]);

  const increaseAmount = (id) => {
    const updatedCart = [...cart].map((item) => {
      return item.id === id ? { ...item, amount: item.amount + 1 } : item;
    });
    setCart(updatedCart);
  };

  const decreaseAmount = (id, amount) => {
    let updatedCart = [];
    if (amount === 1) {
      // If the quantity is 1, remove the book from the cart
      updatedCart = cart.filter((item) => item.id !== id);
    } else {
      // If the quantity is greater than 1, decrease the quantity
      updatedCart = cart.map((item) =>
        item.id === id ? { ...item, amount: item.amount - 1 } : item
      );
    }
    setCart(updatedCart);
  };

  const addToCart = (book) => {
    const { id, title, price, image, pdfdoc } = book;
    const cartItem = [...cart].find((item) => item.id === id);
    if (cartItem) {
      // increaseAmount(id);
    } else {
      const cartItems = [...cart, { id, title, image, pdfdoc, price, amount: 1 }];
      setCart(cartItems);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, increaseAmount, decreaseAmount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
