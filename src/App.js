import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Error from "./pages/Error";
import Books from "./pages/Books";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BookDetails from "./pages/BookDetails";
import Admin from './pages/Admin';
import SubmitConfirm from './pages/SubmitConfirm';
import Header from "./components/Header";

function App() {
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleOrderSubmit = () => {
    setOrderSubmitted(true);
  };
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout onSubmit={handleOrderSubmit} />} />
        <Route exact path="/poems" element={<Books />} />
        <Route
          path="/poems/:id"
          element={<BookDetails />}
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Error />} />
        <Route path="/submit" element={<SubmitConfirm orderSubmitted={orderSubmitted} />} />
      </Routes>
    </Router>
  );
}

export default App;
