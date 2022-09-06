import { DayOfWeek } from "../day-of-week";
import { WeekType } from "../week-type";
import { LessonNumber } from "./lesson-number";
import { TimeSlot } from "./time-slot";
import { plainToClassFromExist } from 'class-transformer'
import { UnboundTimeSlotClass } from "./unbound-time-slot.class";

export class TimeSlotClass extends UnboundTimeSlotClass implements TimeSlot {
    
    public weekTypes!: WeekType[];
    public dayOfWeek!: DayOfWeek;

    constructor(timeSlot?: TimeSlot) {
        if (!timeSlot) { return; }
        super(timeSlot.lessonNumber)
        plainToClassFromExist(this, timeSlot);
    }
}
