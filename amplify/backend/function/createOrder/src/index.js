const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const s3 = new AWS.S3();
const nodemailer = require('nodemailer');
const USER_POOL_ID = "eu-north-1_g40ETxAKd";
const ORDER_TABLE = "Order-g2rfyxwvvzg6dcioom2lkf3ff4-prod";
const ORDER_TYPE = "Order";
const BOOK_ORDER_TABLE = "BookOrder-g2rfyxwvvzg6dcioom2lkf3ff4-prod";
const BOOK_ORDER_TYPE = "BookOrder";
const bucketName = "bookstoretest6e1d47d4ab9c4ca6a5537dde5ff5d7e9211807-prod";

const getUserEmail = async (event) => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: event.identity.claims.username
  };
  const user = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
  const { Value: email } = user.UserAttributes.find((attr) => {
    if (attr.Name === "email") {
      return attr.Value;
    }
  });
  return email;
};

const createOrder = async (payload) => {
  try {
    const { order_id, total, email } = payload;

    const orderParams = {
      TableName: ORDER_TABLE,
      Item: {
        id: order_id,
        __typename: ORDER_TYPE,
        customer: email,
        total: total,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    };

    await documentClient.put(orderParams).promise();
    await createBookOrder({ ...payload, order_id });

    return "SUCCESS";
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

const createBookOrder = async (payload) => {
  try {
    let bookOrders = [];
    for (i = 0; i < payload.cart.length; i++) {
      const cartItem = payload.cart[i];
      bookOrders.push({
        PutRequest: {
          Item: {
            id: uuidv4(),
            __typename: BOOK_ORDER_TYPE,
            book_id: cartItem.id,
            book_title: cartItem.title,
            order_id: payload.order_id,
            customer: payload.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
    }

    let params = {
      RequestItems: {}
    };

    params["RequestItems"] = { [BOOK_ORDER_TABLE]: bookOrders };
    await documentClient.batchWrite(params).promise();
  } catch (error) {
    console.error("Error in createBookOrder:", error);
    throw error;
  }
};

const base64encode = async (bucket, key) => {
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const { Body } = await s3.getObject(params).promise();
    return Body.toString('base64');
  } catch (error) {
    console.error('Error in base64encode:', error);
    throw error;
  }
};

const checkVerifiedEmail = async (email) => {
  try {
    const params = {
      Identities: [email]
    };

    const SES = new AWS.SES({ region: 'eu-north-1', apiVersion: '2010-12-01' });
    const data = await SES.getIdentityVerificationAttributes(params).promise();

    const verificationAttributes = data.VerificationAttributes;
    return (
      verificationAttributes &&
      verificationAttributes[email] &&
      verificationAttributes[email].VerificationStatus === "Success"
    );
  } catch (error) {
    console.error("Error in checkVerifiedEmail:", error);
    throw error;
  }
};

const sendEmail = async (payload, isUserVerified, anarikEmailAddress) => {
  try {
    const toEmailAddress = isUserVerified ? payload.email : anarikEmailAddress;

    const attachments = await Promise.all(payload.cart.map(async (book) => {
    const content = await base64encode(bucketName, 'public/' + book.pdfdoc);
      return {
        filename: `${book.title}.pdf`,
        content: Buffer.from(content, 'base64'),
        encoding: 'base64',
        contentType: 'application/pdf',
      };
    }));

    const message = {
      from: anarikEmailAddress,
      to: toEmailAddress,
      subject: 'Order Confirmation',
      text: `Thank you for your order! Your order ID is ${payload.order_id}.
        \nYour order details:
        \n- Username: ${payload.email}
        \n${payload.cart.map(book => `- Title: ${book.title}, Price: ${book.price} kr`).join('\n')}
        \nTotal: ${payload.total} kr.
        \nThe payment was a test and no real money was transferred.
        \nYou could donate to the developer by sending real money to the developer's Swish number: +46 765868550.`,
      attachments,
    }

    const transporter = nodemailer.createTransport({
      SES: new AWS.SES({ region: 'eu-north-1' }),
    });

    await transporter.sendMail(message);

    return "SUCCESS";
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw error;
  }
};

exports.handler = async (event) => {
  try {
    const { id, cart, total } = event.arguments.input;
    //const { username } = event.identity.claims;
    const userEmailAddress = await getUserEmail(event);
    const anarikEmailAddress = "anarikrulit@gmail.com";    
    
    const payload = { order_id: id, cart, total, email: userEmailAddress };

    await createOrder(payload);
    const isUserVerified = await checkVerifiedEmail(userEmailAddress);
    await sendEmail(payload, isUserVerified, anarikEmailAddress);
    
    return "SUCCESS";
  } catch (err) {
    console.error("Error in handler:", err);
    throw new Error(err);
  }
};
