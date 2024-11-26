import getFids from './lib/get-fids.ts';
import dotenv from 'dotenv';
import getPoapWallets from './lib/poap-wallets.ts';
import warpcastUrlBuilder from './lib/warpcast-urls.ts';
dotenv.config({ path: '.env.local' });

/**
 * Replace these with your values for frame cast
 */
const POAP_EVENT_ID = process.env.POAP_EVENT_ID! || '180427';
const ANNOUNCEMENT_TEXT =
  process.env.ANNOUNCEMENT_TEXT! ||
  `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop! 
  Click Start to get your channel invite!`;
const FRAME_URL =
  process.env.FRAME_URL! || 'https://poap-invites-frame.vercel.app/api';
const CHANNEL_KEY = process.env.CHANNEL_KEY! || 'tabletop';

async function getFidsFromPoap() {
  const wallets = await getPoapWallets(POAP_EVENT_ID);
  const fids = await getFids(wallets);
  const announcementCastUrl = warpcastUrlBuilder.composerUrl({
    text: ANNOUNCEMENT_TEXT,
    embeds: [FRAME_URL],
    channelKey: CHANNEL_KEY,
  });
  console.log('announcement cast url:', announcementCastUrl);
}
getFidsFromPoap();
