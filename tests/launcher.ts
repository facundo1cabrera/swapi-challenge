import { handler } from '../src/services/vehicles/incrementVehicleAmountLambda';
handler({ pathParameters: { id: 4 }} as any, {} as any);