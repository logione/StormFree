# Storm Free

Storm Free is an ultra-lightweight (and forever free) Rest API tester for node using terminal as output.

# Getting Started

Install Storm Free :

```bash
npm install --save-dev @logi.one/stormfree
```

Create a Javascript (or Typescript) source file with a request to your API :

```javascript
import { get } from '@logi.one/stormfree'

await get('https://api.github.com/users/logione')
```

Run your request :

```bash
node request.mjs
```

Get the output in the terminal :

![Request output](https://github.com/logione/stormfree/blob/master/output.png?raw=true)

# Examples

Make a simple GET request :

```javascript
await get('https://my-api/users')
````

Make a request with query parameters :

```javascript
// using key/value objects
await get(
    'https://my-api/users', undefined,
    { key: 'active', value: true },
    { key: 'name', value: 'john doe' }
)

// using tuples
await get(
    'https://my-api/users', undefined,
    ['active', true],
    ['name', 'john doe']
)

// or using strings
await get('https://my-api/users', undefined,
    'active=true',
    'name=john doe'
)

// all equal the following request
await get('https://my-api/users?active=true&name=john%20doe')
```

POST json data :

```javascript
await post('https://my-api/users', { json: { username: 'john@mail.com', name: 'John Doe' }})
```

Make a DELETE request with a bearer token :

```javascript
await del('https://my-api/users/1', { token: 'my-bearer-token' })
```

PUT XML data :

```javascript
await put('https://my-api/users/1', { 
    headers: { 'Content/type': 'application/xml' },
    body: '<active>false</active>'
})
```

Prevent request and status to be printed :

```javascript
await get('https://my-api/users',
    { print: { request: false, status: false, headers: true, body: true } }
)
```

Prevent any printing :

```javascript
await get('https://my-api/users', { print: false })
````

# Integration with test runners

Storm Free integrates nicely with test runners. Test runners can be useful to select which request to run.

```javascript
import { it } from 'node:test'
import assert from 'node:assert'

it.only('Get all users', async () => {
    const { ok } = await get('https://my-api/users')
    assert(ok)
})

it('Try to delete a user without authenticiation', async () => {
    const result = await del('https://my-api/users/1')
    // result is the original Response from fetch 
    assert(!result.ok)
    assert(result.status === 401)
})
```

*If you search a rest-client that doesn't print anything, you can use [@logi.one/rest-client](https://www.npmjs.com/package/@logi.one/rest-client) instead*