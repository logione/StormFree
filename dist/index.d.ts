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
    print?: PrintOptions | boolean;
    query?: Query;
}
type PrintOptions = {
    request: boolean;
    status: boolean;
    headers: boolean;
    body: boolean;
};
type QueryValue = string | number | boolean;
type Query = Record<string, QueryValue | QueryValue[]> | string | string[];
export type RequestOptions = RequestOptionsBase | RequestOptionsJSON | RequestOptionsWithBody;
export declare function get(url: string, options?: RequestOptionsBase): Promise<Response>;
export declare function del(url: string, options?: RequestOptionsBase): Promise<Response>;
export declare function post(url: string, options?: RequestOptions): Promise<Response>;
export declare function put(url: string, options?: RequestOptions): Promise<Response>;
export {};
