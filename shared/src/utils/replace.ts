import _ from "lodash";

export function replace<T extends Object>(
    array: readonly T[],
    predicate: (T: T) => boolean | T,
    replacement: T
) {
    if (typeof predicate !== 'function') {
        predicate = _.identity;
    }
    const copy = [...array];
    const index = copy.findIndex(predicate);

    if (index === -1) {
        return copy;
    }

    copy.splice(index, 1, replacement);
    return copy;
}
