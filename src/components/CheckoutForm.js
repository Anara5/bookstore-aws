import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookContext } from "../context/books";
import { CartContext } from "../context/cart";
import { signOut } from 'aws-amplify/auth';

const CheckoutForm = ({ submit }) => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { checkout } = useContext(BookContext);
  const [orderDetails, setOrderDetails] = useState({ cart, total });
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleCardNumberChange = (event) => {
    const inputValue = event.target.value.replace(/ /g, '');
    if (!isNaN(inputValue)) {
      setError(null);
      const formattedCardNumber = inputValue
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);

      setCardNumber(formattedCardNumber);
    } else {
      setError("Invalid card number. Please enter only numbers.");
    }
  };

  const handleMonthChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue <= 12) {
      setError(null);
      setMonth(inputValue);
    } else {
      setError("Invalid month. Please enter a valid number between 1 and 12.");
    }
  };

  const handleYearChange = (event) => {
    const inputValue = event.target.value;
    const currentYear = new Date().getFullYear() % 100;
  
    if (!isNaN(inputValue) && inputValue.length <= 2 && parseInt(inputValue) >= currentYear) {
      setError(null);
      setYear(inputValue);
    } else {
      setError(`Invalid year. Please enter a valid two-digit year not earlier than ${currentYear}.`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!error) {
      setError(null);
      setOrderDetails({ ...orderDetails });      
      if (orderDetails.cart && orderDetails.total) {
        checkout(orderDetails);
        clearCart();
        submit();
        navigate("/submit");
        await signOut();
      }
    } else {
      setError("Error in form submission. Please check your inputs.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Total: {total} kr</h3>
      
      <div className="checkout-form">

        <p className="checkout-form-instructions">
          Test card number is any 16 digits. MM/YY is any later of todays, 
          CVC - any 3 digits.
        </p>

        <div className="stripe-section">
          <div>
            <span>Card Number</span>
            <input
              id="test-card"
              value={cardNumber}
              maxLength={19}
              onChange={handleCardNumberChange}
            />
          </div>
          
          <div className="stripe-date-cvc">
            <label>Expiry Date</label>
            <input
              id="month"
              placeholder="MM"
              maxLength={2}
              onChange={handleMonthChange}
            />
            <span>/</span>
            <input
              id="year"
              placeholder="YY"
              maxLength={2}
              onChange={handleYearChange}
            />
            <label>CVV</label>
            <input
              maxLength={3}
              defaultValue={"123"}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="card-errors" role="alert">
          {error}
        </div>
      </div>

      <button type="submit" className="btn">
        Submit Payment
      </button>
    </form>
  );
};

export default CheckoutForm;
