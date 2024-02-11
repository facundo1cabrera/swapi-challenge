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

        const setVehicleAmountLambda = new NodejsFunction(this, 'SetVehicleAmountLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'vehicles', 'setVehicleAmountLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.vehiclesTable.tableName
            }
        });

        setVehicleAmountLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.vehiclesTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem'
            ]
        }));

        const getStarshipLambda = new NodejsFunction(this, 'GetStarshipLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry:  join(__dirname, '..', '..', 'services', 'starships', 'getStarshipLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.starshipsTable.tableName
            }
        })

        getStarshipLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.starshipsTable.tableArn],
            actions: [
                'dynamodb:GetItem'
            ]
        }));

        const incrementStarshipLambda = new NodejsFunction(this, 'IncrementStarshipAmountLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'starships', 'incrementStarshipAmountLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.starshipsTable.tableName
            }
        });

        incrementStarshipLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.starshipsTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem'
            ]
        }));

        const decrementStarshipLambda = new NodejsFunction(this, 'DecrementStarshipAmountLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'starships', 'decrementStarshipAmountLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.starshipsTable.tableName
            }
        });

        decrementStarshipLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.starshipsTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem'
            ]
        }));
        
        const setStarshipAmountLambda = new NodejsFunction(this, 'SetStarshipAmountLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'starships', 'setStarshipAmountLambda.ts'),
            environment: {
                DYNAMO_TABLE_NAME: props.starshipsTable.tableName
            }
        });

        setStarshipAmountLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.starshipsTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem'
            ]
        }));


        this.getVehicleLambdaIntegration = new LambdaIntegration(getVehicleLambda);
        this.incrementVehicleLambdaIntegration = new LambdaIntegration(incrementVehicleLambda);
        this.decrementVehicleLambdaIntegration = new LambdaIntegration(decrementVehicleLambda);
        this.setVehicleLambdaIntegration = new LambdaIntegration(setVehicleAmountLambda);

        this.getStarshipLambdaIntegration = new LambdaIntegration(getStarshipLambda);
        this.incrementStarshipLambdaIntegration = new LambdaIntegration(incrementStarshipLambda);
        this.decrementStarshipLambdaIntegration = new LambdaIntegration(decrementStarshipLambda);
        this.setStarshipLambdaIntegration = new LambdaIntegration(setStarshipAmountLambda);
    }
}