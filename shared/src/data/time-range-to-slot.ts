import { UnboundTimeSlot } from "../models/time/slot/unbound-time-slot";

export const timeRangeToSlot = new Map([
    ['08:30 - 10:05', new UnboundTimeSlot(1)],
    ['10:15 - 11:50', new UnboundTimeSlot(2)],
    ['12:00 - 13:35', new UnboundTimeSlot(3)],
    ['13:50 - 15:25', new UnboundTimeSlot(4)],
    ['15:40 - 17:15', new UnboundTimeSlot(5)],
    ['17:25 - 19:00', new UnboundTimeSlot(6)],
    ['19:10 - 20:45', new UnboundTimeSlot(7)],
]);
