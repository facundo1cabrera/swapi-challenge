export interface IDbClient {
    getById(id: number);
    update(id: number, key: string, value: any);
    create(body: any);
}