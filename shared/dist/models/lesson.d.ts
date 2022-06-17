import { Classroom } from "./classroom";
import { DayOfWeek } from "./day-of-week";
import { WeekType } from "./week-type";
interface LessonBase {
    weekType: WeekType | WeekType[];
    dayOfWeek: DayOfWeek;
    slot: number;
    classrooms: Classroom[];
    name: string;
    groups: string[];
    teacher: string | string[];
}
export interface LessonRaw extends LessonBase {
    teacher: string;
    weekType: WeekType;
}
export interface Lesson extends LessonBase {
    teacher: string[];
    classrooms: Classroom[];
    weekType: WeekType[];
}
export declare class FullLesson {
    constructor(lesson: Lesson);
}
export {};
