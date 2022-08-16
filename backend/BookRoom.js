//TODO: FIXIT IS NOT WORKING

const randomBytes = require('crypto').randomBytes;
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();
const ddbTableName = 'Bookings';

exports.handler = async (event, context, callback) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  // if (!event.requestContext.authorizer) {
  //   errorResponse('Authorization not configured', context.awsRequestId, headers, callback);
  //   return;
  // }

  try {
    console.log('Received event ', event.httpMethod);
    switch (event.httpMethod) {
      case "GET": {
        body = await ddb.scan({ TableName: ddbTableName }).promise();
        break;
      }

      // TODO: Get element by key
      // case "GET /items/{id}":
      //     body = await ddb
      //         .get({
      //             TableName: ddbTableName,
      //             Key: {
      //                 id: event.pathParameters.bookingId
      //             }
      //         })
      //         .promise();
      //     break;

      case "POST": {
        const bookingId = toUrlString(randomBytes(16));
        const username = event.requestContext.authorizer.claims['cognito:username'];
        const requestBody = JSON.parse(event.body);
        const { guests, rooms } = requestBody;
        statusCode = 201;
        body = {
          BookingId: bookingId,
          GuestName: username,
          CheckIn: new Date().toISOString(),
          CheckOut: new Date().toISOString(),
          Guests: guests,
          Rooms: rooms
        };
        await ddb.put({
          TableName: ddbTableName,
          Item: body,
        }).promise();
        break;
      }

      // case "PUT":
      //     break;

      case "DELETE": {
        console.log(event.pathParameters);
        console.log(typeof event.pathParameters);
        const { bookingId } = typeof event.pathParameters === 'string' ? JSON.parse(event.pathParameters) : event.pathParameters;
        console.log(bookingId);
        // TODO: Error: "The provided key element does not match the schema" Reference: "16cd0ad1-0d10-4a1d-823e-25aec4491668"
        await ddb
          .delete({
            TableName: ddbTableName,
            Key: {
              BookingId: bookingId
            }
          })
          .promise();
        body = `Deleted item ${bookingId}`;
        break;
      }

      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    console.error(err);
    errorResponse(err.message, context.awsRequestId, headers, callback)
  } finally {
    body = JSON.stringify(body);
  }

  validResponse(
    statusCode,
    body,
    headers,
    callback
  )
};

function toUrlString(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function validResponse(statusCode, body, headers, callback) {
  // You can use the callback function to provide a return value from your Node.js
  // Lambda functions. The first parameter is used for failed invocations. The
  // second parameter specifies the result data of the invocation.

  // Because this Lambda function is called by an API Gateway proxy integration
  // the result object must use the following structure.
  callback(null, {
    statusCode,
    body,
    headers
  });
}

function errorResponse(errorMessage, awsRequestId, headers, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers
  });
}
