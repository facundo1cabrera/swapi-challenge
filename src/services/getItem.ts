import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';


exports.main = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        body: JSON.stringify("Hello from lambda")
    }
}