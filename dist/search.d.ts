type SearchValue = string | number | boolean;
export type Search = Record<string, SearchValue> | string | [string, string][] | URLSearchParams;
export declare function appendSearchToURL(url: string, search?: Search): string;
export {};
