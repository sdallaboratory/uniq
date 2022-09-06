import { UnboundTimeSlotClass } from "../models/time/slot/unbound-time-slot.class";

export const timeRangeToSlot = new Map([
    ['08:30 - 10:05', new UnboundTimeSlotClass(1)],
    ['10:15 - 11:50', new UnboundTimeSlotClass(2)],
    ['12:00 - 13:35', new UnboundTimeSlotClass(3)],
    ['13:50 - 15:25', new UnboundTimeSlotClass(4)],
    ['15:40 - 17:15', new UnboundTimeSlotClass(5)],
    ['17:25 - 19:00', new UnboundTimeSlotClass(6)],
    ['19:10 - 20:45', new UnboundTimeSlotClass(7)],
]);
