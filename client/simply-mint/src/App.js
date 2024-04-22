import React, { useState } from 'react';
import MintNFT from './components/MintNFT';
import Web3 from 'web3';
import contractABI from './contracts/ContractABI.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [contractAddressCopied, setContractAddressCopied] = useState(false);

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

  const mintFree = async () => {
    try {
      if (!web3 || !account) {
        console.error('Please connect your wallet first.');
        return;
      }

      // Create a contract instance
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Find the mint function name from the ABI
      const mintFunctionName = contractABI.find(item => item.type === 'function' && item.name === 'mintFree').name;

      // Construct the minting transaction
      const tokenURI = 'https://example.com/token-metadata';
      const tx = await contract.methods[mintFunctionName](account, tokenURI).send({ from: account });

      console.log(`NFT minted successfully! Transaction hash: ${tx.transactionHash}`);
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(contractAddress)
      .then(() => {
        setContractAddressCopied(true);
        setTimeout(() => setContractAddressCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy contract address:', err));
  };

  return (
    <div>
      <h1>NFT Minting Site</h1>
      <div>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter contract address"
        />
        <button onClick={copyContractAddress}>
          {contractAddressCopied ? 'Copied!' : 'Copy Contract Address'}
        </button>
      </div>
      <MintNFT />
      {web3 && account && (
        <button onClick={mintFree}>Mint Free</button>
      )}
    </div>
  );
};

export default App;
