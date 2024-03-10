import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import CheckoutForm from "../components/CheckoutForm";

const Checkout = ({ onSubmit }) => {

    return (
        <section className="checkout-wrapper">
            <section>
                <h4>Time to Checkout?</h4>
                <CheckoutForm submit={onSubmit} />
            </section>
        </section>
    )
}

export default withAuthenticator(Checkout);
