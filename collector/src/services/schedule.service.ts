import { autoInjectable } from 'tsyringe';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import ParserService from './parser.service';
import { WeekInfo } from '@solovevserg/uniq-shared/dist/models/schedule.iterfaces';
import { Group } from '@solovevserg/uniq-shared/dist/models/group';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';

@autoInjectable()
export default class ScheduleService {

    constructor(
        private parser: ParserService,
    ) { }

    /**
     * Loads HTML document from network and parses it.
     * @param path E.g. `/schedule/list`.
     * @param origin Default `environment.BMSTU_ORIGIN`.
     * @returns Parsed HTML page as Document object.
     */
    private async loadHtml(path: string, origin = environment.BMSTU_ORIGIN) {
        if(path[0] !== '/') {
            throw new Error(`path must start with leading slash. E.g '/shcedule/list'`);
        }
        const uri = `${origin}${path}`;
        const response = await fetch(uri);
        const html = await response.text();
        const dom = new JSDOM(html);
        return dom.window.document;
    }

    async loadGroups() {
        const path = `/schedule/list`;
        const document = await this.loadHtml(path);
        const groups = this.parser.parseGroups(document);
        return groups;
    }

    async getSchedule(uri: string) {
        const html = await fetch(uri).then(r => r.text());
        const document = new JSDOM(html).window.document;
        const groupSchedule = this.parser.parseGroupSchedule(document);
        return groupSchedule;
    }

    // TODO: Refactor getting week logic
    private currentWeek?: WeekInfo;
    async getCurrentWeek() {
        if (this.currentWeek) {
            return this.currentWeek;
        }
        const groupGroupsUris = await this.loadGroups();
        if (!groupGroupsUris.length) {
            return {
                number: 0,
                weekName: 'Не учебная',
            };
        }
        const group = groupGroupsUris.find(group => group.path !== undefined) as Required<Group> | undefined; // TODO: make typing more implicit
        if (!group) {
            throw new Error('There are no groups with scedule links');
        }
        const resp = await fetch(group.path).then(r => r.text());
        const {
            window: { document },
        } = new JSDOM(resp);
        const week = this.parser.parseCurrentWeek(document);
        this.currentWeek = week;
        setTimeout(() => (this.currentWeek = undefined), 60 * 1000);
        return week;
    }

    // TODO: Move this code to another service connected to a DB
    async searchGroups(query: string, limit: number) {
        const links = await this.loadGroups();
        const groups = links.map(link => link.name);
        const matched = _.take(
            groups.filter(group => group.includes(query)),
            limit,
        );
        return matched;
    }

}
