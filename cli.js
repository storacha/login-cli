import sade from 'sade'
import * as ed25519 from '@ucanto/principal/ed25519'

const githubOAuthClientID = 'Ov23liRdyizj8EndxxAf'

const cli = sade('w3')

cli.version('0.0.0')

cli
  .command('login')
  .option('--github', 'Login with GitHub', false)
  .describe('Authenticate this agent with your email address to gain access to all capabilities that have been delegated to it.')
  .action(async () => {
    const signer = await ed25519.generate()
    console.log('Click the following link to authenticate with github:')
    console.log(`https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=${githubOAuthClientID}&state=${encodeURIComponent(signer.did())}`)
  })

cli.parse(process.argv)