import { Predicate } from "@angular/core";
import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";

export function mapArray<T, TResult = T>(
    projection: (elem: T) => TResult,
) {
    return map((array: T[]) => array.map(projection));
}
