export function log(...args: unknown[]) {
    const time = new Date();
    console.log('info', `[${time.toISOString()}]`, ...args);
}
