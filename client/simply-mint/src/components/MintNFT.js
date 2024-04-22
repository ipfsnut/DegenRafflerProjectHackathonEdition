import React, { useState } from 'react';
import Web3 from 'web3';
import contractABI from '../contracts/ContractABI.json';

const MintNFT = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [mintStatus, setMintStatus] = useState('');

  // Hardcoded contract address
  const contractAddress = '0xbB18053Bf1a3E83c1E9f5B0B76CbfC66344cBC01';

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
      const mintFunctionName = contractABI.find(item => item.type === 'function' && item.name === 'mintFree').name;

      // Construct the minting transaction
      const tokenURI = 'https://example.com/token-metadata';
      const tx = await contract.methods[mintFunctionName](account, tokenURI).send({ from: account });

      setMintStatus(`NFT minted successfully! Transaction hash: ${tx.transactionHash}`);
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
        <button onClick={mintNFT}>Mint NFT</button>
      )}
      <p>{mintStatus}</p>
    </div>
  );
};

export default MintNFT;
