import cj from 'color-json'
import { highlight } from 'pretty-html-log'

export class RequestError extends Error {
    constructor(message: string, readonly status: number, readonly response: Response) {
        super(message)
    }
}

interface RequestOptionsJSON extends RequestOptionsBase {
    json: unknown
}

interface RequestOptionsWithBody extends RequestOptionsBase {
    body: BodyInit
}

interface RequestOptionsBase {
    token?: string,
    headers?: Record<string, string>
    print?: PrintOptions | boolean
}

type PrintOptions = {
    request: boolean
    status: boolean
    headers: boolean
    body: boolean
}

type QueryValue = string | number | boolean
type Query = ([string, QueryValue] | { key: string, value: QueryValue } | string)[]
type Verb = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RequestOptions = RequestOptionsBase | RequestOptionsJSON | RequestOptionsWithBody

export async function get(url: string, options?: RequestOptionsBase, ...query: Query): Promise<Response> {
    return request('GET', url, options, query)
}

export async function del(url: string, options?: RequestOptionsBase, ...query: Query): Promise<Response> {
    return request('DELETE', url, options, query)
}

export async function post(url: string, options?: RequestOptions, ...query: Query): Promise<Response> {
    return request('POST', url, options, query)
}

export async function put(url: string, options?: RequestOptions, ...query: Query): Promise<Response> {
    return request('PUT', url, options, query)
}

async function request(method: Verb, url: string, options: RequestOptions = {}, query: Query): Promise<Response> {
    const headers = options.headers || {}
    headers['User-Agent'] = headers['User-Agent'] || 'node'

    const requestInit: RequestInit = {
        headers,
        method: method
    }

    if (query && query.length > 0) {
        if (url.includes('?')) {
            if (!url.endsWith('&')) {
                url += '&'
            }
        } else {
            url += '?'
        }
        for (let q of query) {
            if (typeof q === 'string') {
                q = [q.slice(0, q.indexOf('=')), q.slice(q.indexOf('=') + 1)]
            }
            if ('key' in q) {
                url += `${q.key}=${encodeURIComponent(q.value)}&`
            } else {
                url += `${q[0]}=${encodeURIComponent(q[1])}&`
            }
        }
        url = url.slice(0, -1)
    }
    
    if ('body' in options && options.body) {
        requestInit.body = options.body
    }

    if ('json' in options && options.json) {
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json'
        }
        if (typeof options.json !== 'string') {
            requestInit.body = JSON.stringify(options.json)
        } else {
            requestInit.body = options.json
        }
    }

    if (options.token) {
        headers.Authorization = `Bearer ${options.token}`
    }

    const printOptions = formatPrintOptions(options.print)
    if (printOptions.request) {
        printRequest(method, url)
    }
    const res = await fetch(url, requestInit)
    await printResponse(res, printOptions)
    return res
}

function formatPrintOptions(options: PrintOptions | undefined | boolean): PrintOptions {
    switch (options) {
        case undefined :
        case true :
            return {
                request: true,
                status: true,
                headers: true,
                body: true
            }
        
        case false:
            return {
                request: false,
                status: false,
                headers: false,
                body: false
            }
        
        default:
            return options
    }
}


function printRequest(method: Verb, url: string): void {
    console.log(`\x1b[35m${method} \x1b[0m${url}\n`)
}

async function printResponse(res: Response, printOptions: PrintOptions): Promise<void> {
    if (!printOptions.body && !printOptions.headers && !printOptions.status) {
        return
    }

    const statusColor = res.ok ? 32 : 31
    if (printOptions.status) {
        console.log(`\x1b[${statusColor}m${res.status} ${res.statusText}\x1b[0m\n`)
    }
    if (printOptions.headers) {
        for (const [name, value] of res.headers) {
            console.log(`\x1b[36m${name}:\x1b[0m ${value}`)
        }
    }
    if (printOptions.status || printOptions.headers) {
        console.log('')
    }

    if (printOptions.body) {
        const contentType = res.headers.get('content-type')?.toLowerCase()
        if (contentType?.startsWith('application/json')) {
            const json = await res.json()
            try {
                console.log(cj(json))
            } catch {
                console.log(json)
            }
            res.json = () => Promise.resolve(json)
        } else {
            let text = await res.text()
            if (text) {
                if (contentType?.startsWith('text/html') || contentType?.startsWith('application/xml')) {
                    try {
                        text = highlight(text)
                    } catch (err) {
                    }
                }
                console.log(text)
            }
            res.text = () => Promise.resolve(text)
        }
    }
    console.log(`\n${'-'.repeat(process.stdout.columns)}\n`)
}

