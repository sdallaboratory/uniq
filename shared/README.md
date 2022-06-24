# Uniq Shared

Общая для сервера и клиента бизнес-логика, модели и утилиты.

Все функции-утилиты реализууются таким образом, чтобы они запускались как на стороне клиента, так и на сервере. Общее правило состоит в том, что вся логика, которая может быть вынесена в shared, должна быть вынесена. Все используемые в утилитах вызовы АПИ сторонних библиотек должны быть реализованы с использованием подходов, допускающих tree shaking (например, lodash следует использовать исключительно через flow).

Все утилиты, которые представляют собой законченный функционал (например, функция GroupByWith или isNotNill могут быть вынесены как отдельные библиотеки)

## Классы моделей

Для каждой модели создаётся интерфейс и класс:

1. интерфейс для БД/DTO (`ILessson` в `lesson.interface.ts`)
2. класс контейнер для работы на клиенте (`Lesson` в `lesson.class.ts`)

```typescript
interface ILesson {
    groups: string[];
    classrooms: IClassroom[];
    slot: number;
}

class Lesson implements ILesson {

    groups: string[];
    
    @Type(() => Classroom)
    classrooms: Classroom[];

    @Type(() => Slot)
    slot: Slot;

    public static create(lesson: ILesson): Lesson {
        if (lesson instanceof Lesson) {
            throw new Error('Provided source object must be plain, not class.');
        }
        return plainToClass(Lesson, lesson);
    }

    constructor(lesson: ILesson) {
        plainToClassFromExist(this, lesson) // Если не заработает, сделать private
    }
}

type ISLot = number;

class Slot extends Number {
    public get startTime(): Time; // 08:30
    public get endTime(): Time;
    public get timeRange(): TimeRange; // 08:30 - 10:05
    public static fromStartTime(startTime: string): Slot;
}

type IGroup = string;

class Group {
    constructor(
        @Transform(({ value }) => moment(value), { toClassOnly: true })
        private readonly name: string,
    ) {}

    public toString() {
        return this.name;
    }
}
```

Для конвертации POJO в экземпляры классов используется библиотека `class-transformer`.

Для работы с датами используются нативные объекты `Date` и библиотека `date-fns`.

## Сущности предметной области

Сущности предметной области (⭐ отмечены ключевые, моделирование которых необходимо для реализации базового функционала).

1. Lesson (Занятие) ⭐
2. Group (Учебная группа) ⭐
3. TimeSlot (Слот) ⭐
4. Teacher (Преподаватель) ⭐
5. Classroom (Аудитория) ⭐
6. ScheduleTable (Таблица Расписания) - упрощённо говоря, 1 или более набор не пересекающихся по времени занятий.
7. Building (Корпус)
8. University (Университет)
9. (Кафедра) <!-- 8. Перевести -->
10. Department (Факультет)
11. WeekType (Тип недели)

## Платформонезависимая общая бизнес-логика

1. Выведение списка учебных групп на основании массива занятий
2. Выведение списка аудиторий на основании массива занятий
3. Логика фильтрации аудиторий (каф, ...)
4. Поиск по списку групп
5. Поиск по списку преподавателей
6. Поиск по списку аудиторий
7. Парсинг названия группы
8. Преобразование плоского списка групп а иерархию
9. Вычисление оптимальных слотов для встречи (может быть реализовано в моделии ООП как класс ScheduleTable)
10. Вычисление свободных аудиторий в определенное время на основании полной информации о расписании

```typescript
function extractGroups(lessons: ILesson[]): IGroup[];
function extractClassrooms(lesson: ILesson[]): IClassroom[];

// TODO: Should I make class for Groups or just use simple strings?
function searchGroups<TGroup exrends IGroup>(groups: TGroup[], query: string): TGroup[];
function searchTeachers<TTeacher exrends ITeacher>(teachers: TTeacher[], query: string): TTeacher[];
function searchClassroom<TClassroom exrends IClassroom>(classrooms: TClassroom[], query: string): TClassroom[];

function parseGroup(group: string): Group;
function makeGroupTree(groups: string[]): Node<string>;
function calculateOptimalSlots(schedule: ScheduleTable): ITimeSlot[];

class Lesson {
    public isAt(slot: ITimeSlot): boolean {
        return isEqual(this.slot, slot)
    }
}

interface ITimeSlot {
    readonly lessonNumber: number;
    readonly weekType: WeekType;
    readonly dayOfWeek: DayOfWeek;
}
```

## Данные

Помимо всего прочего, в shared могут храниться некоторые данные - знания о предметной области. К их числу относится:

1. Информация о времени начала и окончания занятий, продолжительности перерывов
2. Информация о корпусах
3. Информация об университете

Остаётся вопросом как реализовать DI, совместимый с Nest и Angular для сервисов, вынесенных в shared. Веротяно, придётся ограничится зависимости через нативные TS-модули, либо же с использованием TSyringe.

Все вычисления, требующие итерирования коллекции занятий должны быть вынесены на стороне клиента в WebWorker'ов (через `observable-webworker`). При передаче данных между основным процессом и процессом воркера, будет происходить потеря информации о классах. Эту информацию необходимо восстанавливать.

Хранение всех данных на стороне клиента осуществляется через indexedDB (вероятно, через обёртку какой-либо библиотеки для удобства использования)

## Утилиты

1. rawLessonToLesson
2. extractGroups
3. extractClassrooms
4. filterGroups
5. filterClassroom
6. filterTeachers
7. makeGroupsTree
8. calculateOptimalSlots
9. mergeLessonsRaw
10. groupByWith
