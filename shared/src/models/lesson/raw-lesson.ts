import { GroupName } from "../group/group-name";
import { TeacherName } from "../teacher/teacher-name";
import { TimeSlot } from "../time/slot/time-slot";

export interface RawLesson {
    name: string;
    group: GroupName;
    slot: TimeSlot;
    type: string;
    teacher?: TeacherName;
    classroomString?: string;
}
