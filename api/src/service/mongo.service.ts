import { singleton } from 'tsyringe';
import { Collection, Db, MongoClient } from 'mongodb';
import { CollectionName } from '@solovevserg/uniq-shared/dist/models/db/collection-name';
import { CollectionNameToDocumentMap } from '@solovevserg/uniq-shared/dist/models/db/collection-name-to-document-map';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';
import _ from 'lodash';
import { log } from '@solovevserg/uniq-shared/dist/logging/log';

@singleton()
export class MongoService {

    private isCorrectDb(db: string) {
        return /\d{4}-\d{2}-\d{2}.+/.test(db);
    }

    public async getLatestDb() {
        const client = await this.getClient();
        const { databases } = await client.db().admin().listDatabases();
        const db = _(databases)
            .map(({ name }) => name)
            .filter(this.isCorrectDb)
            .orderBy()
            .last();

        if (!db) {
            throw new Error('There is no one database with relevant data.');
        }
        
        log('Latest database is ', db ,'.');
        return client.db(db);
    }

    public async collection<TName extends CollectionName>(
        name: TName
    ): Promise<Collection<CollectionNameToDocumentMap[TName]>> {
        const db = await this.getLatestDb();
        return db.collection(name);
    }

    private mongo?: MongoClient;

    public async getClient() {
        if (this.mongo) {
            return this.mongo;
        } else {
            this.mongo = new MongoClient(environment.mongoConnectionString);
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