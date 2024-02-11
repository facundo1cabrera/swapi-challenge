import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IDbClient } from "./IDbClient";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { parseJSON } from "../shared/utils";

export class DynamoDocumentClient implements IDbClient {
    private dynamoDbClient: DynamoDBClient;
    private dynamoDbDocumentClient: DynamoDBDocumentClient;
    private tableName: string;

    constructor() {
        this.dynamoDbClient = new DynamoDBClient({});
        this.dynamoDbDocumentClient = DynamoDBDocumentClient.from(this.dynamoDbClient);
        this.tableName = process.env.DYNAMO_TABLE_NAME;
    }

    async create(item: any) {
        await this.dynamoDbDocumentClient.send(new PutCommand({
            TableName: this.tableName,
            Item: item
        }));
    }

    async getById(id: number) {
        const getResult = await this.dynamoDbDocumentClient.send(new GetCommand({
            TableName: this.tableName,
            Key: {
                id
            }
        }));
        return getResult;
    }
    
    async update(id: number, key: string, value: any) {

        const updateResult = await this.dynamoDbDocumentClient.send(new UpdateCommand({
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: `set ${key} = :value`,
            ExpressionAttributeValues: {
                ":value": value.toString()
            }
        }));

        return updateResult;
    }

}