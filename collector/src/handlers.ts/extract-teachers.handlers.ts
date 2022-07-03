import { log } from "@solovevserg/uniq-shared/dist/logging/log";
import { ITeacher } from "@solovevserg/uniq-shared/dist/models/teacher/teacher.interface";
import { isNotNill } from "@solovevserg/uniq-shared/dist/utils/is-not-nill";
import _ from "lodash";
import { injectable } from "tsyringe";
import { MongoService } from "../services/mongo.service";
import { Handler } from "./handler.interface";

@injectable()
export class ExtractTeachersHandler implements Handler {

    constructor(
        private readonly mongo: MongoService,
    ) { }

    async execute() {
        const teachersCollection = await this.mongo.collection('teachers');
        const teachersCount = await teachersCollection.countDocuments();
        if (teachersCount !== 0) {
            log('Teachers are already extracted. Skipping extracting logic.');
            return;
        }
        
        log('Retrieving lessons from the database.')
        const lessonsCollection = await this.mongo.collection('lessons');
        const lessons = await lessonsCollection.find().toArray();
        
        log('Mapping lessons to teachers.')
        const teachers = _(lessons)
            .map(lesson => lesson.teacher)
            .filter(isNotNill)
            .uniq()
            .map(name => ({ name } as ITeacher))
            .value();

        log('Saving', teachers.length, 'teachers to the database.');
        await teachersCollection.insertMany(teachers);
    }

}