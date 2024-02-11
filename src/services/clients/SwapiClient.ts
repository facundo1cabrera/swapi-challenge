import axios from "axios";
import { NotFoundError } from "../shared/validator";


export class SwapiClient {
    private baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getVehicle(id: number) {
        try {
            const url = `https://swapi.dev/api/vehicles/${id}/?format=json`;
            const result = await axios.get(url);
            return result.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                throw new NotFoundError(`Vehicle with Id: ${id} does not exist`);
            }
            throw new Error();
        }
    }
}