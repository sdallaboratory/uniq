export function getNextIndex<T>(array: T[], index: number): number {
    const nextIndex = index + 1;
    return array.length > nextIndex ? nextIndex : 0;
}
