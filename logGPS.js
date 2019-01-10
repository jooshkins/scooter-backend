import * as dynamoDbLib from "./libs/dynamodb-lib"
import { success, failure } from "./libs/response-lib"

export async function main(event, context, callback) {

    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,
        Key: {
          scooterId: event.pathParameters.scooterId,
        },
        UpdateExpression: "SET gps = list_append(gps, :newGps)",
        ExpressionAttributeValues:{
            ":newGps": [ data ]
        }
      };

    try {
        await dynamoDbLib.call("update", params);
        callback(null, success({ status: true }));
      } catch (e) {
          console.log(e)
        callback(null, failure({ status: false }));
      }
}

