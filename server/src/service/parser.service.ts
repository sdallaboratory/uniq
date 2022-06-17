import { GroupScheduleUri, DaySchedule, GroupSchedule, Lesson, WeekType } from '../interface/schedule.iterfaces';
import _, { add } from 'lodash';
import { isNotNill } from '../utils/is-not-nill';

export default class ParserService {

    public parseGroupsUris(baseUri: string, document: Document) {
        const anchors = document.querySelectorAll('.list-group .panel .btn-group a');
        const groupsUris: GroupScheduleUri[] = [...anchors].map(anchor => ({
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
        const {group} = this.groupRegex.exec(scheduleHeader)?.groups!;
        return [...document.querySelectorAll('.hidden-xs tbody')].flatMap(
            day => this.parseDaySchedule(day as HTMLBodyElement)
        ).map(lesson => ({ ...lesson, groups: [group] }));
    }

    private parseDaySchedule(tbody: Element,) {
        const dayOfWeek = this.parseDayName(tbody);
        return this.parseDayLessonsTable(tbody)
            .map(lesson => ({ ...lesson, dayOfWeek }));
    }

    private parseDayName(tbody: Element) {
        return tbody.querySelector('strong')!.textContent!.toLowerCase();
    }

    private readonly map = new Map([
        ['08:30 - 10:05', 1],
        ['10:15 - 11:50', 2],
        ['12:00 - 13:35', 3],
        ['13:50 - 15:25', 4],
        ['15:40 - 17:15', 5],
        ['17:25 - 19:00', 6],
        ['19:10 - 20:45', 7],
    ]);

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
                const timeRange = timeRangeElement.textContent!;
                const slot = this.map.get(timeRange);
                return [
                    {...parseLessonCell(timeRangeElement.nextElementSibling!), weekType: 'зн'},
                    {...parseLessonCell(elem.lastElementChild!), weekType: 'чс'},
                ].filter(lesson => lesson.name)
                .map(lesson => ({ ...lesson, slot }));
            }).filter(isNotNill) as Lesson[];
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
