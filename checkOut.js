import uuid from 'uuid';
import * as dynamoDbLib from "./libs/dynamodb-lib"
import { success, failure } from "./libs/response-lib"
import auth from "./config";
const Particle = require('particle-api-js');
const particle = new Particle();

export async function main(event, context, callback) {
    const params = {
        TableName: process.env.tableName,
        Key: {
          scooterId: event.pathParameters.scooterId,
        },
        UpdateExpression: "SET userId = :userId, checkOutTime = :checkOutTime, checkInTime = :checkInTime, requestID = :requestID, gps = :gps, gpsArchive = :gpsArchive",
        ExpressionAttributeValues: {
            ":userId":  event.requestContext.identity.cognitoIdentityId,
            ":checkOutTime":    Date.now(),
            ":checkInTime":     Date.now() + 1200000,
            ":requestID":   uuid.v1(),
            ":gps": [],
            ":gpsArchive": [] 
        }
      };
      try {
        await particle.callFunction({ deviceId: auth.deviceId, name: 'lock', argument: 'off', auth: auth.token });
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

