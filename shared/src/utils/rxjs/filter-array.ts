import { Predicate } from "@angular/core";
import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";

export function filterArray<T extends any[], TResult extends any[] = T>(
    predicate: Predicate<T[number]>
): OperatorFunction<T, TResult> {
    return map<T, TResult>(array => array.filter(predicate) as TResult);
}
