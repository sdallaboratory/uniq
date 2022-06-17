export function isNotNill<T>(obj: T): obj is Exclude<T, undefined | null> {
    return obj !== undefined && obj !== null;
}