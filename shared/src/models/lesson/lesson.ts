import { Classroom } from "../classroom/classroom";
import { GroupName } from "../group/group-name";
import { TeacherName } from "../teacher/teacher-name";
import { TimeSlot } from "../time/slot/time-slot";
import { ILesson } from "./lesson.interface";
import { plainToInstance, Type, Transform, plainToClassFromExist } from 'class-transformer';
import { ClassroomName } from "../classroom/classroom-name";
import { LessonType } from "./lesson-type";

export class Lesson {

    name!: string;

    groups!: GroupName[]; // TODO: Maybe use Group class Later

    @Type(() => TimeSlot)
    slot!: TimeSlot;

    teacher?: TeacherName;

    type?: LessonType;

    // @Type(() => Classroom)
    @Transform(({ value }) => new Classroom(value as ClassroomName))
    classrooms!: Classroom[];

    public static fromPlain(lesson: ILesson) {
        return plainToInstance(Lesson, lesson);
    }

    constructor(lesson: ILesson) {
        if (!lesson) { return; }
        plainToClassFromExist(this, lesson);
    }

}