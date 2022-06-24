# Uniq API

| Основные технологии | Node.js, TypeScript, NestJS |
| --- | --- |
| зависимости | Mongo |

Реализует набор контроллеров по правилу одна сущность — один контроллер. Таким образом, получаем контроллеры:

- Groups
  - GET /api/groups?query
    - query (RegExp)
- Lessons
  - GET /api/lessons?group&teacher&classroom
    - group (string) — exact match
    - teacher (string) — exact match
    - classroom (string) — exact match
- Teachers
  - GET /api/teachers?query
    - query (RegExp)
- Classrooms
  - GET /api/classrooms?query?
    - query (RegExp)
  - GET /api/classrooms/free?at=slot
    - at (number, required)
