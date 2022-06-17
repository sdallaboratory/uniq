export function isRegex(potentialRegex: string) {
    try {
        new RegExp(potentialRegex);
        return true;
    } catch (e) {
        return false;
    }
}