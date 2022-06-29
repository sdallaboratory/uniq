import { ClassroomName } from "../classroom/classroom-name";
import { GroupName } from "../group/group-name";
import { TeacherName } from "../teacher/teacher-name";
import { ITimeSlot } from "../time/slot/time-slot.interface";
import { LessonType } from "./lesson-type";

export interface ILesson {
    name: string;
    groups: GroupName[];
    slot: ITimeSlot;
    type?: LessonType;

    teacher?: TeacherName;
    classrooms?: ClassroomName[];
}