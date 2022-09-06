import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { container } from 'tsyringe';
import AppRouter from './router/touch.router';
import compression from 'compression';
import { cache } from './cache/touch.cache';
import { log } from '@solovevserg/uniq-shared/dist/logging/log';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';

const app = express();
const router = container.resolve(AppRouter);

app.use(compression());
app.use(morgan('tiny'));
app.use(cors());
if (environment.NODE_ENV === 'production') {
    log(process.env.NODE_ENV);
    app.use(cache(environment.CACHE_DURATION));
}

app.use('/api', router.routes);

app.listen(environment.PORT, () => {
    log('Server listening on port', environment.PORT)
});
