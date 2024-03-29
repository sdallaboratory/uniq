import { log } from "@solovevserg/uniq-shared/dist/logging/log";
import { Lesson } from "@solovevserg/uniq-shared/dist/models/lesson/lesson";
import { RawLesson } from "@solovevserg/uniq-shared/dist/models/lesson/raw-lesson";
import { GroupClass } from "@solovevserg/uniq-shared/dist/models/group/group.class";
import { isNotNill } from "@solovevserg/uniq-shared/dist/utils/is-not-nill";
import _ from "lodash";
import { injectable } from "tsyringe";
import { MongoService } from "../services/mongo.service";
import { Handler } from "./handler.interface";
import { TeacherName } from "@solovevserg/uniq-shared/dist/models/teacher/teacher-name";
import { ClassroomName } from "@solovevserg/uniq-shared/dist/models/classroom/classroom-name";
import { GroupName } from "@solovevserg/uniq-shared/dist/models/group/group-name";

@injectable()
export class MergeLessonsHandler implements Handler {

    constructor(
        private readonly mongo: MongoService,
    ) { }

    public async execute() {
        const lessonsCollection = await this.mongo.collection('lessons');
        if (await lessonsCollection.countDocuments() > 0) {
            log('Raw lessons are already merged. Skipping any merging logic.')
            return;
        }
        const rawLessonsCollection = await this.mongo.collection('raw-lessons');
        const rawLessons = await rawLessonsCollection.find().toArray();
        const lessons = this.mergeRawLessons(rawLessons);
        log('Inserting lessons to database.')
        await lessonsCollection.insertMany(lessons);
    }

    private mergeRawLessons(rawLessons: RawLesson[]) {
        log('Grouping', rawLessons.length, ' raw lessons.');
        const groups = this.groupByWith(rawLessons, this.lessonIdentity);
        log('Merging', groups.length, 'raw lessons groups.');
        const lessons = groups.map(this.mergeRawLessonsGroup.bind(this));
        return lessons;
    }

    private lessonIdentity(lesson: RawLesson) {
        const { name, slot, classroomString, teacherString, type, group } = lesson;
        const { dayOfWeek, lessonNumber } = slot;
        const faculty = GroupClass.fromPlain({ name: group }).parse().faculty;
        return { name, teacherString, classroomString, dayOfWeek, lessonNumber, type, faculty };
    }

    private mergeRawLessonsGroup(lessons: RawLesson[]) {
        // TODO: Add checks for correctness of the lessons group.
        const name = lessons[0].name;
        const type = lessons[0].type?.replace(/\(|\)|\s+/g, '');
        const slot = lessons[0].slot;

        const weekTypes = _(lessons)
            .flatMap(lesson => lesson.slot.weekTypes)
            .uniq()
            .value();

        const classrooms = _(lessons)
            .flatMap(lesson => lesson.classroomString?.split(/\s*,\s*|\s+/))
            .filter(isNotNill)
            .uniq()
            .value() as ClassroomName[];

        const teachers = _(lessons)
            .flatMap(lesson => lesson.teacherString?.split(', '))
            .filter(isNotNill)
            .value() as TeacherName[]

        const groups = _(lessons)
            .map(lesson => lesson.group)
            .uniq()
            .value() as GroupName[];

        // TODO: Add calls of analyser service for intellectual analysis of values.
        return { name, groups, slot: { ...slot, weekTypes }, classrooms, teachers, type } as Lesson;
    }

    /**
     * Groups elements of source collection to subarrays based on projection and comparator functions.
     * @param collection Collection of elements to group.
     * @param project Function to project each element to comparable value (default _.identity).
     * @param cmp Comparator function for comparable elements (default _.isEqual).
     * @returns An array of elements groups.
     */
    private groupByWith<T, TComparable>(collection: T[], project: (elem: T) => TComparable = _.identity, cmp: (a: TComparable, b: TComparable) => boolean = _.isEqual) {
        const map = new Map<T, TComparable>(_.map(collection, elem => [elem, project(elem)]));
        const groups = [] as T[][];
        for (const [elem, index] of collection.map((elem, index) => [elem, index] as const)) {
            if (index % 1000 === 0) {
                log(`Continueing iteration (element at index ${index} of ${collection.length}.)`);
            }
            const comparable = map.get(elem)!;
            const group = groups.find(([groupElem]) => cmp(map.get(groupElem)!, comparable));
            if (group) {
                group.push(elem);
            } else {
                groups.push([elem]);
            }
        }
        return groups;
    }

}