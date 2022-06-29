import { DayOfWeek } from "../day-of-week";
import { WeekType } from "../week-type";
import { LessonNumber } from "./lesson-number";
import { ITimeSlot } from "./time-slot.interface";
import { plainToClassFromExist } from 'class-transformer'
import { UnboundTimeSlot } from "./unbound-time-slot";

export class TimeSlot extends UnboundTimeSlot implements ITimeSlot {
    
    public weekTypes!: WeekType[];
    public dayOfWeek!: DayOfWeek;

    constructor(timeSlot?: ITimeSlot) {
        if (!timeSlot) { return; }
        super(timeSlot.lessonNumber)
        plainToClassFromExist(this, timeSlot);
    }
}