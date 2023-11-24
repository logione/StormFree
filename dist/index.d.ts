import { Search } from './search.js';
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
    search?: Search;
}
type PrintOptions = {
    request: boolean;
    status: boolean;
    headers: boolean;
    body: boolean;
};
export type RequestOptions = RequestOptionsBase | RequestOptionsJSON | RequestOptionsWithBody;
export declare function get(url: string, options?: RequestOptionsBase): Promise<Response>;
export declare function del(url: string, options?: RequestOptionsBase): Promise<Response>;
export declare function post(url: string, options?: RequestOptions): Promise<Response>;
export declare function put(url: string, options?: RequestOptions): Promise<Response>;
export {};
