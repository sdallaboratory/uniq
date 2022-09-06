import { GroupName } from "../group/group-name";
import { TeacherName } from "./teacher-name";

export interface Teacher {
    name: TeacherName;
    groups: GroupName[];
}
