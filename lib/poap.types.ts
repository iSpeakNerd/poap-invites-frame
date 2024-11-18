interface PoapOwner {
  id: string;
  tokensOwned: number;
  ens?: string; // Optional since not all owners have ENS names
}

interface PoapToken {
  created: string;
  id: string;
  owner: PoapOwner;
  transferCount: string;
}

interface PoapResponse {
  limit: number;
  offset: number;
  total: number;
  transferCount: number;
  tokens: PoapToken[];
}

export type { PoapOwner, PoapToken, PoapResponse };
