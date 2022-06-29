import { timeRangeToSlot } from "./time-range-to-slot";

export const slotToTimeRange = new Map(
    [...timeRangeToSlot.entries()].map(([timeRange, slot]) => [slot.lessonNumber, timeRange]),
);