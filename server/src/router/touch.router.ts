import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import TouchController from '../controller/touch.controller';
import TouchCache from '../cache/touch.cache';
import { environment } from '../environment';

@autoInjectable()
export default class AppRouter {

    constructor(
        private controller: TouchController,
        private cache: TouchCache
    ) {}

    public readonly routes = Router().get(
        '/schedule/groups', 
        this.cache.cacheMiddleware(environment.CACHE_DURATION).bind(this.cache), 
        this.controller.searchGroups.bind(this.controller),
    ).get(
        '/schedule/current-week', 
        this.cache.cacheMiddleware(environment.CACHE_DURATION).bind(this.cache), 
        this.controller.getCurrentWeek.bind(this.controller),
    ).get(
        '/schedule/groups/:groupName', 
        this.cache.cacheMiddleware(environment.CACHE_DURATION).bind(this.cache), 
        this.controller.getGroupSchedule.bind(this.controller),
    );

}
