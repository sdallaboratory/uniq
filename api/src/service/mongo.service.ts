import { autoInjectable } from "tsyringe";
import { MongoClient } from 'mongodb';

@autoInjectable()
export class MongoService {

    private mongo?: MongoClient;

    public async getClient() {
        if (this.mongo) {
            return this.mongo;
        } else {
            this.mongo = new MongoClient('mongodb://localhost:27018');
            return this.mongo;
        }
    }

    public async dispose() {
        if (!this.mongo) {
            throw new Error('Connection was not previously opened. Nothing to dispose.');
        }
        return this.mongo?.close();
    }

}