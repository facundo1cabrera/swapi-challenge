import { App } from "aws-cdk-lib";
import { ApiGatewayStack } from "./stacks/ApiGatewayStack";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";


const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack', { starshipsTable: dataStack.starshipsTable, vehiclesTable: dataStack.vehiclesTable });
new ApiGatewayStack(app, 'ApiGatewayStack', {
    getVehicleLambdaIntegration: lambdaStack.getVehicleLambdaIntegration,
    incrementVehicleLambdaIntegration: lambdaStack.incrementVehicleLambdaIntegration,
    decrementVehicleLambdaIntegration: lambdaStack.decrementVehicleLambdaIntegration,
    setVehicleLambdaIntegration: lambdaStack.setVehicleLambdaIntegration,
    getStarshipLambdaIntegration: lambdaStack.getStarshipLambdaIntegration,
    incrementStarshipLambdaIntegration: lambdaStack.incrementStarshipLambdaIntegration,
    decrementStarshipLambdaIntegration: lambdaStack.decrementStarshipLambdaIntegration,
    setStarshipLambdaIntegration: lambdaStack.setStarshipLambdaIntegration 
});
