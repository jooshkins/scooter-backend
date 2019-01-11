import * as dynamoDbLib from "./libs/dynamodb-lib"
import { success, failure } from "./libs/response-lib"

export async function main(event, context, callback) {

  const data = JSON.parse(event.body);

  const setParams = {
      TableName: process.env.tableName,
      Key: {
        scooterId: event.pathParameters.scooterId,
      },
      UpdateExpression: "SET gpsArchive = :newGps",
      ExpressionAttributeValues:{
          ":newGps": [ data ]
      }
    };

  const clearParams = {
      TableName: process.env.tableName,
      Key: {
        scooterId: event.pathParameters.scooterId,
      },
      UpdateExpression: "SET gps = :clearGps",
      ExpressionAttributeValues:{
          ":clearGps": []
      }
    };

    try {
        await dynamoDbLib.call("update", setParams);
        try {
          await dynamoDbLib.call("update", clearParams)
          callback(null, success({ status: true }));
        } catch (e) {
          callback(null, failure({ status: false }));
        }
      } catch (e) {
        callback(null, failure({ status: false }));
      }
}