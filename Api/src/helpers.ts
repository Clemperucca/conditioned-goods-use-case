/**
 * Convert buffer back to a JavaScript Object.
 */
export function toObject<T>(input: Uint8Array): T {
    return JSON.parse(input.toString());
}