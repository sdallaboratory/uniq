import { log } from "@solovevserg/uniq-shared/dist/logging/log";
import { Classroom } from "@solovevserg/uniq-shared/dist/models/classroom/classroom";
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
            .orderBy()
            .map(name => ({ name } as Classroom))
            .value();

        log('Saving', classrooms.length, 'classrooms to the database.');
        await classroomsCollection.insertMany(classrooms);
    }

}