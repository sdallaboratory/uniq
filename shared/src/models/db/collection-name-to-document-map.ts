import { IGroup } from "../group/group.interface";
import { ILesson } from "../lesson/lesson.interface";
import { IRawLesson } from "../lesson/raw-lesson.interface";

export interface CollectionNameToDocumentMap {
  'groups': IGroup,
  'lessons': ILesson,
  'raw-lessons': IRawLesson,
}