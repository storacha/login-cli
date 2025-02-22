import http from 'node:http'

const server = http.createServer((req, res) => {
  console.log(req.url)
  res.end()
})

const port = parseInt(process.env.PORT ?? '8080')
server.listen(port, () => console.log(`Listening on :${port}`))

