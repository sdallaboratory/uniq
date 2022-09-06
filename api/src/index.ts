import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { container } from 'tsyringe';
import AppRouter from './router/app.router';
import compression from 'compression';
import { cache } from './cache/app.cache';
import { log } from '@solovevserg/uniq-shared/dist/logging/log';
import { environment } from '@solovevserg/uniq-shared/dist/environemnt';

const app = express();
const router = container.resolve(AppRouter);

app.use(compression());
log('Gzip compression is enabled.');
app.use(morgan('tiny'));
log('Morgan logging utility is enabled.');
app.use(cors());
log('Cors is enabled.');

log('Starting in', process.env.NODE_ENV, 'configuration.');
if (environment.NODE_ENV === 'production') {
    app.use(cache(environment.CACHE_DURATION));
}

app.use('/api', router.routes);

app.listen(environment.PORT, () => {
    log('Server listening on port', environment.PORT)
});
