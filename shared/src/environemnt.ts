export const environment = {
    PORT: 3000,
    CACHE_DURATION: 30,
    BMSTU_ORIGIN: 'https://lks.bmstu.ru',
    mongoConnectionString: 'mongodb://mongo:27017', // TODO: Take value from env
    collectorIntervalMs: 1000 * 60 * 60 * 8 // 1 time per 8 hours  
}
