import { DayOfWeek } from "../day-of-week";
import { WeekType } from "../week-type";
import { LessonNumber } from "./lesson-number";

export interface ITimeSlot {
    readonly lessonNumber: LessonNumber;
    readonly weekTypes: WeekType[];
    readonly dayOfWeek: DayOfWeek;
}