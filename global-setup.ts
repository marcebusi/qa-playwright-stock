import { config } from 'dotenv'

async function globalSetup() {
  config({ path: '.env.test', override: true })
}

export default globalSetup
