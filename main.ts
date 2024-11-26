import getFids from './lib/get-fids.ts';
import dotenv from 'dotenv';
import getPoapWallets from './lib/poap-wallets.ts';
import warpcastUrlBuilder from './lib/warpcast-urls.ts';
dotenv.config({ path: '.env.local' });

const POAP_EVENT_ID = process.env.POAP_EVENT_ID! || '180427';

async function getFidsFromPoap() {
  const wallets = await getPoapWallets(POAP_EVENT_ID);
  const fids = await getFids(wallets);
  const url = warpcastUrlBuilder.composerUrl({
    text: `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop!
    Click Start to get your channel invite!`,
    embeds: ['https://poap-invites-frame.vercel.app/api'],
    channelKey: 'tabletop',
  });
  console.log('announcement cast url:', url);
}
getFidsFromPoap();
