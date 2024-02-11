import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiGatewayStackProps extends StackProps {
    // Vehicles lambdas
    getVehicleLambdaIntegration: LambdaIntegration;
    incrementVehicleLambdaIntegration: LambdaIntegration;
    decrementVehicleLambdaIntegration: LambdaIntegration;
    setVehicleLambdaIntegration: LambdaIntegration;
    // Starships lambdas
    getStarshipLambdaIntegration: LambdaIntegration;
    incrementStarshipLambdaIntegration: LambdaIntegration;
    decrementStarshipLambdaIntegration: LambdaIntegration;
    setStarshipLambdaIntegration: LambdaIntegration;
}

export class ApiGatewayStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'InventoryAPI');

        const inventoryResource = api.root.addResource("inventory");
        const vehiclesResource = inventoryResource.addResource("vehicles");
        const starshipResource = inventoryResource.addResource("starships");

        const vehiclesWithIdParamResource = vehiclesResource.addResource("{id}");
        const starshipsWithIdParamResource = starshipResource.addResource("{id}");

        vehiclesWithIdParamResource.addMethod('GET', props.getVehicleLambdaIntegration);
        vehiclesWithIdParamResource.addMethod('PUT', props.setVehicleLambdaIntegration);

        starshipsWithIdParamResource.addMethod('GET', props.getStarshipLambdaIntegration);
        starshipsWithIdParamResource.addMethod('PUT', props.setStarshipLambdaIntegration);

        const starshipsDecrementResource = starshipsWithIdParamResource.addResource("decrement");
        starshipsDecrementResource.addMethod('PATCH', props.decrementStarshipLambdaIntegration);
        const starshipsIncrementResource = starshipsWithIdParamResource.addResource("increment");
        starshipsIncrementResource.addMethod('PATCH', props.incrementStarshipLambdaIntegration);

        const vehiclesDecrementResource = vehiclesWithIdParamResource.addResource("decrement");
        vehiclesDecrementResource.addMethod('PATCH', props.decrementVehicleLambdaIntegration);
        const vehiclesIncrementResource = vehiclesWithIdParamResource.addResource("increment");
        vehiclesIncrementResource.addMethod('PATCH', props.incrementVehicleLambdaIntegration);
    }
}