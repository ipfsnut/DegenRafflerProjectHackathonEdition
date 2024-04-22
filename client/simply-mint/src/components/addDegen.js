import React from 'react';

const AddDegen = () => {
  const addDegenNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x28DDBF8', // Degen Mainnet chain ID in hexadecimal format (666666666 in decimal)
            chainName: 'Degen Mainnet',
            rpcUrls: ['https://rpc.degen.tips'], // Replace with the actual RPC URL
            nativeCurrency: {
              name: 'DEGEN',
              symbol: 'DEGEN',
              decimals: 18,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error adding Degen Mainnet network:', error);
    }
  };

  return (
    <div>
      <button onClick={addDegenNetwork}>Add Degen Mainnet to MetaMask</button>
    </div>
  );
};

export default AddDegen;
