const randomBytes = require('crypto').randomBytes;
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = "Bookings"

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*'
  };

  // if (!event.requestContext.authorizer) {
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({
  //       Error: 'Authorization not configured',
  //       Reference: context.awsRequestId,
  //     }),
  //     headers
  //   };
  // }

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
        // const username = event.requestContext.authorizer.claims['cognito:username'];
        let requestBody = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: tableName,
            Item: {
              BookingId: bookingId,
              GuestName: requestBody.GuestName,
              CheckIn: new Date().toISOString(),
              CheckOut: new Date().toISOString(),
              Guests: requestBody.Guests,
              Rooms: requestBody.Rooms
            }
          })
          .promise();
        body = `Successfully created booking ${bookingId}`;
        break;
      case "PUT":
        let update = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: tableName,
            Item: {
              BookingId: update.BookingId,
              GuestName: update.GuestName,
              CheckIn: update.CheckIn || new Date().toISOString(),
              CheckOut: update.CheckOut || new Date().toISOString(),
              Guests: update.Guests,
              Rooms: update.Rooms
            }
          })
          .promise();
        body = `Successfully updated booking ${update.BookingId}`;
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
        body = `Successfully deleted booking ${event.pathParameters.bookingid}`;
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

  return {
    statusCode,
    body,
    headers
  };
};

function toUrlString(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}