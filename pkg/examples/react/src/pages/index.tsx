import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  CedarERC721DropV0__factory,
  ICedarAgreementV0,
  ICedarAgreementV0__factory,
} from "@monax/aspen-publishing-sdk";
import { Signer } from "ethers";

const ConnectWallet = () => {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 80001],
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
          Connect
        </button>
      )}
    </div>
  );
};

const AcceptTerms = () => {
  const { account, active, library } = useWeb3React<Web3Provider>();
  const [nftInputContractAddress, setNftInputContractAddress] = useState(
    "0x021aa5a885bdb6a8767e5e4909d1cf594255106a"
  );

  const onAcceptTerms = async () => {
    const contract = await getContractAgreement(
      nftInputContractAddress,
      library.getSigner()
    );
    try {
      await contract.termsActivated();
      await checkHasAcceptedTerms();
      await tryGetCedarAgreementContract(
        nftInputContractAddress,
        library.getSigner()
      );

      await contract.acceptTerms();
    } catch (err) {
      console.error(err);
    }
  };

  const checkHasAcceptedTerms = async () => {
    if (!library) return;
    const erc721Cedar = await ICedarAgreementV0__factory.connect(
      nftInputContractAddress,
      library.getSigner()
    );
    return erc721Cedar.getAgreementStatus(account);
  };

  async function getContractAgreement(
    nftContractAddress: string,
    signer: Signer
  ): Promise<ICedarAgreementV0> {
    return ICedarAgreementV0__factory.connect(nftContractAddress, signer);
  }

  async function tryGetCedarAgreementContract(
    nftContractAddress: string,
    signer: Signer
  ): Promise<string | null> {
    try {
      const cedar = ICedarAgreementV0__factory.connect(
        nftContractAddress,
        signer
      );
      const agreementInIPFS = await cedar.userAgreement();
      return agreementInIPFS;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  return (
    active && (
      <div>
        <text>Contract Address </text>
        <input
          type="text"
          value={nftInputContractAddress}
          onChange={(e) => setNftInputContractAddress(e.target.value)}
        />
        <button type="button" onClick={onAcceptTerms}>
          Accept Terms
        </button>
      </div>
    )
  );
};

const Mint = () => {
  const { account, active, library } = useWeb3React<Web3Provider>();
  const [nftInputContractAddress, setNftInputContractAddress] = useState(
    "0x021aa5a885bdb6a8767e5e4909d1cf594255106a"
  );

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const ZERO_BYTES =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  const onMint = async () => {
    if (!library) return;
    const contract = CedarERC721DropV0__factory.connect(
      nftInputContractAddress,
      library.getSigner()
    );

    const condition = {
      maxClaimableSupply: 100,
      quantityLimitPerTransaction: 100,
      startTimestamp: Math.floor(Date.now() / 1000).toString(),
      supplyClaimed: 0,
      waitTimeInSecondsBetweenClaims: 0,
      merkleRoot: ZERO_BYTES,
      pricePerToken: 0,
      currency: ZERO_ADDRESS,
    };

    await contract.setClaimConditions([condition], false, {
      gasLimit: 100000,
    });

    await contract.lazyMint(1, "", ZERO_BYTES, {
      gasLimit: 100000,
    });

    const response = await contract.claim(account, 1, ZERO_ADDRESS, 0, [], 0, {
      gasLimit: 100000,
    });
  };
  return (
    active && (
      <div>
        <button type="button" onClick={onMint}>
          Mint
        </button>
      </div>
    )
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <main className={styles.main}>
        <h2>Aspen Publishing SDK Example </h2>
        <ConnectWallet />
        <AcceptTerms />
        <Mint />
      </main>
    </div>
  );
};

export default Home;
