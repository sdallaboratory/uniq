import { Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/internal/operators/distinctUntilChanged";

export function  distinctUntilChangedBy<T, TKey>(resolver: (value: T) => TKey) {

    function comparator(a: T, b: T) {
        return resolver(a) === resolver(b);
    }

    return (observable: Observable<T>) => observable.pipe(
        distinctUntilChanged(comparator),
    );
}
