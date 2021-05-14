/** 
 * Convert a JavaScript Object to a buffer of bytes.
 */
export function toBytes<T>(input: T): Uint8Array {
    return Buffer.from(JSON.stringify(input));
}

/** 
 * Convert buffer back to a JavaScript Object.
 */
export function toObject<T>(input: Uint8Array): T {
    return JSON.parse(input.toString());
}

// TODO: check if it's possible to type iterator.
/** 
 * Convert a buffer to an Array of JavaScript Objects.
 */
export async function toArrayOfObjects<T>(iterator: any): Promise<Array<T>> {
    const results = [];

    for await (const res of iterator){
        results.push(toObject(res.value));
    }

    return results
}