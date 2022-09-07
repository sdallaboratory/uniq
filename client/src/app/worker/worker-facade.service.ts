import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { fromWorker } from 'observable-webworker';
import { BehaviorSubject, filter, first, firstValueFrom, fromEvent, map, of, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerFacadeService {

  // private readonly tasksQueue$ = new Subject<unknown>()

  public runTask(task: object) {
    const id = uuidv4();
    console.log("Running task", id);
    const result$ = this.output$.pipe(
      filter(task => task.id === id),
    );
    const taskJson = JSON.stringify({ ...task, id });
    this.worker.postMessage(taskJson);
    return firstValueFrom(result$);
  }

  private readonly worker = new Worker(
    new URL('./worker.worker.ts', import.meta.url),
    { type: 'module' }
  )

  private readonly output$ = fromEvent<MessageEvent<string>>(this.worker, 'message').pipe(
    map(resultEvent => JSON.parse(resultEvent.data))
  )

  // worker = fromWorker<string, string>(
  //   () => new Worker(
  //     new URL('./worker.worker.ts', import.meta.url),
  //     { type: 'module' }
  //   ),
  //   this.tasksQueue$.pipe(
  //     map(task => JSON.stringify(task)),
  //     tap(a => console.log(a))
  //   ),
  // ).pipe(
  //   map(resultJson => JSON.parse(resultJson))
  // )

  constructor() {
    // this.worker.port.start();
  }
}
