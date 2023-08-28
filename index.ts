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

    printRequest(method, url)
    const res = await fetch(url, requestInit)
    await printResponse(res)
    return res
}

function printRequest(method: Verb, url: string): void {
    console.log(`\x1b[35m${method} \x1b[0m${url}\n`)
}

async function printResponse(res: Response): Promise<void> {
    const statusColor = res.ok ? 32 : 31 
    console.log(`\x1b[${statusColor}m${res.status} ${res.statusText}\x1b[0m\n`)
    for (const [name, value] of res.headers) {
        console.log(`\x1b[36m${name}:\x1b[0m ${value}`)
    }
    console.log('')

    const contentType = res.headers.get('content-type')?.toLowerCase()
    if (contentType?.startsWith('application/json')) {
        console.log(cj(await res.json()))
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
    }
    console.log(`\n${'-'.repeat(process.stdout.columns)}\n`)
}

