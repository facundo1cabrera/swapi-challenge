import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDocumentClient } from '../dataLayer/DynamoDocumentClient';
import { SwapiClient } from '../clients/SwapiClient';
import { InvalidIdError, NotFoundError, validateIdAsNumber } from '../shared/validator';

const dbClient = new DynamoDocumentClient();

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        validateIdAsNumber(event.pathParameters['id']);
        const id = parseInt(event.pathParameters['id']);
        const swapiClient = new SwapiClient(process.env.SWAPI_BASE_URL);

        const [dynamoDbResult, vehicleData] = await Promise.all([
            dbClient.getById(id),
            swapiClient.getVehicle(id)
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({amount: 0, ...dynamoDbResult.Item, ...vehicleData})
        }
    } catch (error) {
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
                    message: error.message
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