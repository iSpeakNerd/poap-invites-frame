import { BulkUserAddressTypes } from '@neynar/nodejs-sdk';
import neynar from './lib/neynar.ts';
import fs from 'fs';
import warpcastUrlBuilder from './lib/warpcast-urls.ts';

//from POAP csv download
const wallets = [
  '0xefef50ebacd8da3c13932ac204361b704eb8292c',
  '0x1b5f4b3cbff53245ae516b5475be336622dd5dc4',
  '0xb1b472f89318d385570980cd31295e7994864920',
  '0xe71efd5865a42cb0f23146dc8e056dba4e67e9b7',
  '0x22d134851ddee8d3dd64d71b092986b3cc7d26d8',
  '0x0e6425c5666dd516993e99cafed9767830cb37f9',
  '0xdc5670aa077520683e79cc54ebe1c70b5728ccdf',
  '0x4fba94363621a3b86417d6d0b2819583263a9bc0',
  '0x503a04d04e00d9b0c0898e2d7a16b857be6cdaf0',
  '0xc1f430ce2004ac0dbc0ecec68af86ed986cf5146',
  '0x71f116cdf41161c368268c5799a7f08b8d1bfc01',
  '0x896c20da40c2a4df9b7c98b16a8d5a95129161a5',
  '0x3482174e7caa04137a58e965002507b7f547fce7',
  '0xbe14b9950dc61642a084eab491fa516d8fe557e6',
  '0xe04885c3f1419c6e8495c33bdcf5f8387cd88846',
  '0x1391179fe009f6a07f047603dcb3e88bfdb2e16f',
];
const usersArray: { address: string; username: string; fid: number }[] = [];
const fids: number[] = [];

export async function getFids(): Promise<number[]> {
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

  // console.log(usersArray); // [{address: '0xefef50ebacd8da3c13932ac204361b704eb8292c', username: hellno, fid: 6217}]
  return await processForFids(usersArray);
}
getFids();

async function processForFids(array: typeof usersArray): Promise<number[]> {
  const mentions = array.map((user) => `@${user.username}`).join(' ');
  console.log(mentions);

  const url = warpcastUrlBuilder.composerUrl({
    text: `Welcome new frens! If you played a game and got a /poap from me at /devcon you get an invite to /tabletop! Click Start to get your channel invite! ${mentions}`,
    embeds: ['https://poap-invites-frame.vercel.app/api'],
    channelKey: 'tabletop',
  });
  console.log('composer url', url);

  const fids = array.map((user) => user.fid);
  fs.writeFileSync('fids.json', JSON.stringify(fids));
  return fids;
}

async function createInvite() {
  // const fids = await getFids();
  const signer = process.env.FC_SIGNER_UUID!;
  const invite = await neynar.inviteChannelMember(
    signer,
    'testinprod',
    496573,
    'member'
  );
  // .then(response => console.log(response.data.message))
  // .catch((error:any) => console.log(error)); // invite @tabletop to testinprod
}
