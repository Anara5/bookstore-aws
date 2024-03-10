import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { processOrder } from "../api/mutations";
import { graphqlOperation } from '@aws-amplify/api-graphql';
import { listBooks } from '../api/queries';
import { generateClient } from 'aws-amplify/api';
import awsConfig from '../aws-exports';

const client = generateClient();
const BookContext = React.createContext();

const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        awsConfig.aws_appsync_graphqlEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': awsConfig.aws_appsync_apiKey,
          },
          body: JSON.stringify({
            query: listBooks,
          }),
        }
      );
      const result = await response.json();
      
      const booksForSell = result.data.listBooks.items.filter(book => !book.featured);

      setBooks(booksForSell);

      const featured = result.data.listBooks.items.filter(book => !!book.featured);
      setFeatured(featured);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const checkout = async (orderDetails) => {
    const payload = {
      id: uuidv4(),
      ...orderDetails
    };
  
    try {
      await client.graphql(graphqlOperation(processOrder, {input: payload }));
      console.log("Order is successful", payload);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BookContext.Provider value={{ books, featured, loading, checkout }} >
      {children}
    </BookContext.Provider>
  );
};

export { BookContext, BookProvider };
