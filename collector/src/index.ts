import 'reflect-metadata';
import { container } from 'tsyringe';
import ScheduleService from './services/schedule.service';
import { MongoClient } from 'mongodb';
import './polyfills/fetch';
import _ from 'lodash';
import { Group } from '@solovevserg/uniq-shared/dist/models/group';
import { LessonRaw, Lesson } from '@solovevserg/uniq-shared/dist/models/lesson';

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
  // const date = getDate();

  const date = '2022-5-12';
  const db = mongo.db(date);
  // await db.dropDatabase(); // TODO: Remove after data merge logic is implemented

  // const groups = await schedule.getGroupsUris();
  // const groupsCollection = db.collection<Group>('groups');
  // await groupsCollection.insertMany(groups);

  const lessonsRawCollection = db.collection<LessonRaw>('lessons-row'); // TODO: Fix DB name
  // const withUris = groups
  //   .filter(group => group.uri !== undefined)
  //   .map(group => group as Required<Group>)
  //   .map((group, index) => [group, index] as const);

  // for (const [{ uri, name }, index] of withUris) {
  //   console.log(index, 'parsing uri', name, uri)
  //   const lessonsRaw = JSON.parse(JSON.stringify(await schedule.getSchedule(uri)));
  //   await lessonsRawCollection.insertMany(lessonsRaw);
  // }

  const lessonsRaw = await lessonsRawCollection.find().toArray();
  console.log(lessonsRaw.length);

  const lessons = mergeLessonsRaw(lessonsRaw);
  const lessonsCollection = db.collection<Lesson>('lessons');
  await lessonsCollection.drop();
  await lessonsCollection.insertMany(lessons);
  console.log('Done');
  await mongo.close();
}

main();

function mergeLessonsRaw(lessonsRaw: LessonRaw[]) {
  const groups = groupByWith(lessonsRaw, lessonRaw => _.pick(lessonRaw, ['name', 'dayOfWeek', ' slot', 'classrooms']), _.isEqual);
  const lessons = groups.map(lessons => ({
    ...lessons[0],
    classrooms: _.uniq(lessons.flatMap(lesson => lesson.classrooms)),
    teacher: _.uniq(lessons.flatMap(lesson => lesson.teacher)),
    groups: _.uniq(lessons.flatMap(lesson => lesson.groups)),
    weekType: _.uniq(lessons.flatMap(lesson => lesson.weekType)),
  } as Lesson));
  return lessons;
}

// TODO: Move to separate NPM Package (for example as lodash plugin)
function groupByWith<T, TComparable>(collection: T[], project: (elem: T) => TComparable = _.identity, cmp: (a: TComparable, b: TComparable) => boolean = _.isEqual) {
  // console.log(collection);
  const map = new Map<T, TComparable>(_.map(collection, elem => [elem, project(elem)]));
  const groups = [] as T[][];
  for (const [elem, index] of collection.map((elem, index) => [elem, index] as const)) {
    if (index % 100 === 0) {
      console.log(index);
    }
    const comparable = map.get(elem)!;
    const group = groups.find(([groupElem]) => cmp(map.get(groupElem)!, comparable));
    if (group) {
      group.push(elem);
    } else {
      groups.push([elem]);
    }
  }
  return groups;
}