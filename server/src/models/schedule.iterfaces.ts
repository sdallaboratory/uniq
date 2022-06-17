// TODO: Refactor this file (split to separate)

// export interface GroupScheduleUri {
//     name: string;
//     uri: string;
// }

// export interface Lesson {
//     timeRange: string;
//     weekType: WeekType;
//     dayOfWeek: string;
//     slot: number;
//     name: string;
//     teacher?: string;
//     classroom?: string;
//     type?: string;
// }

// export interface Lesson {
//     university: 'university'
//     disciplineName: string;
//     slotNumber: number;
//     fromTime: string;
//     toTime: string;
//     groups: string[];
//     weekType: WeekType[];
//     auditory: Classroom;
//     teacher: string;
// }

// export interface DaySchedule {
//     name: string | 'пн';
//     numerator: Lesson[];
//     denominator: Lesson[];
// }

// export interface GroupSchedule {
//     name: string;
//     days: DaySchedule[];
// }

export interface WeekInfo {
    number: number;
    weekName: string;
}

// export type WeekType = 'numerator' | 'denominator';
