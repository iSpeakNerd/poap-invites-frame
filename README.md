## POAP Invites Frame
Create an invite frame to add users to a channel on Farcaster from a POAP event.

This project uses [frog.fm](https://frog.fm) in Nextjs to create and host the frame server, fetches POAP data from [poap.tech](https://poap.tech), and finds fc users using [Neynar SDK](https://docs.neynar.com). Created at Devcon 2024.

Uses [cast-intent](https://github.com/iSpeakNerd/cast-intent) to cast frame into channel.

---
---

## Using this repository
Follow app logic in [`main.ts`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/main.ts) 
### Environment Variables
4 env vars to add to your `.env` file:
1. `POAP_EVENT_ID` - the event id of the POAP you are interested in
2. `NEYNAR_API_KEY` - API key from Neynar
3. `POAP_API_KEY` - API key from Poap.tech
4. `WC_INVITE_LINK` - channel invite link from Warpcast, must be generated by a user with moderator permissions for the channel, generate and add manually

### How to Setup your Own
1. Clone to local

3. Install deps using your preferred package manager - I use `pnpm`
```bash
npm install  
# or  
pnpm install  
# or  
yarn install  
```

3. Set up [POAP.tech](https://poap.tech) and [Neynar](https://docs.neynar.com) APIs
    - Obtain API credentials for POAP.tech to query POAP wallet holders
    - Obtain API credentials for Neynar to map wallet addresses to Farcaster IDs
    - Add credentials to `.env` file

4. Replace POAP event ID and run [`main.ts`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/main.ts) script
    
    1. Fetch POAP wallets
        - Use the POAP.tech API to retrieve wallet addresses holding a specific POAP - implemented in `lib/poap-wallets.ts` as [`@getPoapWallets`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/poap-wallets.ts#L64)
    
    2. Resolve Farcaster IDs
        - Use the Neynar SDK/API to map the fetched wallets to Farcaster user profiles - implemented in `lib/get-fids.ts` as [`@getFids`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/get-fids.ts#L22)

6. Create and Deliver Invite Flow
    - Build the invite flow using the repository's utilities and APIs:
      - Generate an Allowlist: Compile Farcaster IDs eligible for channel invites. - implemented in `lib/get-fids.ts` as [`@processForFids`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/get-fids.ts#L40)
      - Deliver Invites: Use Farcaster frames or direct links to send invites.
7. Customize Farcaster Frame
    - [`app/api/[[...routes]]/route.tsx`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/app/api/%5B%5B...routes%5D%5D/route.tsx) contains the custom frame used to deliver channel invites
    - Run dev server
```bash
npm run dev
# or
pnpm dev
```
- Head to http://localhost:3000/api/dev to inspect frame using frog.fm [devtools](https://frog.fm/concepts/devtools)

8. Deliver Invites via Frame Cast in Farcaster Channel
    - uses [`cast-intent`](https://github.com/iSpeakNerd/cast-intent) repository to create cast intent URL as part of [`@processForFids`](https://github.com/iSpeakNerd/poap-invites-frame/blob/main/lib/get-fids.ts#L40)

