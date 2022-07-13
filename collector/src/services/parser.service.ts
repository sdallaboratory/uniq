import _ from 'lodash';
import { timeRangeToSlot } from '@solovevserg/uniq-shared/dist/data/time-range-to-slot';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';
import { IGroup } from '@solovevserg/uniq-shared/dist/models/group/group.interface';
import { IRawLesson } from '@solovevserg/uniq-shared/dist/models/lesson/raw-lesson.interface';
import { TimeRange } from '@solovevserg/uniq-shared/dist/models/time/time-range';
import { DayOfWeek } from '@solovevserg/uniq-shared/dist/models/time/day-of-week';
import { WeekType } from '@solovevserg/uniq-shared/dist/models/time/week-type';
import { RawWeekType } from '@solovevserg/uniq-shared/dist/models/time/raw-week-type';
import { log } from '@solovevserg/uniq-shared/dist/logging/log';
import { Week } from '@solovevserg/uniq-shared/dist/models/time/week';
import { GroupName } from '@solovevserg/uniq-shared/dist/models/group/group-name';

export default class ParserService {

    public parseGroups(document: Document) {
        const origin = environment.BMSTU_ORIGIN;
        const anchors = document.querySelectorAll('.list-group .panel .btn-group a');
        const groupsUris = [...anchors].map(anchor => ({
            _uri: `${origin}${anchor.getAttribute('href')}`,
            path: anchor.getAttribute('href') || undefined,
            name: anchor.textContent!.split(/\s/).join(''),
        } as IGroup));
        return groupsUris;
    }

    public parseCurrentWeek(document: Document) {
        const weekElem = document.querySelector('.page-header h4 i');
        if (!weekElem?.textContent) {
            throw new Error('Error while parsing current week. No information presented in HTML.');
        }

        const map: Record<RawWeekType, WeekType> = {
            'числитель': WeekType.Numerator,
            'знаменатель': WeekType.Denominator,
        } as const;

        const [number, , type] = weekElem.textContent?.split(' ');

        const week = {
            number: Number(number),
            type: map[type as RawWeekType],
        } as Week;

        return week;
    }

    public parseGroupSchedule(document: Document) {
        const group = this.parseGroupName(document);
        log('Parsing group', group, 'schedule.');
        return [...document.querySelectorAll('.hidden-xs tbody')].flatMap(
            day => this.parseDaySchedule(day as HTMLTableElement)
        ).map(lesson => ({ ...lesson, group } as IRawLesson));
    }

    private parseGroupName(document: Document) {
        const group = document.querySelector('.page-header h1')?.textContent?.split(' ')[1].trim();
        if (!group) {
            throw new Error('No group name presented in HTML.');
        }
        return group as GroupName;
    }

    private parseDaySchedule(tbody: HTMLTableElement) {
        const dayOfWeek = this.parseDayName(tbody);
        return this.parseDayLessonsTable(tbody)
            .map(({ weekTypes, lessonNumber, ...lesson }) => ({
                ...lesson,
                slot: { dayOfWeek, lessonNumber, weekTypes }
            }));
    }

    private parseDayName(tbody: Element) {
        return tbody.querySelector('strong')!.textContent!.toLowerCase() as DayOfWeek;
    }

    private parseDayLessonsTable(tbody: HTMLTableElement) {
        return [...tbody.querySelectorAll('tr')]
            .slice(2)
            // .filter(tr => tr.querySelector('td > span')?.textContent)
            .flatMap(elem => {
                const timeRangeElement = elem.firstElementChild!;
                const timeRange = timeRangeElement.textContent! as TimeRange;
                const lessonNumber = timeRangeToSlot.get(timeRange)?.lessonNumber;
                if (!lessonNumber) {
                    throw new Error('Incorrect time range provided. Ensure you provide correct table element.');
                }
                return [
                    {
                        ...this.parseLessonCell(timeRangeElement.nextElementSibling as HTMLTableCellElement),
                        weekTypes: [WeekType.Numerator]
                    },
                    {
                        ...this.parseLessonCell(elem.lastElementChild as HTMLTableCellElement),
                        weekTypes: [WeekType.Denominator]
                    },
                ].filter(lesson => lesson.name).map(lesson => ({ ...lesson, lessonNumber }));
            })
    }

    parseLessonCell(lessonElement: HTMLTableCellElement) {
        if (!lessonElement.querySelector('span')?.textContent?.trim()) {
            return undefined;
        }

        const [type, name, classroomString, teacher] = [...lessonElement.querySelectorAll('i, span')]
            .map(elem => elem.textContent || undefined)
            .map(elem => elem?.trim().replace(/\s+/g, ' '));

        if (!name) {
            throw new Error('Lesson must contain name. Check wheter you have provided correct table cell element.');
        }

        return { name, type, classroomString, teacher };
    }

}
