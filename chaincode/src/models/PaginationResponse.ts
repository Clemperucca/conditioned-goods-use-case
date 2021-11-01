/** 
 * Pagination response
 */
export default class PaginationResponse<T> {
    public result: Array<T>;
    public count: number;
    public bookmark: string;
}