"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSlotMap = void 0;
class TimeSlotMap {
    constructor() {
        this.map = new Map([
            ['08:30 - 10:05', 1],
            ['10:15 - 11:50', 2],
            ['12:00 - 13:35', 3],
            ['13:50 - 15:25', 4],
            ['15:40 - 17:15', 5],
            ['17:25 - 19:00', 6],
            ['19:10 - 20:45', 7],
        ]);
        // TODO: Implement reverse()
        // reverse() {}
    }
    direct(timeRange) {
        return this.map.get(timeRange);
    }
}
exports.timeSlotMap = new TimeSlotMap();
