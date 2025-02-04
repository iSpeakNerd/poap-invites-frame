import { BulkUserAddressTypes } from '@neynar/nodejs-sdk';
import neynar from './neynar.ts';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const usersArray: { address: string; username: string; fid: number }[] = [];

/**
 * Get Farcaster FIDs from wallets using neynar sdk
 * https://docs.neynar.com/reference/fetch-bulk-users-by-eth-or-sol-address
 *
 * @param wallets - array of wallets addresses
 * @param _verbose - whether to output to console and save to JSON files
 * @returns array of FIDs matching those wallets
 */
export default async function getFids(
  wallets: string[],
  _verbose?: boolean
): Promise<number[]> {
  const users = await neynar.fetchBulkUsersByEthereumAddress(wallets, {
    addressTypes: [BulkUserAddressTypes.VERIFIED_ADDRESS],
  });
  if (_verbose) {
    console.log('fetched users from neynar, users:', users);
  }

  //process users
  Object.entries(users).forEach(([address, userDataArray]) => {
    usersArray.push({
      address: address,
      username: userDataArray[0].username,
      fid: userDataArray[0].fid,
    });
  });

  if (_verbose) {
    console.log('split user data:', usersArray);
  }
  return processForFids(usersArray);
}

/**
 * Process users for FIDs only
 * @param array - the sliced users array
 * @returns array of FIDs
 */
function processForFids(array: typeof usersArray): number[] {
  /**
   * Uncomment this section to mention allowlisted users on Farcaster
   * as part of the announcement cast
   */

  // const mentions = array.map((user) => `@${user.username}`).join(' ');
  // console.log(mentions);

  // const url = warpcastUrlBuilder.composerUrl({
  //   text: `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop!

  //   Click Start to get your channel invite!
  //   ${mentions}`,
  //   embeds: ['https://poap-invites-frame.vercel.app/api'],
  //   channelKey: 'tabletop',
  // });
  // console.log('composer url', url);

  const fids = array.map((user) => user.fid);
  fs.writeFileSync('returned-user-fids.json', JSON.stringify(fids));
  return fids;
}
