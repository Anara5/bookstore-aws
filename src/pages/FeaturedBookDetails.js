import React, { useContext } from "react";
import { BookContext } from "../context/books";
import swish from "../assets/swish.png";
import awsConfig from '../aws-exports';
const sdk = require('aws-sdk');

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
      const s3 = new sdk.S3({
        region: 'eu-north-1',
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
        },
      });
      const bucketName = awsConfig.aws_user_files_s3_bucket;
      const objectKey = 'public/' + pdfdoc;
      const response = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
  
      const blob = new Blob([response.Body], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileNameWithoutUuid;
      document.body.appendChild(link);
      link.click();
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
