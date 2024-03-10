import React, { useEffect, useState } from 'react';
import { withAuthenticator, View, TextField, Button, Flex, CheckboxField } from '@aws-amplify/ui-react';
import { v4 as uuidv4 } from 'uuid';
import { signOut } from 'aws-amplify/auth';
import awsConfig from '../aws-exports';
import { uploadData, remove } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import { listBooks } from '../api/queries';
import { createBook as createBookMutation, deleteBook as deleteBookMutation } from '../api/mutations';
import { generateClient } from 'aws-amplify/api';
import { generateS3Url } from '../utils/awsUtils';

Amplify.configure(awsConfig);
const client = generateClient();

const Admin = () => {
    
    const [books, setBooks] = useState([]);

    const handleSignOut = async (event) => {
        event.preventDefault();
        await signOut();
    }

    const createBook = async (event) => {
        try {
          event.preventDefault();
          const form = new FormData(event.target);
      
          // Handle image upload
          const image = form.get("image");
          const imageKey = `images/${uuidv4()}${image.name}`;
          const imageUrl = generateS3Url(imageKey);
          uploadData({ key: imageKey, data: image });
      
          // Handle PDF upload
          const pdfdoc = form.get("pdfdoc");
          const pdfKey = `pdfdocs/${uuidv4()}${pdfdoc.name}`;
          uploadData({ key: pdfKey, data: pdfdoc });
      
          const data = {
            title: form.get("title"),
            description: form.get("description"),
            image: imageKey,
            pdfdoc: pdfKey,
            author: form.get("author"),
            price: parseFloat(form.get("price")),
            featured: event.target.featured.checked,
          };
          await client.graphql({
            query: createBookMutation,
            variables: { input: data },
            });
            
          const uploadedBook = {
            ...data,
            image: imageUrl,
            id: uuidv4(),
            featured: JSON.parse(form.get("featured")),
          };
      
          setBooks([...books, uploadedBook]);
          event.target.reset();
          await fetchBooks();
        } catch (err) {
          console.error('Error creating book:', err);
        }
      };
    
    const fetchBooks = async () => {
        try {
            const booksData = await client.graphql({ query: listBooks });
            const books = booksData.data.listBooks.items;
            setBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    useEffect(() => {
        fetchBooks();
    }
    , []);

    const deleteBook = async (event, bookId) => {
        try {
            event.preventDefault();
    
            // Check if bookId is found before proceeding
            if (!bookId) {
                console.error('Book ID not found.');
                return;
            }
    
            const book = books.find(book => book.id === bookId);
    
            // Check if book is found before proceeding
            if (!book) {
                console.error(`Book with ID ${bookId} not found.`);
                return;
            }
    
            const key = book.image;
            const pdfKey = book.pdfdoc;
    
            // Delete the book from the database
            await client.graphql({
                query: deleteBookMutation,
                variables: { input: { id: bookId } },
            });
    
            // Delete the image from S3
            if (key) {
                await remove({ key });
            } else {
                console.error(`Image key not found for book with ID ${bookId}.`);
            }
        
            // Delete the PDF from S3
            if (pdfKey) {
                await remove({ key: pdfKey });
            } else {
                console.error(`PDF key not found for book with ID ${bookId}.`);
            }
    
            // Update the state to remove the deleted book
            const updatedBooks = books.filter(book => book.id !== bookId);
            setBooks(updatedBooks);
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };
    
    return (
        <section className="admin-wrapper">
            <header className="form-header">
                <h3>Add New Poems</h3>
                <button className="btnSignOut" onClick={handleSignOut}>Sign out</button>
            </header>
            <View as="form" margin="4rem 0" onSubmit={createBook}>
                <Flex direction="column" justifyContent="center" className="form-wrapper">
                    <p htmlFor="image">Upload Image:</p>
                    <View
                        name="image"
                        as="input"
                        type="file"
                        accept="image/png/jpeg/jpg"
                        required
                        style={{ alignSelf: "start", fontSize: "2rem", marginBottom: "2rem", color: "#5f3a8f" }}
                    />
                    <p htmlFor="pdfdoc">Upload PDF document:</p>
                    <View 
                        name="pdfdoc"
                        as="input"
                        type="file"
                        accept="application/pdf"
                        required
                        style={{ alignSelf: "start", fontSize: "2rem", marginBottom: "2rem", color: "#5f3a8f" }}
                    />
                    <TextField
                        name="title"
                        placeholder="Collection Title"
                        label="Book Title"
                        labelHidden
                        variation="quiet"
                        required
                        className="input-title"
                        style={{ fontSize: "2.5rem" }}
                    />
                    <TextField
                        name="description"
                        placeholder="Note Description"
                        label="Note Description"
                        labelHidden
                        variation="quiet"
                        required
                        style={{ fontSize: "2rem" }}
                    />
                    <TextField
                        name="author"
                        placeholder="Author"
                        label="Author"
                        labelHidden
                        variation="quiet"
                        required
                        style={{ fontSize: "2rem" }}
                    />
                    <TextField
                        name="price"
                        placeholder="Price"
                        label="Price"
                        labelHidden
                        variation="quiet"
                        required
                        style={{ fontSize: "2rem" }}
                    />
                    <CheckboxField
                        name="featured"
                        label="Featured"
                        type='checkbox'
                        value={false}
                    />                    
                    <Button type="submit" color="primary" className="submit-form">
                        Submit
                    </Button>
                </Flex>
            </View>
            <div className="admin-books-wrapper">
                {books.map((book) => {
                    if (book && book.image) {
                        return (
                            <div className="book" key={book.id}>
                                <img src={generateS3Url(book.image)} alt={book.title} />
                                <div className="admin-book-details">
                                    <h3>{book.title}</h3>
                                    <h4>{book.author}</h4>
                                    <p>{book.description}</p>
                                    <p>{book.price} SEK</p>
                                    <p>{book.featured ? 'Featured' : ''}</p>
                                </div>
                                <Button color="primary" onClick={(event) => deleteBook(event, book.id)}>Delete</Button>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>      
        </section>
    )
}

export default withAuthenticator(Admin);