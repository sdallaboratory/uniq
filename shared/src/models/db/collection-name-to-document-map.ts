import { Classroom } from "../classroom/classroom";
import { Group } from "../group/group";
import { Lesson } from "../lesson/lesson"
import { RawLesson } from "../lesson/raw-lesson";
import { Teacher } from "../teacher/teacher"
import { Week } from "../time/week";

export interface CollectionNameToDocumentMap {
  'groups': Group,
  'lessons': Lesson,
  'raw-lessons': RawLesson,
  'teachers': Teacher,
  'classrooms': Classroom,
  'current-week': Week,
}
