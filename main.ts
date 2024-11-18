import getFids from './lib/get-fids.ts';
import dotenv from 'dotenv';
import getPoapWallets from './lib/poap-wallets.ts';
dotenv.config({ path: '.env.local' });

const POAP_EVENT_ID = process.env.POAP_EVENT_ID! || '180427';

async function getFidsFromPoap() {
  const wallets = await getPoapWallets(POAP_EVENT_ID);
  const fids = await getFids(wallets);
}
getFidsFromPoap();
