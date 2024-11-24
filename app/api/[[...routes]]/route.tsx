/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { neynar } from 'frog/hubs';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { UI } from './ui';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Image } = UI;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  title: 'Invite frame',
});

const inviteFidsArray = [
  8004, 5516, 13877, 18091, 2480, 6217, 8998, 16877, 12949,
]; // from main.ts output
const channel = {
  name: 'TableTop',
  inviteLink: process.env.WC_INVITE_LINK!, //generate invite link in warpcast
};

//entrypoint
app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c;
  return c.res({
    image: (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image src='/tabletop-wordmark-color.png' />
      </div>
    ),
    intents: [
      <Button
        value='invite'
        action='/invite'
      >
        Start
      </Button>,
    ],
  });
});

//invite or not frame
app.frame('/invite', (c) => {
  const { fid } = c.frameData || {};
  console.log('fid', fid);
  if (!fid) {
    console.error('error: no fid found');
    //if no fid, return error
    return c.res({
      image: (
        <div
          style={{
            color: 'white',
            fontSize: 60,
            justifyContent: 'center',
            backgroundColor: 'black',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          Error: fid not found in context
        </div>
      ),
    });
  }
  if (inviteFidsArray.includes(fid)) {
    //if invited, return the invite link
    return c.res({
      image: (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image src='/tabletop-wordmark-color.png' />
        </div>
      ),
      intents: [<Button.Link href={channel.inviteLink}>JOIN NOW</Button.Link>],
    });
  } else {
    //how to join cast link if not invited
    return c.res({
      image: (
        <div
          style={{
            color: 'white',
            height: '100%',
            backgroundColor: 'black',
            fontSize: 60,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          Not yet a {channel.name} member?
        </div>
      ),
      intents: [
        <Button.Link href='https://warpcast.com/ispeaknerd.eth/0xa691b67b'>
          Ways to join
        </Button.Link>,
      ],
    });
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
