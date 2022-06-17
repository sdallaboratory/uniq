import { singleton } from 'tsyringe';
import memoryCache, { CacheClass } from 'memory-cache';
import { Request, NextFunction, Response, Send } from 'express';

@singleton()
export default class TouchCache {

    private memCache: CacheClass<string, string>;

    constructor() {
        this.memCache = new memoryCache.Cache();
    }

    public cacheMiddleware = (duration: number) => {
        return (req: Request, res: Response, next: NextFunction) => {
            let key =  '__express__' + req.originalUrl || req.url;
            let cacheContent = this.memCache.get(key);
            if (cacheContent) {
                res.send(cacheContent);
                return;
            }
            else {
                const sendResponse = res.send;
                res.send = (body => {
                    this.memCache.put(key, body, duration * 1000);
                    sendResponse.call(res, body)
                }) as Send;
                next();
            }
        }
    }

}