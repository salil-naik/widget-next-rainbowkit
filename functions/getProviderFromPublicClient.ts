import * as React from "react";
import { type PublicClient, usePublicClient } from "wagmi";
import { providers } from "ethers";

export function publicClientToProvider(publicClient: PublicClient) {
  const { transport } = publicClient;
  return new providers.Web3Provider(transport);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  console.log('public client', publicClient);
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient]
  );
}
