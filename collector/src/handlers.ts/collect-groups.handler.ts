import { environment } from "@solovevserg/uniq-shared/dist/environemnt";
import { log } from "@solovevserg/uniq-shared/dist/logging/log";
import { TerminateHandlersChainError } from "@solovevserg/uniq-shared/dist/errors";
import { injectable } from "tsyringe";
import { LoaderService } from "../services/loader.service";
import { MongoService } from "../services/mongo.service";
import ParserService from "../services/parser.service";
import { Handler } from "./handler.interface";

@injectable()
export class CollectGroupsHandler implements Handler {

    constructor(
        private readonly loader: LoaderService,
        private readonly parser: ParserService,
        private readonly mongo: MongoService,
    ) { }

    async execute() {
        const groupsCollection = await this.mongo.collection('groups');
        const groupsCount = await groupsCollection.countDocuments();
        if (groupsCount !== 0) {
            log('Groups are already collected. Any collecting logic will be skipped.')
            return;
        }
        log('Loading groups list from ', environment.BMSTU_ORIGIN, '.');
        const document = await this.loader.loadGroups();
        log('Parsing groups list from HTML');
        const groups = await this.parser.parseGroups(document);
        if (!groups.length) {
            throw new TerminateHandlersChainError(`No groups detected. It seems like ${environment.BMSTU_ORIGIN} currently doesn't provide groups' schedule.`);
        }
        log('Saving', groups.length, 'parsed groups to database.');
        await groupsCollection.insertMany(groups);
    }

}