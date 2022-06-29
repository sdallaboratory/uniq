import { GroupName } from "../group/group-name";
import { TeacherName } from "../teacher/teacher-name";
import { ITimeSlot } from "../time/slot/time-slot.interface";

export interface IRawLesson {
    name: string;
    group: GroupName;
    slot: ITimeSlot;
    type: string;
    teacher?: TeacherName;
    classroomString?: string;
}