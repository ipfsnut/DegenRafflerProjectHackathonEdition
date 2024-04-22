import React, { useState } from 'react';
import Web3 from 'web3';
import contractABI from '../contracts/ContractABI.json';

const MintNFT = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [mintStatus, setMintStatus] = useState('');
  const [mintAmount, setMintAmount] = useState(1);

  // Hardcoded contract address
  const contractAddress = '0x129000A1d3c9f1dEcb706Ae45C8B73ADf2772b93';
  const contractNetworkId = 666666666; // Degen Mainnet network ID
  const contractNetworkName = 'degen'; // Degen Mainnet network name

  const connectWallet = async () => {
    try {
      // Request access to the user's MetaMask account
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create a new instance of the Web3 object
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Get the user's Ethereum account
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      // Check if the user is connected to the correct network
      const networkId = await web3Instance.eth.net.getId();
      const networkName = await web3Instance.eth.net.getNetworkType();

      if (networkId !== contractNetworkId || networkName !== contractNetworkName) {
        console.error('Please connect to the Degen Mainnet network');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const mintNFT = async () => {
    try {
      // Check if the user's wallet is connected
      if (!web3 || !account) {
        setMintStatus('Please connect your wallet first.');
        return;
      }

      setMintStatus('Minting in progress...');

      // Create a contract instance
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Find the mint function name from the ABI
      const mintFunctionName = contractABI.find(item => item.type === 'function' && item.name === 'mint').name;

      // Construct the minting transaction
      const tx = await contract.methods[mintFunctionName](account, mintAmount).send({ from: account });

      setMintStatus(`${mintAmount} NFT(s) minted successfully! Transaction hash: ${tx.transactionHash}`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintStatus('Error minting NFT. Please try again.');
    }
  };

  return (
    <div>
      <h1>Mint NFT</h1>
      {!web3 || !account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
            min="1"
          />
          <button onClick={mintNFT}>Mint NFT</button>
        </>
      )}
      <p>{mintStatus}</p>
    </div>
  );
};

export default MintNFT;
