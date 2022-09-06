import { ClassroomName } from "../classroom/classroom-name";
import { GroupName } from "../group/group-name";
import { TeacherName } from "../teacher/teacher-name";
import { TimeSlot } from "../time/slot/time-slot";
import { LessonType } from "./lesson-type";

export interface Lesson {
    name: string;
    groups: GroupName[];
    slot: TimeSlot;
    type?: LessonType;

    teachers?: TeacherName[];
    classrooms?: ClassroomName[];
}
