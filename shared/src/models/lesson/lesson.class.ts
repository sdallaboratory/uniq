import { ClassroomClass } from "../classroom/classroom.class";
import { GroupName } from "../group/group-name";
import { TeacherName } from "../teacher/teacher-name";
import { TimeSlotClass } from "../time/slot/time-slot.class";
import { Lesson } from "./lesson"
import { plainToInstance, Type, Transform, plainToClassFromExist } from 'class-transformer';
import { ClassroomName } from "../classroom/classroom-name";
import { LessonType } from "./lesson-type";

export class LessonClass {

    name!: string;

    groups!: GroupName[]; // TODO: Maybe use Group class Later

    @Type(() => TimeSlotClass)
    slot!: TimeSlotClass;

    teacher?: TeacherName;

    type?: LessonType;

    // @Type(() => Classroom)
    @Transform(({ value }) => new ClassroomClass(value as ClassroomName))
    classrooms!: ClassroomClass[];

    public static fromPlain(lesson: Lesson) {
        return plainToInstance(LessonClass, lesson);
    }

    constructor(lesson: Lesson) {
        if (!lesson) { return; }
        plainToClassFromExist(this, lesson);
    }

}
