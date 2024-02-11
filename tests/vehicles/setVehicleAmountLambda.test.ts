import { handler } from '../../src/services/vehicles/setVehicleAmountLambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDocumentClient } from '../../src/services/dataLayer/DynamoDocumentClient';

describe('setVehicleAmountLambda Tests', () => {
  it('Should create a new item when ID does not exist', async () => {
    // Prepare
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: '123' },
        body: JSON.stringify({ amount: 5 }),
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

   
    const mockReturnValue = { Item: null };
    DynamoDocumentClient.prototype.getById = jest.fn().mockReturnValue(mockReturnValue);;
    DynamoDocumentClient.prototype.create = jest.fn();
    DynamoDocumentClient.prototype.update = jest.fn();
  
    // Act
    const result = await handler(mockEvent, null);

    // Assert
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(DynamoDocumentClient.prototype.getById).toHaveBeenCalledWith(123);
    expect(DynamoDocumentClient.prototype.create).toHaveBeenCalledWith({ id: 123, amount: 5 });
  });

  it('Should update an existing item when ID exists', async () => {
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: '123' },
        body: JSON.stringify({ amount: 5 }),
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

    const mockReturnValue = { Item: { id: 123, amount: 2 }};
    DynamoDocumentClient.prototype.getById = jest.fn().mockReturnValue(mockReturnValue);;
    DynamoDocumentClient.prototype.create = jest.fn();
    DynamoDocumentClient.prototype.update = jest.fn();
  
    // Act
    const result = await handler(mockEvent, null);

    // Assert
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(DynamoDocumentClient.prototype.getById).toHaveBeenCalledWith(123);
    expect(DynamoDocumentClient.prototype.update).toHaveBeenCalledWith(123, "amount", 5);
  });

  it('Should return 400 for invalid JSON in the request body', async () => {
    // Prepare
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: '123' },
        body: '{ invalid json', // Mocking request body with invalid JSON
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
      message: 'Unable to parse the body of the request'
    });
  });
});