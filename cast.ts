import { createCastUrl } from './lib/warpcast-urls.ts';

/**
 * Replace these with your values for your custom cast
 */
const ANNOUNCEMENT_TEXT = `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop! 
  Click Start to get your channel invite!`;
const FRAME_URL = 'https://poap-invites-frame.vercel.app/api';
const CHANNEL_KEY = 'tabletop';

(() => {
  const castUrl = createCastUrl({
    text: ANNOUNCEMENT_TEXT,
    embeds: [FRAME_URL],
    channelKey: CHANNEL_KEY,
  });
  console.log('cast url:', castUrl);
})();
