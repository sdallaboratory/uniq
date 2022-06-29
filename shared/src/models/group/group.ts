import { IGroup } from "./group.interface";
import { plainToInstance } from 'class-transformer';
import { GroupName } from "./group-name";

export class Group implements IGroup {

    name!: GroupName;

    path?: string;

    public static fromPlain(group: IGroup) {
        return plainToInstance(Group, group);
    }
}
