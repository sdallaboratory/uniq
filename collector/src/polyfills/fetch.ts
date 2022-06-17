import fetch, * as nodeFetch from 'node-fetch'

if (!globalThis.fetch) {
    const self = globalThis as any;
    self.fetch = fetch
    self.Headers = nodeFetch.Headers
    self.Request = nodeFetch.Request
    self.Response = nodeFetch.Response
}
