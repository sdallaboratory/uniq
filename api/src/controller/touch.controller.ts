import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { MongoService } from '../service/mongo.service';
import { Group } from '@solovevserg/uniq-shared/dist/models/group';
import { isRegex } from '@solovevserg/uniq-shared/dist/utils/is-regexp';

@autoInjectable()
export default class TouchController {

    constructor(
        private readonly mongo: MongoService,
    ) { }

    public async searchGroups(req: Request, res: Response) {
        const query = req.query.query || ''; // TODO: 
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for groups is incorrect'));
            return;
        }
        const mongo = await this.mongo.getClient();
        const db = mongo.db('2022-5-12') // TODO: Get database with latest possible data
        const collection = db.collection<Group>('groups');
        console.log(await collection.countDocuments());

        const groups = await collection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(groups.map(group => group.name));
    }

    public async searchTeachers(req: Request, res: Response) {
        const query = req.query.query || ''; // TODO: 
        if (typeof query !== 'string' || !isRegex(query)) {
            res.status(400).send(new Error('The query for groups is incorrect'));
            return;
        }
        const mongo = await this.mongo.getClient();
        const db = mongo.db('2022-5-12') // TODO: Get database with latest possible data
        const collection = db.collection<Group>('groups');
        console.log(await collection.countDocuments());

        const groups = await collection.find({ name: { $regex: query, $options: 'i' } }).toArray();
        res.status(200).send(groups.map(group => group.name));
    }

    public async getLessons(req: Request, res: Response) {
        const groups = req.query.groups || ''; // TODO: 
        if (typeof groups !== 'string' || !isRegex(groups)) {
            res.status(400).send(new Error('The query for groups is incorrect'));
            return;
        }
        const mongo = await this.mongo.getClient();
        const db = mongo.db('2022-5-12') // TODO: Get database with latest possible data
        const collection = db.collection<Group>('lessons');
        console.log(await collection.countDocuments());
        console.log(groups);
        const lessons = await collection.find({ groups: { $regex: groups, $options: 'i' } }).toArray();
        res.status(200).send(lessons);
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
