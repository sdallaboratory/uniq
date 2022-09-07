export function repeat<T>(elem: T | (() => T), count: number): T[] {
    if (elem instanceof Function) {
        return [...Array(count)].map(() => elem());
    } else {
        return Array(count).fill(elem);
    }
}
