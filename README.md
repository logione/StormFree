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

// all equals the following request
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

# Integration with tests runners

Storm Free integrates nicely with test runners tools like Jasmine.

```javascript
describe('Users management', () => {
    it('Get all users', async () => {
        const { ok } = await get('https://my-api/users')
        expect(ok).toBeTrue()
    })

    it('Try to delete a user without authenticiation', async () => {
        const result = await del('https://my-api/users/1')
        // result is the original Response from fetch 
        expect(result.ok).toBeFalse()
        expect(result.status).toBe(401)
    })
})
```

*If you don't want requests to be printed, you can use [@logi.one/rest-client](https://www.npmjs.com/package/@logi.one/rest-client) instead*