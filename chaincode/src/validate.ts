/** 
 * Validate if an value is in range of a min and a max.
 * (We use the absolute value to calculate this for negative values)
 */
export function isInRange(value: number, min: number, max: number) {
    return Math.abs(value) > Math.abs(min) && Math.abs(value) < Math.abs(max); 
}