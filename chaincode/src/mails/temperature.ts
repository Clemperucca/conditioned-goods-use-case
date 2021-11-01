/** 
 * Get mail text.
 */
export function getText(id: string, temperature: string) {
    return `Something went wrong in shipment #${id} \nTemperature went out of bounds (${temperature})`;
}

/** 
 * Get mail html.
 */
export function getHtml(id: string, temperature: string) {
    return `<html><body><h1>Something went wrong in shipment #${id}</h1><p>Temperature went out of bounds (${temperature})</p></body></html>`; 
} 

