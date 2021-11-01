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

/** 
 * Wrapper for the JSON.stringify function
 */
export function toJson(input) {
    return JSON.stringify(input);
}

// TODO: check if it's possible to type iterator.
/** 
 * Convert a buffer to an Array of JavaScript Objects.
 */
export async function toArrayOfObjects<T>(iterator: any): Promise<Array<T>> {
    const result = [];

    let res = await iterator.next();
    while (!res.done) {  
        if (res.value) result.push(toObject<T>(res.value.value));

        res = await iterator.next();
    }

    await iterator.close();

    return result;
}