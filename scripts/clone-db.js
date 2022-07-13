const { MongoClient } = require('mongodb');

/**
 * Clones all collections from source database to target database iteratively.
 * `node scripts/clone-db.js mongodb://193.187.96.23:27019 2022-06-30-12-03-59 draft groups,raw-lessons`
 * @param {string} connection Mongo connection string.
 * @param {string} sourceDbName The name of the source database.
 * @param {string} targetDbName The name of the target database.
 * @param {string} collections Comma-separated list or an array of collections' names to copy.
 * If not presented all collections will be copied.
 * @returns The newly created target database instance.
 */
async function cloneDb(connection, sourceDbName, targetDbName, collections = []) {
    if (!Array.isArray(collections)) {
        collections = collections.split(',');
        console.log('Recognized collections to copy: ', collections, '.');
    }
    console.log(`Cloning db ${sourceDbName} to db ${targetDbName}.`);
    const client = new MongoClient(connection);
    await client.connect();
    const sourceDb = client.db(sourceDbName);
    const targetDb = client.db(targetDbName);
    const alreadyPresentedCollections = await targetDb.collections();
    const notToCopyCollections = [
        ...collections,
        ...alreadyPresentedCollections.map(c => c.collectionName)
    ];
    for (const sourceCollection of await sourceDb.collections()) {
        const name = sourceCollection.collectionName;
        if (notToCopyCollections.includes(name)) {
            console.log(`Skipping collection ${name}.`);
            continue;
        }
        console.log(`Cloning collection ${name}.`);
        const documents = await sourceCollection.find().toArray();
        await targetDb.collection(name).insertMany(documents);
    }
    await client.close();
    return targetDb;
}

cloneDb(...process.argv.slice(2))
    .then((target) => console.log(`Cloning to ${target.databaseName} done.`));
