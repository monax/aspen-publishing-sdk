import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";

const ConnectWallet = () => {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  });
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
  const onClick = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    console.log(chainId, account, active);
  });

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>✅ </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect Connect
        </button>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <main className={styles.main}>
        <h2>Welcome to playground</h2>
        <ConnectWallet />
      </main>
    </div>
  );
};

export default Home;
