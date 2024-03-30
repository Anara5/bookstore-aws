import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Contacts from './Contacts';
import { FiBook } from 'react-icons/fi';
import { CartContext } from "../context/cart";

const Header = () => {
    const { cart } = useContext(CartContext);
    const [cartItemCount, setCartItemCount] = useState(cart.length);
    const [showStars, setShowStars] = useState(true);

    useEffect(() => {
    setCartItemCount(cart.length);
    setShowStars(true);

    const animationDuration = 500;
    setTimeout(() => {
        setShowStars(false);
    }, animationDuration);
}, [cart]);

    return (
        <header className="main-head">
            <Contacts />
            <nav>
                <h1 id="logo">Alexander Gustafsson</h1>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/poems">Poems</Link>
                    </li>
                    <li>
                        <Link to="/cart" className={`cart-icon ${showStars ? 'animate' : ''}`}>
                            <FiBook /> 
                            <span className="cart-count">cart: {cartItemCount}</span>
                            {showStars && (
                                <div className="star-splash-container">
                                    {[1, 2, 3].map((index) => (
                                        <div className="star-splash" key={index}></div>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
