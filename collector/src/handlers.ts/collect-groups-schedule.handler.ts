import { injectable } from "tsyringe";
import { LoaderService } from "../services/loader.service";
import { MongoService } from "../services/mongo.service";
import ParserService from "../services/parser.service";
import { Handler } from "./handler.interface";
import { log } from "@solovevserg/uniq-shared/dist/logging/log";
@injectable()
export class CollectGroupsScheduleHandler implements Handler {

    constructor(
        private readonly loader: LoaderService,
        private readonly parser: ParserService,
        private readonly mongo: MongoService,
    ) { }

    async execute() {
        const groupsCollection = await this.mongo.collection('groups');
        const rawLessonsCollection = await this.mongo.collection('raw-lessons');
        const handledGroups = await rawLessonsCollection.find().map(lesson => lesson.group).toArray();
        const handledGroupsSet = new Set(handledGroups);
        const groups = await groupsCollection.find({ path: { $exists: true } }).toArray();
        if(handledGroupsSet.size === groups.length) {
            log('All groups schedules are already collected. Any collecting logic will be skipped.');
            return;
        }
        log('Collecting schedules for ', groups.length ,'groups.');
        for (const group of groups) {
            if (!group.path) {
                throw new Error('path must be presented.');
            }
            if (handledGroupsSet.has(group.name)) {
                log('Group', group.name, 'was skipped as its schedule was previously colected.');
                continue;
            }
            const document = await this.loader.loadGroupSchedule(group.path);
            let lessons = await this.parser.parseGroupSchedule(document);
            lessons = lessons.map(lesson => ({...lesson, _uri: group._uri}));
            await rawLessonsCollection.insertMany(lessons);
            log('The scedule for group', group.name, 'was succesfully collected.');
        }
    }

}