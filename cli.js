import sade from 'sade'
import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth2'

const MAGIC_PUBLISHABLE_API_KEY = 'pk_live_8A718F43F8299E28'

const cli = sade('w3')

cli.version('0.0.0')

cli
  .command('login')
  .option('--github', 'Login with GitHub')
  .describe('Authenticate this agent with your email address to gain access to all capabilities that have been delegated to it.')
  .action(async () => {
    const magic = new Magic(MAGIC_PUBLISHABLE_API_KEY, {
      extensions: [new OAuthExtension()]
    })
    
    await magic.oauth2.loginWithRedirect({
      provider: 'github',
      redirectURI: 'https://alantest.exmaple.com'
    })

    const isLoggedIn = await magic.user.isLoggedIn()
    if (!isLoggedIn) {
      throw new Error('not logged in')
    }

    console.log('ID token: ', await magic.user.getIdToken())
    console.log('Info: ', await magic.user.getInfo())
  })
