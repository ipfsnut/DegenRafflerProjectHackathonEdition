import React, { useState } from 'react';
import MintNFT from './components/MintNFT';
import Web3 from 'web3';


const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [contractAddressCopied, setContractAddressCopied] = useState(false);
  const [networkError, setNetworkError] = useState('');

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
        setNetworkError('Please connect to the Degen Mainnet network');
      } else {
        setNetworkError('');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
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
      {networkError && <p>{networkError}</p>}
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
      <MintNFT
        web3={web3}
        account={account}
        contractAddress={contractAddress}
        contractNetworkId={contractNetworkId}
        contractNetworkName={contractNetworkName}
      />
    </div>
  );
};

export default App;
