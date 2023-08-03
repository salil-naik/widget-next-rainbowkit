import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { useNetwork, usePublicClient, useWalletClient } from "wagmi";
import { useEthersProvider } from "../functions/getProviderFromPublicClient";
import { ethers } from "ethers";
import { useEthersSigner } from "../functions/getSignerFromWalletClient";
import { useEffect } from "react";

const DynamicBridge = dynamic(
  // @ts-ignore
  () => import("@socket.tech/plugin").then((mod) => mod.Bridge),
  {
    ssr: false,
  }
);

const getEthersV5Provider = async (provider: any) => {
  console.log("provider", provider);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const address = await signer.getAddress();

  console.log(signer ? "✅ Signer Present" : "❌ Signer absent", signer);
  console.log(
    network ? "✅ Network from Provider" : "❌ Network from provider not found",
    network
  );
  console.log(
    address ? "✅ Address from Signer" : "❌ Address from Signer not found",
    address
  );
};

const Home: NextPage = () => {
  const { chain: currentChain } = useNetwork();
  // const provider = useEthersProvider({ chainId: currentChain?.id });
  // const walletClient = useWalletClient({chainId: currentChain?.id})
  // // const publicClient = usePublicClient({ chainId: currentChain?.id });
  // // const abc = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = useEthersSigner({chainId: currentChain?.id})
  const provider = signer?.provider;

  // console.log("provider", provider);
  console.log('singer', signer, provider);

  useEffect(() => {
    if (provider) {
      getEthersV5Provider(provider);
    }
  }, [provider]);

  const switchNetwork = async (provider: any) => {
      // const formattedChainId = "0x76adf1"; // for zora - make sure it works well with plugin
      const formattedChainId = "0x89"; // for polygon - make sure it works well with plugin
      await provider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: formattedChainId }],
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div style={{ marginBottom: "40px" }}>
          <ConnectButton />
          <button onClick={() => switchNetwork(provider)}>Switch to Zora</button>
        </div>

        <DynamicBridge
          API_KEY="1b2fd225-062f-41aa-8c63-d1fef19945e7"
          provider={provider}
        />
      </main>
    </div>
  );
};

export default Home;