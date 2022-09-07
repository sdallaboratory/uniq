/**
 * Декоратор, логирующий в консоль время работы метода
 * @param label название, с которого будут начинаться логи.
 */
export function LogTime(label: string) {
    return (target: any ,prop: string, d: PropertyDescriptor) => {
        const original = d.value;
        d.value = function (...args: unknown[]) {
            const id = label + ' seed-' + Math.random();
            console.time(id);
            original.apply(this, args);
            console.timeEnd(id);
        }
    }

}
