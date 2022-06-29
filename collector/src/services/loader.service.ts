import { environment } from "@solovevserg/uniq-shared/dist/environemnt";
import { JSDOM } from "jsdom";
import { injectable } from "tsyringe";

@injectable()
export class LoaderService {

    /**
     * Loads HTML document from network and parses it.
     * @param path E.g. `/schedule/list`.
     * @param origin Default `environment.BMSTU_ORIGIN`.
     * @returns Parsed HTML page as Document object.
     */
    private async loadHtml(path: string, origin = environment.BMSTU_ORIGIN) {
        if (path[0] !== '/') {
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
        return this.loadHtml(path);
    }

    async loadGroupSchedule(groupSchedulePath: string) {
        return this.loadHtml(groupSchedulePath);
    }
}