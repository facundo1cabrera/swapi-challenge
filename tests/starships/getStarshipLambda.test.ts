import { handler } from '../../src/services/starships/getStarshipLambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDocumentClient } from '../../src/services/dataLayer/DynamoDocumentClient';
import { SwapiClient } from '../../src/services/clients/SwapiClient';
import { NotFoundError } from '../../src/services/shared/validator';

describe('getStarshipLambda Test suite', () => {
  it('Should return data when valid ID is provided', async () => {
    // Prepare
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: '123' },
        body: '{}',
        headers: {},
        multiValueHeaders: null,
        httpMethod: 'PATCH',
        isBase64Encoded: false,
        multiValueQueryStringParameters: null,
        path: '',
        queryStringParameters: null,
        requestContext: null,
        resource: null,
        stageVariables: null
    };

    const mockReturnValue = { Item: { id: '123', amount: '5' }};
    DynamoDocumentClient.prototype.getById = jest.fn().mockReturnValue(mockReturnValue);;

    const swapiMockResponse = { starshipName: 'Starship XYZ', otherAttribute: 'otherValue' };
    SwapiClient.prototype.getStarship = jest.fn().mockReturnValueOnce(swapiMockResponse);

    // Act
    const result = await handler(mockEvent, null);

    // Assert
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      amount: "5",
      id: '123',
      starshipName: 'Starship XYZ',
      otherAttribute: 'otherValue'
    });
  });

  it('Should return 400 when ID is not a number', async () => {
    // Prepare
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: 'abc' },
        body: '{}',
        headers: {},
        multiValueHeaders: null,
        httpMethod: 'PATCH',
        isBase64Encoded: false,
        multiValueQueryStringParameters: null,
        path: '',
        queryStringParameters: null,
        requestContext: null,
        resource: null,
        stageVariables: null
    };

    // Act
    const result = await handler(mockEvent, null);

    // Assert
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      message: 'The provided id should be a number'
    });
  });

  it('Should return 404 when Starship does not exist', async () => {
    // Prepare
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: '123' },
        body: '{}',
        headers: {},
        multiValueHeaders: null,
        httpMethod: 'PATCH',
        isBase64Encoded: false,
        multiValueQueryStringParameters: null,
        path: '',
        queryStringParameters: null,
        requestContext: null,
        resource: null,
        stageVariables: null
    };

    const mockReturnValue = { Item: { id: '123', amount: '5' }};
    DynamoDocumentClient.prototype.getById = jest.fn().mockReturnValue(mockReturnValue);;

    SwapiClient.prototype.getStarship = jest.fn().mockImplementation(() => {
        throw new NotFoundError("Starship with Id: 123 does not exist")
    });

    // Act
    const result = await handler(mockEvent, null);

    // Assert
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      success: false,
      message: 'Starship with Id: 123 does not exist'
    });
  });
});