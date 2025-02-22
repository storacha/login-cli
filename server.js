import http from 'node:http'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

const server = http.createServer(async (req, res) => {
  console.log(req.url)
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code')
    if (!code) {
      res.statusCode = 400
      return res.end()
    }
    const params = new FormData()
    params.set('client_id', GITHUB_CLIENT_ID)
    params.set('client_secret', GITHUB_CLIENT_SECRET)
    params.set('code', code)
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: params
    })
    console.log(await res.json())
  }
  res.end()
})

const port = parseInt(process.env.PORT ?? '8080')
server.listen(port, () => console.log(`Listening on :${port}`))

