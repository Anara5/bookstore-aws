import React, { useContext, useState } from 'react';
import { BookContext } from '../context/books';
import { generateS3Url } from '../utils/awsUtils';
import Modal from '../components/Modal';
import BookDetails from './BookDetails';

const Books = () => {
    const { books } = useContext(BookContext);
    const [selectedBook, setSelectedBook] = useState(null);

    if (!books.length) {
        return <h3>No Books Available</h3>
    }

    const handleOpenModal = (id) => {
        setSelectedBook(id);
      };
    
    const handleCloseModal = () => {
        setSelectedBook(null);
    };

    return (
        <section className="books">
            {books.map(({ image, id, title }) => (
                <article key={id} className="book">
                    <div className="book-image">
                        {image.startsWith("images/") ? (
                            <img src={generateS3Url(image)} alt={title} />
                        ) : (
                            <img src={image} alt={title} />
                        )}
                    </div>
                    <button onClick={() => handleOpenModal({ id, image })} className="btn book-link">
                        details
                    </button>
                </article>
            ))}
            {selectedBook && (
                <Modal onClose={handleCloseModal} imageUrl={generateS3Url(selectedBook.image)}>
                    <BookDetails id={selectedBook.id} imageUrl={generateS3Url(selectedBook.image)} />
                </Modal>
            )}
        </section>
    )
}

export default Books;
