import sade from 'sade'
import * as ed25519 from '@ucanto/principal/ed25519'
import { authorize } from '@storacha/capabilities/access'
import { base64url } from 'multiformats/bases/base64'
import * as DID from '@ipld/dag-ucan/did'

const githubOAuthClientID = 'Ov23liRdyizj8EndxxAf'

const cli = sade('w3')

cli.version('0.0.0')

cli
  .command('login')
  .option('--github', 'Login with GitHub', false)
  .describe('Authenticate this agent with your email address to gain access to all capabilities that have been delegated to it.')
  .action(async () => {
    const signer = await ed25519.generate()
    const delegation = await authorize.delegate({
      audience: DID.parse('did:web:up.storacha.network'),
      issuer: signer,
      with: signer.did(),
      nb: {
        iss: 'did:mailto:example.com:test', // this will be optional and not included
        att: [{ can: '*' }]
      }
    })
    const archive = await delegation.archive()
    if (archive.error) throw new Error('archiving access authorize delegation', { cause: archive.error })

    console.log('Click the following link to authenticate with github:')
    console.log(`https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=${githubOAuthClientID}&state=${base64url.encode(archive.ok)}`)
  })

cli.parse(process.argv)