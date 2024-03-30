import React, { useContext } from "react";
import { BookContext } from "../context/books";
import swish from "../assets/swish.png";
import { generateS3Url } from './../utils/awsUtils';

const FeaturedBookDetails = ({ id, imageUrl }) => {
  const { featured } = useContext(BookContext);

  const book = featured.find((book) => {
    return book.id === id;
  });
  if (!book) {
    return <h3>Loading...</h3>;
  }

  const { title, description, author, pdfdoc } = book;

  const parts = pdfdoc.split('/');
  const fileNameWithUuid = parts[1]; // Get the part after the slash
  const fileNameWithoutUuid = fileNameWithUuid.slice(36);

  const handleDownload = async () => {
    try {
      // Fetch the file from the S3 bucket
      const response = await fetch(generateS3Url(pdfdoc));

      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Extract the blob content from the response
      const blob = await response.blob();

      // Create a temporary link element to trigger the file download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileNameWithoutUuid;
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the link element
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <section className="book-details">
      <div className="detail-image">
        <img className="book-image-img" src={imageUrl} alt="Book Cover" />
      </div>
      <div className="detail-description">
        <h2>{title}</h2>
        <p>{description}</p>
        <h3>{author}</h3>

        <div className="swish-details">
          For support you can make some donation via <img src={swish} alt="swish icon" className="swish" /> to number: <p> 0765868550</p>
        </div>
        
        <button
          className="btn"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </section>
  );
};

export default FeaturedBookDetails;
