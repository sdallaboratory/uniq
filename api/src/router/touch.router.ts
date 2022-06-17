import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import TouchController from '../controller/touch.controller';
import { environment } from '../environment';

@autoInjectable()
export default class AppRouter {

    constructor(
        private controller: TouchController,
    ) {
        this.routes.get(
            '/groups',
            this.controller.searchGroups.bind(this.controller),
        );
        this.routes.get(
            '/lessons',
            this.controller.getLessons.bind(this.controller),
        );
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

    public readonly routes = Router();


}
