import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import auth from "./config";
const Particle = require('particle-api-js');
const particle = new Particle();

export async function main(event, context, callback) {
  const params = {
    TableName: process.env.tableName,
    Key: {
      scooterId: event.pathParameters.scooterId
    },
    UpdateExpression: "SET checkInTime = :checkInTime",
    ExpressionAttributeValues: {
      ":checkInTime": Date.now()
    }
  };

  try {
    await particle.callFunction({ deviceId: auth.deviceId, name: 'lock', argument: 'on', auth: auth.token });
    try {
      await dynamoDbLib.call("update", params);
      callback(null, success({ status: true }));
    } catch (e) {
      callback(null, failure({ status: false }));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}