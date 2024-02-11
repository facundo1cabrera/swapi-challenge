import { handler } from '../../src/services/vehicles/decrementVehicleAmountLambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDocumentClient } from '../../src/services/dataLayer/DynamoDocumentClient';

describe('DecrementVehicleAmountLambda Tests', () => {
  it('Should decrement the amount successfully', async () => {
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
    const mockMethod = jest.fn().mockReturnValue(mockReturnValue);
    
    DynamoDocumentClient.prototype.getById = mockMethod;
    DynamoDocumentClient.prototype.update = jest.fn();

    // Act
    const result = await handler(mockEvent, null);
    
    // Assert
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(DynamoDocumentClient.prototype.update).toHaveBeenCalled();
  });

  it('Should return 400 if amount is already 0', async () => {
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
    const mockReturnValue = { Item: { id: '123', amount: '0' }};
    const mockMethod = jest.fn().mockReturnValue(mockReturnValue);
    
    DynamoDocumentClient.prototype.getById = mockMethod;
    DynamoDocumentClient.prototype.update = jest.fn();

    // Act
    const result = await handler(mockEvent, null);
    
    // Assert
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ success: false, message: 'Amount for vehicle with id: 123 is already 0' });
  });

  it('Should return 400 if the provided id is not a number', async () => {
    // Prepare
    const mockEvent: APIGatewayProxyEvent = {
        pathParameters: { id: 'abc' }, // Providing non-numeric id
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
    expect(JSON.parse(result.body)).toEqual({ success: false, message: 'The provided id should be a number' });
  });
});