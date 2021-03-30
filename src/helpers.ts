
/** 
 * Convert a JavaScript Object to a buffer of bytes.
 */
export function toBytes(input: Object): Uint8Array {
    return Buffer.from(JSON.stringify(input));
}