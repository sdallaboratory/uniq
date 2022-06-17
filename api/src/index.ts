import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { container } from 'tsyringe';
import AppRouter from './router/touch.router';
import { environment } from './environment';
import compression from 'compression';
import { cache } from './cache/touch.cache';

const app = express();
const router = container.resolve(AppRouter);

app.use(compression());
app.use(morgan('tiny'));
app.use(cors());
if (process.env.NODE_ENV === 'production') {
    console.log(process.env.NODE_ENV);
    app.use(cache(environment.CACHE_DURATION));
}
app.use('/api', router.routes);

app.listen(environment.PORT, () => {
    console.log('Server listening on port', environment.PORT)
});
