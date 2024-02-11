import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table as DynamoTable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';

export class DataStack extends Stack {
    public readonly vehiclesTable: ITable;
    public readonly starshipsTable: ITable;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const suffix = getSuffixFromStack(this);

        this.starshipsTable = new DynamoTable(this, 'StarshipsTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.NUMBER,
            },
            tableName: `Starships-${suffix}`
        });

        this.vehiclesTable = new DynamoTable(this, 'VehiclesTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.NUMBER
            },
            tableName: `Vehicles-${suffix}`
        });
    }
}