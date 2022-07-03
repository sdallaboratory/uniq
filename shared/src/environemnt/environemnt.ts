import { getEnv } from "../utils/get-env"
import { prodEnvironment } from "./environemnt.prod";
import { devEnvironemtn } from "./environment.dev";

const env = getEnv();

const isProduction = env.NODE_ENV === 'production';

export const environment = {
    PORT: 3000,
    CACHE_DURATION: 30,
    BMSTU_ORIGIN: 'https://lks.bmstu.ru',
    collectorIntervalMs: 1000 * 60 * 60 * 8, // 1 time per 8 hours  
    ...(isProduction ? prodEnvironment : devEnvironemtn),
    ...env,
}
