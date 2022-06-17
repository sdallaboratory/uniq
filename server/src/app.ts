import 'reflect-metadata';
import { container } from 'tsyringe';
import ScheduleService from './service/schedule.service';
import { MongoClient } from 'mongodb';
import './polyfills/fetch';

function getDate() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1; // TODO: Add leading zeroes
  let day = now.getDate(); // TODO: Add leading zeroes
  return `${year}-${month}-${day}`;
}

async function main() {
  const schedule = container.resolve(ScheduleService);
  const mongo = await new MongoClient('mongodb://localhost:27018').connect();
  const date = getDate();
  const db = mongo.db(date);
  // await db.dropDatabase(); // TODO: Remove after data merge logic is implemented

  const groups = await schedule.getGroupsUris();
  const groupsCollection = db.collection('groups');
  await groupsCollection.insertMany(groups);

  const lessonsRawCollection = db.collection('lessons-row'); // TODO: Fix DB name
  for (const [{ uri, name }, index] of groups.map((group, index) => [group, index] as const)) {
    console.log(index, 'parsing uri', name, uri)
    const lessonsRaw = JSON.parse(JSON.stringify(await schedule.getSchedule(uri)));
    await lessonsRawCollection.insertMany(lessonsRaw);
  }

  console.log('Done')
}

main();
