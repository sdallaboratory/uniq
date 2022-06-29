import 'reflect-metadata';
import './polyfills/fetch';
import { container, InjectionToken } from 'tsyringe';
import { CollectGroupsHandler } from './handlers.ts/collect-groups.handler';
import { MongoService } from './services/mongo.service';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';
import { CollectGroupsScheduleHandler } from './handlers.ts/collect-groups-schedule.handler';
import { MergeLessonsHandler } from './handlers.ts/merge-lessons.handler';
import { Handler } from './handlers.ts/handler.interface';
import { log } from '@solovevserg/uniq-shared/dist/logging/log';

const handlers = [
  CollectGroupsHandler,
  CollectGroupsScheduleHandler,
  MergeLessonsHandler,
] as InjectionToken<Handler>[];

async function main() {
  for (const Handler of handlers) {
    if (typeof Handler !== 'function') {
      throw new Error('Each handler must be a constructor function.');
    }
    log('Handler', Handler.name, 'starting.');
    const handler = container.resolve(Handler);
    await handler.execute();
    log('Handler', Handler.name, 'sucessfully finished.');
  }
  const mongo = container.resolve(MongoService);
  const timestamp = await mongo.flush();
  log('New data saved at db', timestamp, '. Next launch in ', environment.collectorIntervalMs, 'ms.');
  setTimeout(main, environment.collectorIntervalMs);
}

main();

// const schedule = container.resolve(ScheduleService);
// const mongo = await new MongoClient('mongodb://localhost:27018').connect();
// const date = getDate();

// const date = '2022-5-12';
// const db = mongo.db(date);
// await db.dropDatabase(); // TODO: Remove after data merge logic is implemented

// const groups = await schedule.getGroupsUris();
// const groupsCollection = db.collection<Group>('groups');
// await groupsCollection.insertMany(groups);

// const lessonsRawCollection = db.collection<LessonRaw>('lessons-row'); // TODO: Fix DB name
// const withUris = groups
//   .filter(group => group.uri !== undefined)
//   .map(group => group as Required<Group>)
//   .map((group, index) => [group, index] as const);

// for (const [{ uri, name }, index] of withUris) {
//   console.log(index, 'parsing uri', name, uri)
//   const lessonsRaw = JSON.parse(JSON.stringify(await schedule.getSchedule(uri)));
//   await lessonsRawCollection.insertMany(lessonsRaw);
// }

// const lessonsRaw = await lessonsRawCollection.find().toArray();
// console.log(lessonsRaw.length);

// const lessonsCollection = db.collection<Lesson>('lessons');
// if (!await lessonsCollection.countDocuments()) {
//   const lessons = mergeLessonsRaw(lessonsRaw);
//   // await lessonsCollection.drop();
//   await lessonsCollection.insertMany(lessons);
// }

// const teachersCollection = db.collection('teachers');
// const lessons = await lessonsCollection.find().toArray();

// const teachers = _(lessons)
//   .map(lesson => lesson.groups.map(group => lesson.teacher.map(teacher => [teacher, group] as const)))
//   .flatten()
//   .flatten()
//   .tap(a => console.log(a.length))
//   .groupBy(([teacher]) => teacher)
//   .tap(a => console.log(a.length))
//   .toPairs()
//   .map(([name, groups]) => ({
//     name,
//     groups: _.uniq(groups.map(([, group]) => group)),
//   }))
//   .tap(a => console.log(a.length))
//   .value();

// console.log(teachers);


// await teachersCollection.drop();
// await teachersCollection.insertMany(teachers);

// console.log('Done');
// await mongo.close();

// main();