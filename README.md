# POAP Invites Frame

Create an invite frame to add users to a channel on Farcaster from a POAP event.

This project uses [frog.fm](https://frog.fm) in Nextjs to serve the farcaster channel invite frame, fetches POAP data from [poap.tech](https://poap.tech), and finds Farcaster users using [Neynar SDK](https://docs.neynar.com). Created at Devcon 2024.

Uses [cast-intent](https://github.com/iSpeakNerd/cast-intent) as `WarpcastUrlBuilder` to create frame cast in Farcaster channel.

---

---

## Using this repository

Follow app logic in [`main.ts`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/main.ts)

![5cfd212a9e4d6a2b06c8828f5ef3c6e0](https://github.com/user-attachments/assets/2a3ba47c-a345-46d2-8c42-f468255394c1)

### Environment Variables

4 env vars to add to your `.env.local` file:

1. `POAP_EVENT_ID` - the event id of the POAP
2. `NEYNAR_API_KEY` - API key from [Neynar](https://docs.neynar.com)
3. `POAP_API_KEY` - API key from [poap.tech](https://poap.tech)
4. `WC_INVITE_LINK` - channel invite link from Warpcast, must be generated by a user with moderator permissions for the channel, generate and add manually

### How to Setup your Own

1. Clone repository to local

2. Install dependencies using your preferred package manager - I use `pnpm`

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Set up [poap.tech](https://poap.tech) and [Neynar](https://docs.neynar.com) API keys

   - Obtain API credentials for POAP.tech to query POAP wallet holders
   - Obtain API credentials for Neynar to map wallet addresses to Farcaster IDs
   - Add credentials to `.env.local` file

4. Replace POAP event ID and run [`main.ts`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/main.ts) script, it will:

   1. Fetch POAP wallets via poap.tech API - `GET event/{id}/poaps`

      - Use the poap.tech API to retrieve array of wallet addresses holding a specific POAP
        - implemented in `lib/poap-wallets.ts` as [`@getPoapWallets`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/poap-wallets.ts#L64)

   2. Resolve Farcaster IDs using POAP wallets via Neynar SDK - `GET /v2/farcaster/user/bulk-by-address`

      - Use the Neynar SDK/API to map the fetched wallets to Farcaster user profiles
        - implemented in `lib/get-fids.ts` as [`@getFids`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/get-fids.ts#L22)

   3. Output the resolved Farcaster IDs to JSON: `returned-user-fids.json`

   > Use the `_verbose: true` option to see the intermediate data and output each step to a separate file

5. Create and Deliver Invites
   - Build the invite flow using the repository's utilities and APIs:
     - Generate an Allowlist: Compile Farcaster IDs eligible for channel invites.
       - implemented in `lib/get-fids.ts` as [`@processForFids`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/get-fids.ts#L40)
     - Deliver Invites: Use Farcaster frames or direct messages to send invites to Farcaster users.
6. Customize Farcaster Frame

   - Customize the frame at [`app/api/[[...routes]]/route.tsx`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/app/api/%5B%5B...routes%5D%5D/route.tsx) - uses [frog.fm](https://frog.fm/concepts/images-intents) as framework for frames
   - Run dev server

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   - Head to http://localhost:3000/api/dev to inspect frame using frog.fm [devtools](https://frog.fm/concepts/devtools)
   - Customize and repeat until satisfied

7. Customize the Announcement Cast in [`cast.ts`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/cast.ts)

   - replace the options properties in the [`@WarpcastUrlBuilder.composerUrl`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/warpcast-urls.ts#L34) method call
     - `options.text` - the text of the cast delivering the frame invites
     - `options.embeds` - url of the live frame server api route
     - `options.channelKey` - the name of the channel to cast the frame in

   ```ts
   // example
   const url = warpcastUrlBuilder.composerUrl({
     text: `Welcome new frens! If you played a game and got a /poap from me at /devcon love to hear from you in /tabletop! 
      
      Click Start to get your channel invite!`,
     embeds: ['https://poap-invites-frame.vercel.app/api'],
     channelKey: 'tabletop',
   });
   // https://warpcast.com/~/compose?text=Welcome%2520new%2520frens%21%2520If%2520you%2520played%2520a%2520game%2520and%2520got%2520a%2520%252Fpoap%2520from%2520me%2520at%2520%252Fdevcon%2520love%2520to%2520hear%2520from%2520you%2520in%2520%252Ftabletop%21%2520%250A%2520%2520%2520%2520%250A%2520%2520%2520%2520Click%2520Start%2520to%2520get%2520your%2520channel%2520invite%21&embeds%5B%5D=https%3A%2F%2Fpoap-invites-frame.vercel.app%2Fapi&channelKey=tabletop
   ```

8. Deliver Invites via Frame Cast in Farcaster Channel
   - run [`cast.ts`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/cast.ts) to create the composer URL - [`@composerUrl`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/warpcast-urls.ts#L34)
   - click the composer URL in the console to cast the frame!

---

The simplest way I've found to run single typescript files in Node is with ts-node dev dependency and the following command:

```bash
node --loader ts-node/esm file.ts
```

Note: Requires `"allowImportingTsExtensions": true` and `"noEmit": true` in [tsconfig.json](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/tsconfig.json)
