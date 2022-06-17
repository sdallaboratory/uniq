import { timeRange } from "../models/time/time-range";
declare class TimeSlotMap {
    private readonly map;
    direct(timeRange: timeRange): number | undefined;
}
export declare const timeSlotMap: TimeSlotMap;
export {};
