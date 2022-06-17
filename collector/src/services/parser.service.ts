import _, { add } from 'lodash';
import { isNotNill } from '@solovevserg/uniq-shared/dist/utils/is-not-nill';
import { timeSlotMap } from '@solovevserg/uniq-shared/dist/utils/time-slot-map';
import { timeRange } from '@solovevserg/uniq-shared/dist/models/time/time-range';
import { Group } from '@solovevserg/uniq-shared/dist/models/group';
import { Lesson, LessonRaw } from '@solovevserg/uniq-shared/dist/models/lesson';
import { WeekType } from '@solovevserg/uniq-shared/dist/models/week-type';

export default class ParserService {

    public parseGroupsUris(baseUri: string, document: Document) {
        const anchors = document.querySelectorAll('.list-group .panel .btn-group a');
        const groupsUris: Group[] = [...anchors].map(anchor => ({
            uri: `${baseUri}${anchor.getAttribute('href')}`,
            name: anchor.textContent!.split(/\s/).join(''),
        }));
        return groupsUris;
    }

    public parseCurrentWeek(document: Document) {
        const weekElem = document.querySelector('.page-header h4 i');

        if (!weekElem) {
            return {
                number: 0,
                weekName: 'Не учебная',
            };
        }
        const text = weekElem.textContent || '';
        const week = {
            number: +/\d+/.exec(text)![0],
            weekName: _.last(text.split(' '))!,
        };
        return week;
    }

    private parseGroupName(document: Document) {
        return document.querySelector('.page-header h1')!.textContent!.split(' ')[1];
    }

    private readonly groupRegex = /(?<group>(?<department>(?<faculty>[а-яёА-ЯЁ]+)\d?\d?)+-(?<semester>\d\d?)(?<number>\d)(?<form>[бмаБМА]?))/i;

    public parseGroupSchedule(document: Document) {
        const scheduleHeader = document.querySelector('h1')!.textContent!;
        // console.log(scheduleHeader);
        const { group } = this.groupRegex.exec(scheduleHeader)?.groups!;
        return [...document.querySelectorAll('.hidden-xs tbody')].flatMap(
            day => this.parseDaySchedule(day as HTMLBodyElement)
        ).map(lesson => ({ ...lesson, groups: [group] } as LessonRaw));
    }

    private parseDaySchedule(tbody: Element,) {
        const dayOfWeek = this.parseDayName(tbody);
        return this.parseDayLessonsTable(tbody)
            .map(lesson => ({ ...lesson, dayOfWeek }));
    }

    private parseDayName(tbody: Element) {
        return tbody.querySelector('strong')!.textContent!.toLowerCase();
    }

    private parseDayLessonsTable(tbody: Element) {

        function parseLessonCell(lessonElement: Element) {

            if (!lessonElement.querySelector('span')?.textContent) {
                return undefined;
            }

            const [type, name, location, teacher] = [...lessonElement.querySelectorAll('i, span')]
                .filter(isNotNill)
                .map(elem => elem.textContent || '')
                .map(elem => elem.replace(/\s+/, ' '))
                .map(elem => elem || undefined);

            return { type: type?.replace(/\(\)/, ''), name, classrooms: location?.split(/[\s,]+/), teacher };
        }


        return [...tbody.querySelectorAll('tr')]
            .slice(2)
            // .filter(tr => tr.querySelector('td > span')?.textContent)
            .flatMap(elem => {
                const timeRangeElement = elem.firstElementChild!;
                const timeRange = timeRangeElement.textContent! as timeRange;
                const slot = timeSlotMap.direct(timeRange);
                return [
                    { ...parseLessonCell(timeRangeElement.nextElementSibling!), weekType: 'зн' as WeekType },
                    { ...parseLessonCell(elem.lastElementChild!), weekType: 'чс' as WeekType },
                ].filter(lesson => lesson.name)
                    .map(lesson => ({ ...lesson, slot }));
            }).filter(isNotNill);
    }

}

// function groupWith<T, TCopmarable = T>(collection: T[], project: (elem: T) => TCopmarable = _.identity, comparator: (a: TCopmarable, b: TCopmarable) => boolean = _.isEqual) {
//     const map = new Map<T, TCopmarable>(collection.map(element => [element, project(element)]));
//     const groups = [] as T[][];
//     for (const element of collection) {
//         groups.forEach(group => {
//             const [first] = group;
//             const existing = map.get(first)!;
//             const adding = map.get(element)!;
//             if (comparator(existing, adding)) {
//                 group.push(element);
//                 continue;
//             }
//             groups.push([element]);
//         })
//     }
// }

// function merge(lessons: Lesson[], fields: keyof Lesson[], merge: (lessons: Lesson[]) => Lesson) {
//     const groups = _.(lessons, l => _(l).pick(fields).val)
// }
