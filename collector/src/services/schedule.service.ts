import { autoInjectable } from 'tsyringe';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import ParserService from './parser.service';
import { environment } from '../environment';
import { WeekInfo } from '@solovevserg/uniq-shared/dist/models/schedule.iterfaces';
import { Group } from '@solovevserg/uniq-shared/dist/models/group';

@autoInjectable()
export default class ScheduleService {

    constructor(
        private parser: ParserService,
    ) { }

    // TODO: Remove this code
    // async getGroupUri(groupName: string) {
    //     const groupsUris = await this.getGroupsUris();
    //     const group = groupsUris.find(group => group.name === groupName);
    //     return group?.uri;
    // }

    async getGroupsUris() {
        const baseUri = environment.BMSTU_ORIGIN;
        const uri = `${baseUri}/schedule/list`;
        const resp = await fetch(uri).then(r => r.text());
        const {
            window: { document },
        } = new JSDOM(resp);
        const groups: Group[] = this.parser.parseGroupsUris(baseUri, document);
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
        const groupGroupsUris = await this.getGroupsUris();
        if (!groupGroupsUris.length) {
            return {
                number: 0,
                weekName: 'Не учебная',
            };
        }
        const group = groupGroupsUris.find(group => group.uri !== undefined) as Required<Group> | undefined; // TODO: make typing more implicit
        if (!group) {
            throw new Error('There are no groups with scedule links');
        }
        const resp = await fetch(group.uri).then(r => r.text());
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
        const links = await this.getGroupsUris();
        const groups = links.map(link => link.name);
        const matched = _.take(
            groups.filter(group => group.includes(query)),
            limit,
        );
        return matched;
    }

}
