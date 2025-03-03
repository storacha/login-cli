import http from 'node:http'
import { inspect } from 'node:util'
import { base64url } from 'multiformats/bases/base64'
import { Delegation } from '@ucanto/core'

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

    const extract = await Delegation.extract(base64url.decode(url.searchParams.get('state')))
    if (extract.error) {
      res.statusCode = 400
      return res.end()
    }

    console.log('access/authorize delegation:', inspect(extract.ok.toJSON()))

    const params = new FormData()
    params.set('client_id', GITHUB_CLIENT_ID)
    params.set('client_secret', GITHUB_CLIENT_SECRET)
    params.set('code', code)

    const accessTokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: params
    })
    if (!accessTokenRes.ok) {
      res.statusCode = 400
      return res.end()
    }
    const { access_token: accessToken } = await accessTokenRes.json()

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (!userRes.ok) {
      res.statusCode = 500
      return res.end()
    }
    console.log(await userRes.json())

    const userEmailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (!userEmailsRes.ok) {
      res.statusCode = 500
      return res.end()
    }
    console.log(await userEmailsRes.json())
    // TODO: use primary and verified email
  }
  res.end()
})

const port = parseInt(process.env.PORT ?? '8080')
server.listen(port, () => console.log(`Listening on :${port}`))

