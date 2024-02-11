import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDocumentClient } from '../dataLayer/DynamoDocumentClient';
import { InvalidIdError, JSONError, NotFoundError, validateIdAsNumber } from '../shared/validator';
import { parseJSON } from '../shared/utils';

const dbClient = new DynamoDocumentClient();

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        validateIdAsNumber(event.pathParameters['id']);
        const id = parseInt(event.pathParameters['id']);
        const dynamoDbResult = await dbClient.getById(id);

        const body = parseJSON(event.body);

        if (isNaN(parseInt(body['amount']))) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "amount must be a number"
                })
            }
        }

        if (dynamoDbResult.Item == null) {
            await dbClient.create({ id, amount: parseInt(body['amount']) });
        } else {
            await dbClient.update(id, "amount", parseInt(body['amount']))
        }
       
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        }
    } catch (error) {
        console.log(error);
        if (error instanceof JSONError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Unable to parse the body of the request"
                })
            }
        }
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
                    message: "The Starship with that Id does not exist"
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