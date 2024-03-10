import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero">
            <h2>Wisdom Poems</h2>
            <h3>A room without poems is like a <br />body without a soul</h3>
            <Link className="btn-hero" to="/poems">View All Collections</Link>
        </section>
    )
}

export default Hero;
