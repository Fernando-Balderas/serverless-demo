const randomBytes = require('crypto').randomBytes;
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "Bookings"

exports.handler = async (event, context, callback) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  if (!event.requestContext.authorizer) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: 'Authorization not configured',
        Reference: context.awsRequestId,
      }),
      headers
    });
  }

  const username = event.requestContext.authorizer.claims['cognito:username'];

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters != null) {
          body = await dynamo
            .get({
              TableName: tableName,
              Key: {
                BookingId: event.pathParameters.bookingid
              }
            })
            .promise();
        } else {
          body = await dynamo.scan({ TableName: tableName }).promise();
        }
        break;
      case "POST":
        const bookingId = toUrlString(randomBytes(16));
        const requestBody = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: tableName,
            Item: {
              BookingId: bookingId,
              CognitoUser: username,
              GuestName: requestBody.GuestName,
              CheckIn: requestBody.CheckIn || new Date().toISOString(),
              CheckOut: requestBody.CheckOut || new Date().toISOString(),
              Guests: requestBody.Guests,
              Rooms: requestBody.Rooms
            }
          })
          .promise();
        body = {
          Message: `Successfully created booking`,
          BookingId: bookingId
        };
        break;
      case "PUT":
        const update = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: tableName,
            Item: {
              BookingId: update.BookingId,
              CognitoUser: username,
              GuestName: update.GuestName,
              CheckIn: update.CheckIn || new Date().toISOString(),
              CheckOut: update.CheckOut || new Date().toISOString(),
              Guests: update.Guests,
              Rooms: update.Rooms
            }
          })
          .promise();
        body = {
          Message: `Successfully updated booking`,
          BookingId: update.BookingId
        };
        break;
      case "DELETE":
        await dynamo
          .delete({
            TableName: tableName,
            Key: {
              BookingId: event.pathParameters.bookingid
            }
          })
          .promise();
        body = {
          Message: `Successfully deleted booking`,
          BookingId: event.pathParameters.bookingid
        };
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  callback(null, {
    statusCode,
    body,
    headers
  });
};

function toUrlString(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}