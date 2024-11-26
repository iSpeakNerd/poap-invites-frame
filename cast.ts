import { createCastUrl } from './lib/warpcast-urls.ts';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Replace these with your values for frame cast
 */
const ANNOUNCEMENT_TEXT =
  process.env.ANNOUNCEMENT_TEXT! ||
  `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop! 
  Click Start to get your channel invite!`;
const FRAME_URL =
  process.env.FRAME_URL! || 'https://poap-invites-frame.vercel.app/api';
const CHANNEL_KEY = process.env.CHANNEL_KEY! || 'tabletop';

(() => {
  const castUrl = createCastUrl({
    text: ANNOUNCEMENT_TEXT,
    embeds: [FRAME_URL],
    channelKey: CHANNEL_KEY,
  });
  console.log('cast url:', castUrl);
})();
