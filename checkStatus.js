import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        scooterId: event.pathParameters.scooterId
      }
    };

    try {
      const result = await dynamoDbLib.call("get", params);
      const userId = event.requestContext.identity.cognitoIdentityId
      const chkTime = result.Item.checkInTime
      const lockOut = 7200000

      if (result.Item.userId === userId) {
        if (chkTime + lockOut <= Date.now()) {
          callback(null, success({status: true}))
        
        } else {
          const nextTime = chkTime + lockOut
          callback(null, success({ status: true, nextTime: nextTime }))
        }
      } 
      
      else if (result.Item.userId !== userId && chkTime <= Date.now()) {
        callback(null, success({ status: true }))
      }
      
      else {
        callback(null, success({ status: false }))
      }

    } catch (e) {
      callback(null, failure({ status: false }));
    }
  }