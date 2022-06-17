import { autoInjectable } from 'tsyringe';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { GroupScheduleUri, WeekInfo } from '../interface/schedule.iterfaces';
import ParserService from './parser.service';
import { environment } from '../environment';

@autoInjectable()
export default class ScheduleService {

    private groupUris?: GroupScheduleUri[];

    constructor(
        private parser: ParserService,
    ) { }

    async getGroupUri(groupName: string) {
        const groupsUris = await this.getGroupsUris();
        const group = groupsUris.find(group => group.name === groupName) || null;
        return group && group.uri;
    }

    async getGroupsUris() {
        if (this.groupUris) {
            return this.groupUris;
        }
        const baseUri = environment.BMSTU_ORIGIN;
        const uri = `${baseUri}/schedule/list`;
        const resp = await fetch(uri).then(r => r.text());
        const {
            window: { document },
        } = new JSDOM(resp);
        const groupsUris: GroupScheduleUri[] = this.parser.parseGroupsUris(baseUri, document);
        this.groupUris = groupsUris;
        setTimeout(() => (this.groupUris = undefined), 30 * 60 * 1000);
        return groupsUris;
    }

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
        const resp = await fetch(groupGroupsUris[0].uri).then(r => r.text());
        const {
            window: { document },
        } = new JSDOM(resp);
        const week = this.parser.parseCurrentWeek(document);
        this.currentWeek = week;
        setTimeout(() => (this.currentWeek = undefined), 60 * 1000);
        return week;
    } 
    
    async getSchedule(uri: string) {
        const html = await fetch(uri).then(r => r.text());
        const document = new JSDOM(html).window.document;
        const groupSchedule = this.parser.parseGroupSchedule(document);
        return groupSchedule;
    }

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
