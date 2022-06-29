import { slotToTimeRange } from "../../../data/slot-to-time-range";
import { timeRangeToSlot } from "../../../data/time-range-to-slot";
import { TimeRange } from "../time-range";
import { LessonNumber } from "./lesson-number";

export class UnboundTimeSlot {

    constructor(
        public readonly lessonNumber: LessonNumber,
    ) { }

    // TODO: Maybe move data to this class to prevent cyclic dependencies.
    // static fromTimeRange(timeRange: TimeRange) {
    //     return timeRangeToSlot.get(timeRange);
    // }

    // toTimeRnage() {
    //     return slotToTimeRange.get(this.lessonNumber);
    // }
}