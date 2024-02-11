import axios from "axios";
import { NotFoundError } from "../shared/validator";


export class SwapiClient {
    private baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = "https://swapi.dev/";
    }

    async getVehicle(id: number) {
        try {
            const url = `${this.baseUrl}api/vehicles/${id}/?format=json`;
            const result = await axios.get(url);
            return result.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                throw new NotFoundError(`Vehicle with Id: ${id} does not exist`);
            }
            throw new Error();
        }
    }

    async getStarship(id: number) {
        try {
            const url = `${this.baseUrl}api/starships/${id}/?format=json`;
            const result = await axios.get(url);
            return result.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                throw new NotFoundError(`Starship with Id: ${id} does not exist`);
            }
            throw new Error();
        }
    }
}