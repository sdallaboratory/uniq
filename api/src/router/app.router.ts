import { Router } from 'express';
import { injectable } from 'tsyringe';
import AppController from '../controller/app.controller';

@injectable()
export default class AppRouter {

    constructor(
        private controller: AppController,
    ) { }

    public readonly routes = Router()
        .get(
            '/groups',
            this.controller.getGroups.bind(this.controller),
        )
        .get(
            '/lessons',
            this.controller.getLessons.bind(this.controller),
        )
        .get(
            '/teachers',
            this.controller.getTeachers.bind(this.controller),
        )
        .get(
            '/current-week',
            this.controller.getCurrentWeek.bind(this.controller),
        );


}
