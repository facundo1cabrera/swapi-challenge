
# Star Wars API Inventory Management
This project extends the capabilities of the Star Wars API (SWAPI) to manage the inventory of starships and vehicles. It allows users to interact with the API to get, set, increment, and decrement the total number of units for specific starships or vehicles.

## Instructions:
SWAPI provides information about the Star Wars universe. Extend this API to manage the inventory of starships and vehicles.

- consume the information from SWAPI: https://swapi.dev/documentation for starships and vehicles extend the data model and implement functionality to keep track of the amount of units for starships and vehicles. This
can be achieved by adding the count property.
- allow to get the total number of units for a specific starship or vehicle
Example: get how many Death Stars are in the inventory of starships
- allow to set the total number of units for a specific starship or vehicle
Example: set the number Death Stars in the inventory of starships
- allow to increment the the total number of units for a specific starship or vehicle
Example: increment by x units the number Death Stars in the inventory for starships
- allow to decrement the the total number of units for a specific starship or vehicle
Example: decrement by x units the number Death Stars in the inventory for starships

## Technical requirements:
- Implement the solution using js or ts.
- Create an extended data model using either mysql or a nosql solution like mongodb, dynamodb or similar
- You can proxy requests to SWAPI and extend the results with the additional data or create your own full implementation
importing the data of starships and vehicles. If you opt for the second option, make sure you match the data model and
behavior of the original API
- Implementing unit testing is a plus
- Using a serverless solution like AWS Lambda or similar is a plus

## Technology stack:
The technologies chosen to build this project as a serverless solution were: TypeScript, AWS CDK (Lambda, DynamoDB, API Gateway), and Jest for testing.

## Desing and implementation details:
Based on the instructions and requirements, I have decided that the solution would consist of 8 endpoints to fulfill the 4 different requirements for the two specified entities (vehicles and starships). For this implementation, I chose to store the inventory-related data (only the amount property) in 2 DynamoDB tables and proxy the requests with the SWAPI API when data about a specific vehicle or starship was needed. This decision allowed me to simplify the code and create a more straightforward solution.

However, if this were a production environment, I would have developed a solution where I locally extended the models from SWAPI and saved the data of each entity in DynamoDB. Because this approach would help avoid the rate limits of the SWAPI API.

Each endpoint was implemented with a lambda function that has access to its respective dynamoDb table and is linked to an ApiGateway

![image](https://github.com/facundo1cabrera/swapi-challenge/assets/83284235/d7df94d2-5f42-45ed-906d-10a73e5c258c)

## Endpoints:
Base url: https://9fn7rgv9w6.execute-api.us-east-1.amazonaws.com/prod/

### GET /inventory/vehicles/{id} 
Get data and the amount of a specific vehicle available on the inventory.
Example response: 
```
{
  "amount": "2",
  "id": 4,
  "name": "Sand Crawler",
  "model": "Digger Crawler",
  "manufacturer": "Corellia Mining Corporation",
  "cost_in_credits": "150000",
  "length": "36.8 ",
  "max_atmosphering_speed": "30",
  "crew": "46",
  "passengers": "30",
  "cargo_capacity": "50000",
  "consumables": "2 months",
  "vehicle_class": "wheeled",
  "pilots": [],
  "films": [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/5/"
  ],
  "created": "2014-12-10T15:36:25.724000Z",
  "edited": "2014-12-20T21:30:21.661000Z",
  "url": "https://swapi.dev/api/vehicles/4/"
}
```

### PATCH /inventory/vehicles/{id}/increment
Increment the amount of a specific vehicle in the inventory.
Example response:
```
{
  "success": true
}
```

### PATCH /inventory/vehicles/{id}/decrement
Decrement the amount of a specific vehicle in the inventory.
Example response:
```
{
  "success": true
}
```

### PUT /inventory/vehicles/{id}
body: 
```
{
  "amount": {newAmount}
}
```
Set the amount of a specific vehicle in the inventory.
Example response
```
{
  "success": true
}
```


### GET /inventory/starships/{id} 
Get data and the amount of a specific starship available on the inventory.
Example response: 
```
{
  "amount": "3"
  "name": "Death Star",
  "model": "DS-1 Orbital Battle Station",
  "manufacturer": "Imperial Department of Military Research, Sienar Fleet Systems",
  "cost_in_credits": "1000000000000",
  "length": "120000",
  "max_atmosphering_speed": "n/a",
  "crew": "342,953",
  "passengers": "843,342",
  "cargo_capacity": "1000000000000",
  "consumables": "3 years",
  "hyperdrive_rating": "4.0",
  "MGLT": "10",
  "starship_class": "Deep Space Mobile Battlestation",
  "pilots": [
    
  ],
  "films": [
    "https://swapi.dev/api/films/1/"
  ],
  "created": "2014-12-10T16:36:50.509000Z",
  "edited": "2014-12-20T21:26:24.783000Z",
  "url": "https://swapi.dev/api/starships/9/"
}
```

### PATCH /inventory/starships/{id}/increment
Increment the amount of a specific starship in the inventory.
Example response:
```
{
  "success": true
}
```

### PATCH /inventory/starships/{id}/decrement
Decrement the amount of a specific starship in the inventory.
Example response:
```
{
  "success": true
}
```

### PUT /inventory/starships/{id}
body: 
```
{
  "amount": {newAmount}
}
```
Set the amount of a specific starship in the inventory.
Example response
```
{
  "success": true
}
```

## Tests
I have developed some unit tests about the lambda code (mocking the Data Layer responses) in order to assure the right behavior regarding Error Handling, Model Validation and Lambda responses. 
You can run this tests with the following commands. Make sure you have Node 18 in your computer. 
```
npm install
```
```
npm run test
```

## How to try the solution?
Good news! You dont actually need to download anything to try the project!

It is deployed in aws behind the https://9fn7rgv9w6.execute-api.us-east-1.amazonaws.com/prod/ url. 

You can try the endpoints using the client of your preference like postman, insomnia, bash or vscode. The file [rest.http](https://github.com/facundo1cabrera/swapi-challenge/blob/main/rest.http) has some example requests to try in case you use vscode and have the 'REST client' extension.

## Assumptions:
I have made some asummptions regarding the business logic of the project:
- Decrements on entities with 0 or less items in the inventory are not allowed.

## Improvement areas:
- A request layer would be useful to decoupple requests from axios.
- A Postman collection would be useful to improve the testing experience for others interacting with the production API.
