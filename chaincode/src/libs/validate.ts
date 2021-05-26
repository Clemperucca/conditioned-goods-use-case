/** 
 * Validate if an value is in range of a min and a max.
 * (We use the min/max value to calculate this for negative values too)
 */
export function isInRange(value: number, min: number, max: number) {
    const min = Math.min(min, max);
    const max = Math.max(min, max);

    return value > min && value < max; 
}