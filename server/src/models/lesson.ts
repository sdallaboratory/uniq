import { Classroom } from "./classroom";
import { DayOfWeek } from "./day-of-week";
import { University } from "./university";
import { WeekType } from "./week-type";

export interface LessonBase {
    
    // When
    weekType: WeekType | WeekType[];
    dayOfWeek: DayOfWeek;
    slot: number;

    // Where
    // university: University; // TODO: Add this when more universities added
    classrooms: Classroom[]; // TODO: turn into class to add logic for calculating location and floor

    // What
    name: string;

    // Who
    groups: string[];
    teacher: string | string[];
}

export interface LessonRaw extends LessonBase {
    teacher: string;
    weekType: WeekType;
}

export interface Lesson extends LessonBase {
    teacher: string[];
    classrooms: Classroom[]; // TODO: make class version of Classroom to add logic for calculating location and floor
    weekType: WeekType[];
}

// export class Lesson implements LessonBase {
//     /**
//      *
//      */
//     constructor(private readonly {
//         weekType,
//         university,
//         name,
//         slot,
//         groups,
//         teacher,
//         classrooms
//     }: LessonBase) {}

//     public get fromTime() {
//         return this;
//     }

// }

export class FullLesson {
    constructor(lesson: Lesson
        // public readonly disciplineName: string,
        // public readonly slotNumber: number,
        // public readonly fromTime: string,
        // public readonly toTime: string,
        // public readonly groups: string[],
        // public readonly weekType: WeekType[], // ['числитель', 'знаменатель']
        // public readonly auditory: Classroom,
        // public readonly teacher: string,
    ) { }
}