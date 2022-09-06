import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { MongoService } from '../service/mongo.service';
import { isRegex } from '@solovevserg/uniq-shared/dist/utils/is-regexp';
// import { Group } from '@solovevserg/uniq-shared/dist/models/group/group';
// import { Lesson } from '@solovevserg/uniq-shared/dist/models/lesson/lesson';
import _ from 'lodash';

@injectable()
export default class TouchController {

    constructor(
        private readonly mongo: MongoService,
    ) { }

    public async getGroups(req: Request, res: Response) {
        const query = req.query.query || ''; // TODO: 
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for groups is incorrect'));
            return;
        }
        const groupsCollection = await this.mongo.collection('groups');
        const groups = await groupsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(groups.map(group => group.name));
    }

    public async getTeachers(req: Request, res: Response) {
        const query = req.query.query || ''; // TODO: 
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for teachers is incorrect'));
            return;
        }
        const teachersCollection = await this.mongo.collection('teachers');
        const teachers = await teachersCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(teachers.map(group => group.name));
    }

    public async getLessons(req: Request, res: Response) {
        const query = req.query.query || ''; // TODO: 
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for lessons is incorrect'));
            return;
        }
        const lessonsCollection = await this.mongo.collection('lessons');
        const lessons = await lessonsCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(lessons.map(lesson => _.omit(lesson, '_id')));
    }

    // public async getCurrentWeek(req: Request, res: Response) {
    //     const week = await this.schedule.getCurrentWeek();
    //     res.send(week);
    // }

    // public async getGroupSchedule(req: Request, res: Response) {
    //     const groupName = req.params.groupName.toUpperCase();
    //     const groupSchedule = await this.schedule.getSchedule(groupName);
    //     res.send(groupSchedule);
    // }

}
