/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog';
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
  name: 'tabletop',
  inviteLink: process.env.WC_INVITE_LINK!,
};

//entrypoint
app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      // <TextInput placeholder='Enter custom fruit...' />,
      <Button
        value='fid'
        action='/check'
      >
        start
      </Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame('/new', (c) => {
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
  });
});

app.frame('/check', (c) => {
  const { fid } = c.frameData || {};
  console.log(fid);
  if (!fid) {
    return c.res({
      image: (
        <div
          style={{
            display: 'flex',
            color: 'white',
            fontSize: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          No FID found
        </div>
      ),
    });
  }
  console.log(fid);
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
        default fallback
      </div>
    ),
    intents: [
      <Button
        value='invite'
        action='/invite'
      >
        invite
      </Button>,
      // <Button
      //   value='not-invited'
      //   action='/'
      // >
      //   not invited
      // </Button>,
    ],
  });
});

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
          fontSize: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Not yet a member?
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
