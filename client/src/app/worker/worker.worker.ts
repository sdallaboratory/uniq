/// <reference lib="webworker" />

import { Lesson } from '@solovevserg/uniq-shared/dist/models/lesson/lesson';
import { DoWork, runWorker } from 'observable-webworker';
import { firstValueFrom, from, fromEvent } from 'rxjs';
import { bufferCount, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Memoize } from 'typescript-memoize';

interface WorkerTaskBase {
  type: string;
  params: unknown;
  workerRequestId: string;
}

interface SearchLessonsWorkerTask extends WorkerTaskBase {
  type: 'SearchLessonsWorkerTask',
  params: {
    query: string;
    group: string;
  }
}

interface SearchGroupsWorkerTask extends WorkerTaskBase {
  type: 'SearchGroupsWorkerTask',
  params: {
    query: string;
  }
}

type WorkerTask = SearchLessonsWorkerTask | SearchGroupsWorkerTask;


class ApiWorker {
  handleMessage(message: WorkerTask) {
    if (message.type === 'SearchLessonsWorkerTask') {
      return this.searchLessons(message.params)
    }
    if (message.type === 'SearchGroupsWorkerTask') {
      return this.searchGroups(message.params)
    }
    return Promise.reject(new Error('No appropriate handler was found'))
  }

  private readonly lessons$ = fetch('/api/lessons').then(r => r.json()) as Promise<Lesson[]>;
  private readonly groups$ = from(this.lessons$).pipe(
    mergeMap(lessons => lessons),
    mergeMap(lesson => lesson.groups),
    bufferCount(Infinity),
    map(lessons => [...new Set(lessons)])
  );

  @Memoize()
  async searchLessons({ query, group }: { query: string, group: string }) {
    const lessons = await this.lessons$;
    const searchedLessons = lessons.filter(lesson => lesson.groups.some(g => g.includes(group)));
    return searchedLessons.slice(0, 100);
  }

  @Memoize()
  async searchGroups({ query }: { query: string }) {
    const groups = await firstValueFrom(this.groups$);
    const searchedGroups = groups.filter(group => group.includes(query));
    return searchedGroups;
  }

  constructor() {
    fromEvent<MessageEvent<string>>(self, 'message').pipe(
      map(taskEvent => JSON.parse(taskEvent.data)),
      mergeMap(async message => ({
        ...message,
        result: await this.handleMessage(message),
      })),
      map(message => JSON.stringify(message)),
      tap(message => console.log('Sending result', message)),
    ).subscribe(result => self.postMessage(result))
  }

}

const worker = new ApiWorker();
