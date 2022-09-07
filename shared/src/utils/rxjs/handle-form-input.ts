import _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface HandleFormInputParams<T> {
    intervalMs?: number,
    comparator?: (a: T, b: T) => boolean,
}

const HANDLE_FORM_INPUT_INTERVAL_DEFAULT = 100;

export function handleFormInput<T = any>(
    {intervalMs = HANDLE_FORM_INPUT_INTERVAL_DEFAULT, comparator = _.isEqual}: HandleFormInputParams<T>
        = {intervalMs: HANDLE_FORM_INPUT_INTERVAL_DEFAULT, comparator: _.isEqual},
) {
    return (formValue: Observable<any>) => formValue.pipe(
        debounceTime<T>(intervalMs),
        distinctUntilChanged(comparator),
    )
}
