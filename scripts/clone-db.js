const { MongoClient } = require('mongodb');

/**
 * Clones all collections from source database to target database iteratively.
 * `node scripts/clone-db.js mongodb://193.187.96.23:27019 2022-06-30-12-03-59 draft`
 * @param {string} connection Mongo connection string.
 * @param {string} sourceDbName The name of the source database.
 * @param {string} targetDbName The name of the target database.
 * @returns The newly created target database instance.
 */
async function cloneDb(connection, sourceDbName, targetDbName) {
    console.log(`Cloning db ${sourceDbName} to db ${targetDbName}.`);
    const client = new MongoClient(connection);
    await client.connect();
    const sourceDb = client.db(sourceDbName);
    const targetDb = client.db(targetDbName);
    for (const sourceCollection of await sourceDb.collections()) {
        console.log(`Cloning collection ${sourceCollection.collectionName}.`);
        const documents = await sourceCollection.find().toArray();
        await targetDb.collection(sourceCollection.collectionName).insertMany(documents);
    }
    await client.close();
    return targetDb;
}

cloneDb(...process.argv.slice(2))
    .then((target) => console.log(`Cloning to ${target.databaseName} done.`));
