import { BulkUserAddressTypes } from '@neynar/nodejs-sdk';
import neynar from './neynar.ts';
import fs from 'fs';
import warpcastUrlBuilder from './warpcast-urls.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/**
 * Replace this with your POAP event ID
 */
const POAP_EVENT_ID = process.env.POAP_EVENT_ID!;

const usersArray: { address: string; username: string; fid: number }[] = [];
const fids: number[] = [];

/**
 * Get Farcaster FIDs from wallets using neynar sdk
 * https://docs.neynar.com/reference/fetch-bulk-users-by-eth-or-sol-address
 *
 * @param wallets - array of wallets addresses
 *
 * @returns array of FIDs matching those wallets
 */
export default async function getFids(wallets: string[]): Promise<number[]> {
  const users = await neynar.fetchBulkUsersByEthereumAddress(wallets, {
    addressTypes: [BulkUserAddressTypes.VERIFIED_ADDRESS],
  });

  //process users
  Object.entries(users).forEach(([address, userDataArray]) => {
    usersArray.push({
      address: address,
      username: userDataArray[0].username,
      fid: userDataArray[0].fid,
    });
  });

  return processForFids(usersArray);
}

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
  fs.writeFileSync('fids.json', JSON.stringify(fids));

  return fids;
}
