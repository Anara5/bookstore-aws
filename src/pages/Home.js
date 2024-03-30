import React, { useState, useContext } from "react";
import Hero from "../components/Hero";
import { BookContext } from "../context/books";
import { generateS3Url } from "../utils/awsUtils";
import Modal from "../components/Modal";
import FeaturedBookDetails from "./FeaturedBookDetails";

const Home = () => {
    const { featured } = useContext(BookContext);
    const [selectedBook, setSelectedBook] = useState(null);

    const handleOpenModal = (id) => {
        setSelectedBook(id);
      };
    
    const handleCloseModal = () => {
        setSelectedBook(null);
    };
    
    return (
        <div className="home">
            <div className="home-page">
                <Hero />
            </div>
            <section className="featured">
                <header className="featured-head">
                    <h3>Featured Collection (free samples)</h3>
                </header>
                <div className="books featured-list">
                    {featured.map(({ id, image, title }) => (
                        <article key={id} className="book featured-book">
                            <div className="book-image">
                                {image.startsWith("images/") ? (
                                    <img src={generateS3Url(image)} alt={title} />
                                ) : (
                                    <img src={image} alt={title} />
                                )}
                            </div>
                            <button onClick={() => handleOpenModal({ id, image })} className="btn book-link">
                                Details
                            </button>
                        </article>
                    ))}
                </div>
                {selectedBook && (
                <Modal onClose={handleCloseModal} imageUrl={generateS3Url(selectedBook.image)}>
                    <FeaturedBookDetails id={selectedBook.id} imageUrl={generateS3Url(selectedBook.image)} />
                </Modal>
                )}
            </section>
        </div>  
    )
}

export default Home;