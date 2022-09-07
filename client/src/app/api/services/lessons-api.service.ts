import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from '@solovevserg/uniq-shared/dist/models/lesson/lesson';
import { LessonClass } from '@solovevserg/uniq-shared/dist/models/lesson/lesson.class';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonsApiService {

  constructor(
    protected readonly http: HttpClient,
  ) { }

  public get(query: string | RegExp) {
    const url = '/api/lessons'
    if (query instanceof RegExp) {
      // Trim first and last '/' after convertion to string
      query = String(query).slice(1, -1);
    }
    return this.http.get<Lesson>(url).pipe(
      map(lesson => new LessonClass(lesson)),
    );
  }

}
