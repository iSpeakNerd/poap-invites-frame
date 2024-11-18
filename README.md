## POAP Invites Frame
Create an invite frame to add users to a channel on Farcaster from a POAP event.

This project uses [frog.fm](https://frog.fm) in Nextjs to create and host the frame server, fetches POAP data from [poap.tech](https://poap.tech), and finds fc users using [Neynar SDK](https://docs.neynar.com). Created at Devcon 2024.

Uses [cast-intent](https://github.com/iSpeakNerd/cast-intent) to cast frame into channel.

```
npm install
npm run dev
```

Head to http://localhost:3000/api/dev to inspect frame
