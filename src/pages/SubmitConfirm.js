import React, { useEffect } from 'react';
import cat from '../assets/cat-typing.gif';
import { useNavigate } from 'react-router-dom';

const SubmitConfirm = ({ orderSubmitted }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (!orderSubmitted) {
          navigate("/");
        }
      }, [orderSubmitted, navigate]);

    return (
        <div className='submit-page'>
            <img src={cat} alt="Animated Emoji" style={{ width: '20rem', height: '20rem' }} />
            <h1>Thank you for your order!</h1>
            <p>You will get an email with order details.</p>
            <p style={{color: "grey", fontSize: "13px"}}>Please check your emails spam folder as well in case if email is not .</p>
        </div>
    )
}

export default SubmitConfirm;
