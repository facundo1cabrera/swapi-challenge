import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDocumentClient } from '../dataLayer/DynamoDocumentClient';
import { InvalidIdError, NotFoundError, validateIdAsNumber } from '../shared/validator';

const dbClient = new DynamoDocumentClient();

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        validateIdAsNumber(event.pathParameters['id']);
        const id = parseInt(event.pathParameters['id']);
        const dynamoDbResult = await dbClient.getById(id);

        if (dynamoDbResult.Item == null) {
            // If the item does not exist in the inventory (the DynamoDB table), we return BadRequest.
            // A user should not be able to decrement a nonexistent amount.
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: `Amount for vehicle with id: ${id} is already 0`})
            }
        } else {
            if (parseInt(dynamoDbResult.Item.amount) <= 0) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, message: `Amount for vehicle with id: ${id} is already 0`})
                }
            }
            const newAmount = parseInt(dynamoDbResult.Item.amount) - 1;
            await dbClient.update(id, "amount", newAmount)
        }
       
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        }
    } catch (error) {
        console.log(error);
        if (error instanceof InvalidIdError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "The provided id should be a number"
                })
            }
        }

        if (error instanceof NotFoundError) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    success: false,
                    message: "The vehicle with that Id does not exist"
                })
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Internal server error. Please try again later"
            })
        }
    }
}