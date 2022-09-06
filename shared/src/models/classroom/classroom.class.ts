import { ClassroomName } from "./classroom-name";

export class ClassroomClass {

    constructor(
        public readonly name: ClassroomName,
    ) { }

    [Symbol.toStringTag]() {
        return this.name;
    }

    public get floor() {
        const [floor] = this.name;
        const number = parseInt(floor);
        return isNaN(number) ? undefined : number;
    }

}
