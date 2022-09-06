import { LessonNumber } from "./lesson-number";

export class UnboundTimeSlotClass {

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
