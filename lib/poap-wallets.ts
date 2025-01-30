import dotenv from 'dotenv';
import { PoapResponse, PoapToken } from './poap.types.ts';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const POAP_EVENT_ID = '180427';
const apiKey = process.env.POAP_API_KEY!;

/**
 * Fetch POAPs from POAP API with pagination
 * https://documentation.poap.tech/reference/geteventpoaps-2
 */
async function fetchPoaps(_eventId: string): Promise<PoapResponse> {
  console.log('fetching poap holder addresses via POAP API');
  const limit = 300; // max limit
  let offset = 0;
  let allTokens: PoapToken[] = [];
  let total = 0;
  let transferCount = 0;

  do {
    const url = new URL(`https://api.poap.tech/event/${_eventId}/poaps`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());

    const options = {
      headers: {
        accept: 'application/json',
        'x-api-key': apiKey,
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch POAP wallets: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data || typeof data !== 'object' || !Array.isArray(data.tokens)) {
      throw new Error('Invalid POAP response format');
    }

    allTokens = [...allTokens, ...data.tokens];
    total = data.total;
    offset += limit;
    transferCount = data.transferCount;
  } while (allTokens.length < total);
  const finalData = {
    tokens: allTokens,
    total: total,
    limit: limit,
    offset: offset,
    transferCount: transferCount,
  };

  console.log('writing poap tokens to file "return-poap-tokens.json"');
  fs.writeFileSync(
    'return-poap-tokens.json',
    JSON.stringify(finalData, null, 2)
  );

  console.log(
    'fetched poap tokens via POAP API',
    JSON.stringify(finalData, null, 2)
  );

  return finalData;
}

async function processPoapData(data: PoapResponse): Promise<string[]> {
  console.log('processing poap return for addresses only');
  const wallets = data.tokens.map((token) => token.owner.id);
  console.log('completed poap addresses', wallets);
  return wallets;
}

/**
 * Get wallets that hold a POAP from POAP API
 * https://documentation.poap.tech/reference/geteventpoaps-2
 *
 * @param eventId - the poap event to fetch wallets from
 *
 * @returns array of wallet addresses
 */
export default async function getPoapWallets(
  eventId: string
): Promise<string[]> {
  const data = await fetchPoaps(eventId);
  const wallets = await processPoapData(data);
  fs.writeFileSync(
    'return-poap-wallets.json',
    JSON.stringify(wallets, null, 2)
  );
  return wallets;
}
