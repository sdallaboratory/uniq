export interface Handler {
    execute(): Promise<void> | void;
}