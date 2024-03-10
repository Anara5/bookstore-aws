import React from 'react';
import { FiMail } from 'react-icons/fi';

const Hero = () => {
    return (
        <section className="contacts">
            <a href='mailto:alexandergustafsson83@gmail.com'><FiMail /> <span>Send an email</span></a>
        </section>
    )
}

export default Hero;