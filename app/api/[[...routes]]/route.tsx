/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { neynar } from 'frog/hubs';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { UI } from './ui';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Image, VStack } = UI;

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  title: 'Invite frame',
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

const inviteFidsArray = [8004, 5516, 13877, 18091, 2480, 6217, 8998, 16877]; // from get-fids.ts output
const channel = {
  name: 'TableTop',
  inviteLink: process.env.WC_INVITE_LINK!,
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
      // <TextInput placeholder='Enter custom fruit...' />,
      <Button
        value='fid'
        action='/invite'
      >
        Start
      </Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// app.frame('/new', (c) => {
//   return c.res({
//     image: (
//       <div
//         style={{
//           display: 'flex',
//           width: '100%',
//           height: '100%',
//           backgroundColor: 'white',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Image src='/tabletop-wordmark-color.png' />
//       </div>
//     ),
//   });
// });

app.frame('/invite', (c) => {
  const { fid } = c.frameData || {};
  console.log('fid', fid);
  if (!fid) {
    console.error('error: no fid found');
    return c.res({
      image: (
        <div
          style={{
            color: 'white',
            fontSize: 60,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          error: no fid found
        </div>
      ),
    });
  }
  if (inviteFidsArray.includes(fid)) {
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
  }
  return c.res({
    image: (
      <div
        style={{
          color: 'white',
          height: '100%',
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
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
