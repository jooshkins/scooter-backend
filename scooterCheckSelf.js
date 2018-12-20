import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "scooters",
        Key: {
            scooterId: event.pathParameters.scooterId
        }
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        const checkIn = result.Item.checkInTime

        Date.now() <= checkIn 
            ? callback(null, success({ status: true }))
            : callback(null, failure({ status: false }));

    } catch (e) {
        callback(null, failure({ status: false }));
    }
}