# Getting Started with Create React App

The project is called Bookstore, where users can place orders and download collections of poems.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Run

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Project Description

### Backend

The backend is configured using various AWS cloud services:

- **AppSync**: Used for building scalable and secure GraphQL APIs.
- **IAM**: Identity and Access Management for secure authentication and authorization.
- **S3**: Used for storing images and PDF files of the database items.
- **SES (Simple Email Service)**: Assists Lambda functions in sending emails to users regarding their book orders.
- **DynamoDB**: NoSQL database used for storing data efficiently.
- **Cognito**: Handles user authentication and authorization.
- **Node.js**: Empowers the backend with JavaScript runtime for building scalable and efficient server-side applications.
- **AWS Lambda**: Serverless compute service used to execute backend functions, such as creating orders and handling email notifications.
- **Amplify and GraphQL**: Facilitate communication between the backend and frontend.


### Frontend

The frontend is implemented using React JS, accompanied by additional tech tools for styling. While the main focus is on cloud services and infrastructure, the frontend complements the overall user experience.

### Deployment

The project is deployed on AWS. You can access the deployed project [here](https://prod.d2qdwj4bs05kdb.amplifyapp.com).
