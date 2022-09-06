import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { MongoService } from '../services/mongo.service';
import { isRegex } from '@solovevserg/uniq-shared/dist/utils/is-regexp';
import _ from 'lodash';

@injectable()
export default class AppController {

    constructor(
        private readonly mongo: MongoService,
    ) { }

    public async getGroups(req: Request, res: Response) {
        const query = req.query.query || '';
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for groups is incorrect'));
            return;
        }
        const groupsCollection = await this.mongo.collection('groups');
        const groups = await groupsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(groups.map(group => group.name));
    }

    public async getTeachers(req: Request, res: Response) {
        const query = req.query.query || '';
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for teachers is incorrect'));
            return;
        }
        const teachersCollection = await this.mongo.collection('teachers');
        const teachers = await teachersCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(teachers.map(group => group.name));
    }

    public async getLessons(req: Request, res: Response) {
        const query = req.query.query || '';
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query parameter for lessons is incorrect. It must be valid regex.'));
            return;
        }
        const lessonsCollection = await this.mongo.collection('lessons');
        const lessons = await lessonsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        const withoutInternalIds = lessons.map(lesson => _.omit(lesson, '_id'))
        res.status(200).send(withoutInternalIds);
    }

    public async getCurrentWeek(req: Request, res: Response) {
        const currentWeekCollection = await this.mongo.collection('current-week');
        const week = await currentWeekCollection.findOne();
        const withoutId = _.omit(week, '_id');
        res.send(withoutId);
    }
}
