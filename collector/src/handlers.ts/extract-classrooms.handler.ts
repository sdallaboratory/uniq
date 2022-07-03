import { log } from "@solovevserg/uniq-shared/dist/logging/log";
import { IClassroom } from "@solovevserg/uniq-shared/dist/models/classroom/classroom.interface";
import { isNotNill } from "@solovevserg/uniq-shared/dist/utils/is-not-nill";
import _ from "lodash";
import { injectable } from "tsyringe";
import { MongoService } from "../services/mongo.service";
import { Handler } from "./handler.interface";

@injectable()
export class ExtractClassroomsHandler implements Handler {

    constructor(
        private readonly mongo: MongoService,
    ) { }

    async execute() {
        const classroomsCollection = await this.mongo.collection('classrooms');
        const classroomsCount = await classroomsCollection.countDocuments();
        if (classroomsCount !== 0) {
            log('Classrooms are already extracted. Skipping extracting logic.');
            return;
        }
        
        log('Retrieving lessons from the database.')
        const lessonsCollection = await this.mongo.collection('lessons');
        const lessons = await lessonsCollection.find().toArray();
        
        log('Mapping lessons to classrooms.')
        const classrooms = _(lessons)
            .flatMap(lesson => lesson.classrooms)
            .filter(isNotNill)
            .uniq()
            .map(name => ({ name } as IClassroom))
            .value();

        log('Saving', classrooms.length, 'classrooms to the database.');
        await classroomsCollection.insertMany(classrooms);
    }

}