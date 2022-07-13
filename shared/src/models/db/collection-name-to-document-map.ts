import { Classroom } from "../classroom/classroom";
import { IClassroom } from "../classroom/classroom.interface";
import { IGroup } from "../group/group.interface";
import { ILesson } from "../lesson/lesson.interface";
import { IRawLesson } from "../lesson/raw-lesson.interface";
import { ITeacher } from "../teacher/teacher.interface";
import { Week } from "../time/week";

export interface CollectionNameToDocumentMap {
  'groups': IGroup,
  'lessons': ILesson,
  'raw-lessons': IRawLesson,
  'teachers': ITeacher,
  'classrooms': IClassroom,
  'current-week': Week,
}
