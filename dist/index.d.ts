export declare class RequestError extends Error {
    readonly status: number;
    readonly response: Response;
    constructor(message: string, status: number, response: Response);
}
interface RequestOptionsJSON extends RequestOptionsBase {
    json: unknown;
}
interface RequestOptionsWithBody extends RequestOptionsBase {
    body: BodyInit;
}
interface RequestOptionsBase {
    token?: string;
    headers?: Record<string, string>;
}
type QueryValue = string | number | boolean;
type Query = ([string, QueryValue] | {
    key: string;
    value: QueryValue;
} | string)[];
export type RequestOptions = RequestOptionsBase | RequestOptionsJSON | RequestOptionsWithBody;
export declare function get(url: string, options?: RequestOptionsBase, ...query: Query): Promise<Response>;
export declare function del(url: string, options?: RequestOptionsBase, ...query: Query): Promise<Response>;
export declare function post(url: string, options?: RequestOptions, ...query: Query): Promise<Response>;
export declare function put(url: string, options?: RequestOptions, ...query: Query): Promise<Response>;
export {};
