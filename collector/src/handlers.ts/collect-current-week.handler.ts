import { environment } from "@solovevserg/uniq-shared/dist/environemnt";
import { log } from "@solovevserg/uniq-shared/dist/logging/log";
import { injectable } from "tsyringe";
import { LoaderService } from "../services/loader.service";
import { MongoService } from "../services/mongo.service";
import ParserService from "../services/parser.service";
import { Handler } from "./handler.interface";

@injectable()
export class CollectCurrentWeekHandler implements Handler {

    constructor(
        private readonly loader: LoaderService,
        private readonly parser: ParserService,
        private readonly mongo: MongoService,
    ) { }

    async execute() {
        const groupsCollection = await this.mongo.collection('groups');
        const currentWeekCollection = await this.mongo.collection('current-week');
        const currentWeek = await currentWeekCollection.findOne();
        if (currentWeek) {
            log('The current week information is already collected. Any collecting logic will be skipped.');
            return;
        }
        log('Loading current week from ', environment.BMSTU_ORIGIN, '.');
        const group = await groupsCollection.findOne({ path: { $exists: true } });
        if (!group) {
            throw new Error('No groups with paths are presented in the database. At least one group is needed to collect currnet week information.');
        }
        const document = await this.loader.loadGroupSchedule(group.path!);
        log('Parsing currnet week from HTML.');
        const week = await this.parser.parseCurrentWeek(document);
        log('Saving parsed current week information (', week.type, ',', week.number, ') to the database.');
        await currentWeekCollection.insertOne(week);
    }

}
