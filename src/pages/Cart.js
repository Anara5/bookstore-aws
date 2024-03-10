import React, { useContext } from "react";
import { CartContext } from "../context/cart";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { generateS3Url } from "../utils/awsUtils";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, total, decreaseAmount } = useContext(CartContext);

  if (!cart.length) {
    return (
      <section className="cart">
        <p className="cart-empty">Your cart is empty</p>
      </section>
    )
  }
  return (
    <section className="cart">
      <header>
        <h3>My Cart</h3>
      </header>
      <div className="cart-wrapper">
        
        {cart.map(({ id, title, price, image, amount }) => (
          <article key={id} className="cart-item">
            <div className="image">
              <img src={generateS3Url(image)} alt={title} />
            </div>
            <div className="details">
              <p className="title">{title}</p>
              <p className="price">{price} kr</p>
            </div>
            <div className="amount">
              <button onClick={() => decreaseAmount(id, amount)} className="btn-delete"><FiX /></button>
            </div>
          </article>
        ))}
      </div>
      <div>
        <h3>Total: {total} kr</h3>
      </div>
      <div>
        <button className="btn" onClick={() => navigate("/checkout")}>Checkout</button>
      </div>
    </section>
  );
};

export default Cart;
