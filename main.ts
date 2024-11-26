import getFids from './lib/get-fids.ts';
import getPoapWallets from './lib/poap-wallets.ts';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/** Replace with your POAP event ID
 */
const POAP_EVENT_ID = process.env.POAP_EVENT_ID! || '180427';

async function getFidsFromPoap() {
  const wallets = await getPoapWallets(POAP_EVENT_ID);
  const fids = await getFids(wallets);
}
getFidsFromPoap();
