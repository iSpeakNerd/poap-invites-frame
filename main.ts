import getFids from './lib/get-fids.ts';
import getPoapWallets from './lib/poap-wallets.ts';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/** Replace with your POAP event ID
 */
const POAP_EVENT_ID: string = process.env.POAP_EVENT_ID! || '180427';

/**
 * Get Farcaster FIDs from POAP token holders for a given event, outputs array of FIDs to JSON: `returned-user-fids.json`
 * @param _verbose - whether to add verbose console logging and output files, default: `false`
 * - log the POAP tokens and output to JSON file: `returned-poap-tokens.json`
 * - log the POAP wallets and output to JSON file: `returned-poap-wallets.json`
 * - log intermediate data to console
 * - log final FIDs to console
 * @returns array of Farcaster FIDs, outputs to JSON: `returned-user-fids.json`
 */

async function getFidsFromPoap(_verbose?: boolean) {
  const wallets = await getPoapWallets(POAP_EVENT_ID, _verbose);
  const fids = await getFids(wallets, _verbose);
  if (_verbose) {
    console.log(fids);
  }
  return fids;
}

// run script
getFidsFromPoap(false);
