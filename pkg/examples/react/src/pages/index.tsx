import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  CedarERC1155DropV0__factory,
  CedarERC721DropV0__factory,
  ICedarAgreementV0,
  ICedarAgreementV0__factory,
} from "@monax/aspen-publishing-sdk";
import { Signer } from "ethers";

const network = {
  1: "Ethereum",
  4: "Rinkeby",
  137: "Polygon",
  80001: "Mumbai",
};
const ConnectWallet = () => {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: Object.keys(network).map(Number),
  });
  const { chainId, account, activate, active } = useWeb3React<Web3Provider>();

  const onClick = () => {
    activate(injectedConnector);
  };

  return (
    <div>
      {active ? (
        <>
          <div>Network: {network[chainId]}</div>
          <div>ChainId: {chainId}</div>
          <div>Account: {account}</div>
          <div>✅ </div>
        </>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  );
};

const AcceptTerms: React.FC<{ contractAddress: string }> = ({
  contractAddress,
}) => {
  const { account, active, library } = useWeb3React<Web3Provider>();

  const onAcceptTerms = async () => {
    const contract = await getContractAgreement(
      contractAddress,
      library.getSigner()
    );
    try {
      await contract.termsActivated();
      await checkHasAcceptedTerms();
      await tryGetCedarAgreementContract(contractAddress, library.getSigner());

      await contract.acceptTerms();
    } catch (err) {
      alert("Accept terms not activated in this contract");
      console.error(err);
    }
  };

  const checkHasAcceptedTerms = async () => {
    if (!library) return;
    const erc721Cedar = await ICedarAgreementV0__factory.connect(
      contractAddress,
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
      <button type="button" onClick={onAcceptTerms}>
        Accept Terms
      </button>
    )
  );
};

const MintCedarERC721DropV0: React.FC<{ contractAddress: string }> = ({
  contractAddress,
}) => {
  const { account, active, library } = useWeb3React<Web3Provider>();

  //MATIC contract address
  const CURRENCY = "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa";
  const BASE_GAS_LIMIT = 300000;

  const onMint = async () => {
    if (!library) return;

    const contract = CedarERC721DropV0__factory.connect(
      contractAddress,
      library.getSigner()
    );

    const claimParameters = {
      reciever: account.toLowerCase(),
      quantity: 1,
      currency: CURRENCY,
      pricePerToken: 0,
      proofs: [],
      proofMaxQuantity: 0,
    };

    //TODO: Set a gasStategy to adapt BASE_GAS_LIMIT according to the function that we are calling on the contract
    await contract.claim(
      claimParameters.reciever,
      claimParameters.quantity,
      claimParameters.currency,
      claimParameters.pricePerToken,
      claimParameters.proofs,
      claimParameters.proofMaxQuantity,
      {
        gasLimit: BASE_GAS_LIMIT * claimParameters.quantity,
      }
    );
  };

  return (
    <div>
      <button type="button" onClick={onMint}>
        Mint
      </button>
    </div>
  );
};

const MintCedarERC1155DropV0: React.FC<{ contractAddress: string }> = ({
  contractAddress,
}) => {
  const { account, library } = useWeb3React<Web3Provider>();

  //MATIC contract address
  const CURRENCY = "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa";
  const BASE_GAS_LIMIT = 300000;

  const onMint = async () => {
    if (!library) return;

    const contract = CedarERC1155DropV0__factory.connect(
      contractAddress,
      library.getSigner()
    );

    const claimParameters = {
      reciever: account.toLowerCase(),
      tokenId: 0,
      quantity: 1,
      currency: CURRENCY,
      pricePerToken: 0,
      proofs: [],
      proofMaxQuantity: 0,
    };

    //TODO: Set a gasStategy to adapt BASE_GAS_LIMIT according to the function that we are calling on the contract
    await contract.claim(
      claimParameters.reciever,
      claimParameters.tokenId,
      claimParameters.quantity,
      claimParameters.currency,
      claimParameters.pricePerToken,
      claimParameters.proofs,
      claimParameters.proofMaxQuantity,
      {
        gasLimit: BASE_GAS_LIMIT * claimParameters.quantity,
      }
    );
  };

  return (
    <div>
      <button type="button" onClick={onMint}>
        Mint
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const [nftInputCedarERC721DropV0, setNftInputCedarERC721DropV0] = useState(
    "0x1363ff99e2dc80a071f90618e6f4271be866cf44"
  );
  const [nftInputCedarERC1155DropV0, setNftInputCedarERC1155DropV0] = useState(
    "0x1b3a404b4216b18afdf1066fecfb0d2abb68b668"
  );

  const { active } = useWeb3React<Web3Provider>();
  return (
    <div>
      <main className={styles.main}>
        <h2>Aspen Publishing SDK Example </h2>
        <p>
          The examples are with contracts that are deployed on Mumbai, make sure
          to connect to the correct Network
        </p>
        <ConnectWallet />
        {active && (
          <>
            <h3>ERC-721</h3>
            <div>
              <text>Contract Address </text>
              <input
                type="text"
                value={nftInputCedarERC721DropV0}
                onChange={(e) => setNftInputCedarERC721DropV0(e.target.value)}
              />
            </div>
            <AcceptTerms contractAddress={nftInputCedarERC721DropV0} />
            <MintCedarERC721DropV0
              contractAddress={nftInputCedarERC721DropV0}
            />
            <h3>ERC-1155</h3>
            <div>
              <text>Contract Address </text>
              <input
                type="text"
                value={nftInputCedarERC1155DropV0}
                onChange={(e) => setNftInputCedarERC1155DropV0(e.target.value)}
              />
            </div>
            <AcceptTerms contractAddress={nftInputCedarERC1155DropV0} />
            <MintCedarERC1155DropV0
              contractAddress={nftInputCedarERC1155DropV0}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
