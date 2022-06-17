import { singleton } from 'tsyringe';
import { CacheClass } from 'memory-cache';
import { Request, NextFunction, Response, Send } from 'express';

export function cache(duration: number) {
    const memCache = new CacheClass<string, string>();
    return (req: Request, res: Response, next: NextFunction) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cacheContent = memCache.get(key);
        if (cacheContent) {
            res.send(cacheContent);
            return;
        }
        else {
            const sendResponse = res.send;
            res.send = (body => {
                memCache.put(key, body, duration * 1000);
                sendResponse.call(res, body)
            }) as Send;
            next();
        }
    }
}