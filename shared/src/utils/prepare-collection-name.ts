/**
 * Transforms date to collection name.
 * @param date Date to create collection name from.
 * @returns {string} Collection name in format `YYYY-MM-DD-HH-mm-ss` (e.g `2022-03-02-13-27-59`)
 */
export function prepareCollectionName(date: Date) {
    return date.toISOString().replace(/\..*$/g, '').replace(/[T:]+/g, '-');
}