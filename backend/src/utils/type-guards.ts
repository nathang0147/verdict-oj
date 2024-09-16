
export function isNumber(value: any): value is number {
    return !isNaN(Number(value));
}