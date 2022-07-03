import { singleton } from 'tsyringe';
import { Collection, Db, MongoClient } from 'mongodb';
import { CollectionName } from '@solovevserg/uniq-shared/dist/models/db/collection-name';
import { CollectionNameToDocumentMap } from '@solovevserg/uniq-shared/dist/models/db/collection-name-to-document-map';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';
import { prepareCollectionName } from '@solovevserg/uniq-shared/dist/utils/prepare-collection-name';

@singleton()
export class MongoService {

    public readonly defaultDatabase = 'draft';

    private async getAdminDb() {
        const client = await this.getClient();
        return client.db().admin();
    }

    public async getDraftDb() {
        const client = await this.getClient();
        return client.db(this.defaultDatabase);
    }

    public async collection<TName extends CollectionName>(
        name: TName
    ): Promise<Collection<CollectionNameToDocumentMap[TName]>> {
        const db = await this.getDraftDb();
        return db.collection(name);
    }

    private async renameDb(oldDb: Db, newDbName: string) {
        const client = await this.getClient();
        const newDb = client.db(newDbName);
        for (const draftCollection of await oldDb.collections()) {
            const documents = await draftCollection.find().toArray();
            newDb.collection(draftCollection.collectionName).insertMany(documents);
        }
        await oldDb.dropDatabase();
        return newDb;
    }

    public async flush() {
        const draftDb = await this.getDraftDb();
        const timestamp = prepareCollectionName(new Date());
        await this.renameDb(draftDb, timestamp);
        return timestamp;
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