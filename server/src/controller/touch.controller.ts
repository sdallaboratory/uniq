import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import ScheduleService from '../service/schedule.service';

@autoInjectable()
export default class TouchController {

    constructor(
        private schedule: ScheduleService
    ) {}

    public async searchGroups(req: Request, res: Response) {
        const groups = await this.schedule.getGroupsUris();
        res.send(groups.map(group => group.name));
    }

    public async getCurrentWeek(req: Request, res: Response) {
        const week = await this.schedule.getCurrentWeek();
        res.send(week);
    }

    public async getGroupSchedule(req: Request, res: Response) {
        const groupName = req.params.groupName.toUpperCase();
        const groupSchedule = await this.schedule.getSchedule(groupName);
        res.send(groupSchedule);
    }

}
