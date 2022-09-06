import { Router } from 'express';
import { injectable } from 'tsyringe';
import TouchController from '../controller/touch.controller';

@injectable()
export default class AppRouter {

    constructor(
        private controller: TouchController,
    ) {
        // this.routes.get(
        //     '/groups',
        //     this.controller.getGroups.bind(this.controller),
        // );
        // this.routes
        // this.routes.get(
        //     '/schedule/current-week',
        //     this.cache.cacheMiddleware(environment.CACHE_DURATION).bind(this.cache),
        //     this.controller.getCurrentWeek.bind(this.controller),
        // );
        // this.routes.get(
        //     '/schedule/groups/:groupName',
        //     this.cache.cacheMiddleware(environment.CACHE_DURATION).bind(this.cache),
        //     this.controller.getGroupSchedule.bind(this.controller),
        // );
    }

    public readonly routes = Router()
        .get(
            '/groups',
            this.controller.getGroups.bind(this.controller),
        )
        .get(
            '/lessons',
            this.controller.getLessons.bind(this.controller),
        );


}
