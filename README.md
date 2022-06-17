# Uniq
ru | [en (draft)](/README/README.en.md)

Удобное приложение расписаний для студентов МГТУ 


## План работы

1. Инициализировать проект
   1. Настроить все 4 проекта
   2. Добавить Docker Compose с 4 сервисами (collector, api, client, mongo)
2. Реализовать сервис для сбора данных
   1. Настроить TypeScript сервер и реализовать там запуск job'ы по таймеру
   2. Собирать данные с официальной страницы
   3. Предобрабатывать и группировать данные (объединять пары из расписания групп, если это общая лекция, СР или )
   4. В Mongo будут лежать объекты струтктуры (Предмет, время, неделя? (чс/зн), препод?, список групп без повторений, аудитория?). Данные о корпусе, курсе, детализацию группы и т.д. вычисляем динамически
   5. Потом, возможно, мы пересядем на АПИ Битопа
3. Реализовать сервис АПИ
   1. Заскаффолдить NestJS
   2. /api/scedule?groups&teacher&classroom&...
   3. /api/calendar/weeks
   4. Добавить Swagger
4. Реализовать моковую логику сервера для разработки летом
5. Реализовать веб-клиент
   1. Заскаффолдить приложение
   2. Настроить роутинг
   3. Релизовать сервисы API
