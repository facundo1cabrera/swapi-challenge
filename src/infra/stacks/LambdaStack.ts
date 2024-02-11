import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface LambdaStackProps extends StackProps {
    vehiclesTable: ITable;
    starshipsTable: ITable; 
}


export class LambdaStack extends Stack {
    // Vehicles lambdas
    public readonly getVehicleLambdaIntegration: LambdaIntegration;
    public readonly incrementVehicleLambdaIntegration: LambdaIntegration;
    public readonly decrementVehicleLambdaIntegration: LambdaIntegration;
    public readonly setVehicleLambdaIntegration: LambdaIntegration;
    // Starships d
    public readonly getStarshipLambdaIntegration: LambdaIntegration;
    public readonly incrementStarshipLambdaIntegration: LambdaIntegration;
    public readonly decrementStarshipLambdaIntegration: LambdaIntegration;
    public readonly setStarshipLambdaIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const getVehicleLambda = new NodejsFunction(this, 'GetVehicleLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry:  join(__dirname, '..', '..', 'services', 'vehicles', 'getVehicleLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.vehiclesTable.tableName
            }
        })

        getVehicleLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.vehiclesTable.tableArn],
            actions: [
                'dynamodb:GetItem'
            ]
        }));

        const incrementVehicleLambda = new NodejsFunction(this, 'IncrementVehicleAmountLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'vehicles', 'incrementVehicleAmountLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.vehiclesTable.tableName
            }
        });

        incrementVehicleLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.vehiclesTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem'
            ]
        }));

        const decrementVehicleLambda = new NodejsFunction(this, 'DecrementVehicleAmountLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'vehicles', 'decrementVehicleAmountLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.vehiclesTable.tableName
            }
        });

        decrementVehicleLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.vehiclesTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem'
            ]
        }));

        this.getVehicleLambdaIntegration = new LambdaIntegration(getVehicleLambda);
        this.incrementVehicleLambdaIntegration = new LambdaIntegration(incrementVehicleLambda);
        this.decrementVehicleLambdaIntegration = new LambdaIntegration(getVehicleLambda);
        this.setVehicleLambdaIntegration = new LambdaIntegration(getVehicleLambda);

        this.getStarshipLambdaIntegration = new LambdaIntegration(getVehicleLambda);
        this.incrementStarshipLambdaIntegration = new LambdaIntegration(getVehicleLambda);
        this.decrementStarshipLambdaIntegration = new LambdaIntegration(getVehicleLambda);
        this.setStarshipLambdaIntegration = new LambdaIntegration(getVehicleLambda);
    }
}