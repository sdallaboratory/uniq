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
import { TerminateHandlersChainError } from '@solovevserg/uniq-shared/dist/errors';
import prettyPrintMs from 'pretty-print-ms';
import { ExtractTeachersHandler } from './handlers.ts/extract-teachers.handlers';
import { ExtractClassroomsHandler } from './handlers.ts/extract-classrooms.handler';

const handlers = [
  CollectGroupsHandler,
  CollectGroupsScheduleHandler,
  MergeLessonsHandler,
  ExtractTeachersHandler,
  ExtractClassroomsHandler,
] as InjectionToken<Handler>[];

async function main() {
  try {
    for (const Handler of handlers) {
      if (typeof Handler !== 'function') {
        throw new Error('Each handler must be a constructor function.');
      }
      log('Handler', Handler.name, 'detected. Resolving.');
      const handler = container.resolve(Handler);
      log('Handler', Handler.name, 'instantiated. Starting execution.');
      await handler.execute();
      log('Handler', Handler.name, 'sucessfully finished.');
    }
    const mongo = container.resolve(MongoService);
    const timestamp = await mongo.flush();
    log('New data saved at db', timestamp);
  } catch (error) {
    if (error instanceof TerminateHandlersChainError) {
      log('Occured error have leaded to graceful handler chain termination. Error:', error.message);
      setTimeout(main, environment.collectorIntervalMs);
      const time = prettyPrintMs(environment.collectorIntervalMs);
      log('Next launch in', time, '.');
    } else {
      log('Unexpected error occured. Error:', error);
      main();
      log('Restarting the handlers chain.');
    }
  }
}

main();
