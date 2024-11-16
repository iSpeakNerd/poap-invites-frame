import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

export default neynar;
