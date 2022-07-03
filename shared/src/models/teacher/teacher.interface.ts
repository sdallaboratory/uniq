import { GroupName } from "../group/group-name";
import { TeacherName } from "./teacher-name";

export interface ITeacher {
    name: TeacherName;
    groups: GroupName[];
}