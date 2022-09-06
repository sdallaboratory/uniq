import { Group } from "./group";
import { plainToInstance } from 'class-transformer';
import { GroupName } from "./group-name";

export class GroupClass implements Group {

    name!: GroupName;

    path?: string;

    public static fromPlain(group: Group) {
        return plainToInstance(GroupClass, group);
    }

    parse() {
        const groupRegex = /(?<department>^(?<faculty>[а-яё]+)\d?\d?)+(?<foreign>и?)-(?<semester>\d\d?)(?<number>\d)(?<form>[бма]?)$/gi;
        const parts = groupRegex.exec(this.name)?.groups || {};
        return {
            ...parts,
            foreign: Boolean(parts.foreign),
            semester: Number(parts.semester),
            number: Number(parts.number),
        } as {
            department: string;
            faculty: string;
            foreign: boolean;
            semester: number;
            number: number;
            form: string;
        };
    }
}
