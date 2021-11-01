/** 
 * Validate if an value is in range of a min and a max.
 * (We use the min/max value to calculate this for negative values too)
 */
export function isInRange(value: number, start: number, end: number) {
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    return value > min && value < max; 
}