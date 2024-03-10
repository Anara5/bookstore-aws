import React, { useContext } from "react";
import { BookContext } from "../context/books";
import { CartContext } from "../context/cart";

const BookDetails = ({ id, imageUrl }) => {
  const { books } = useContext(BookContext);
  const { addToCart } = useContext(CartContext);

  const book = books.find((book) => {
    return book.id === id;
  });
  if (!book) {
    return <h3>Loading...</h3>;
  }

  const { title, description, author, price } = book;
  
  return (
    <section className="book-details">
      <div className="detail-image">
        <img className="book-image-img" src={imageUrl} alt="Book Cover" />
      </div>
      <div className="detail-description">
        <h2>{title}</h2>
        <p>{description}</p>
        <h3>{author}</h3>
        <h4>Price - kr {price}</h4>
        <button
          className="btn"
          onClick={() => {
            addToCart({ ...book, id });
          }}
        >
          Add to Cart
        </button>
      </div>
    </section>
  );
};

export default BookDetails;
