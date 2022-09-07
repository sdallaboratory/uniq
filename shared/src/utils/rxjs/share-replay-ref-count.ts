import { shareReplay } from "rxjs/operators";

// TODO: Use it everywhere
export function shareReplayOneRefCount<T>() {
    return shareReplay<T>({
        refCount: true,
        bufferSize: 1
    })
}
