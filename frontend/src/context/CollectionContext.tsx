import React, { useEffect, useState, ReactNode} from 'react';
import { ethers } from 'ethers';

import { contractAddress, contractABI } from '../../utils/constant';

export const CollectionContext = React.createContext({
  connectWallet: () => {},
  currentAccount: '',
  createCollection: async (name: string, nbcard: number) => false,
  getCollection: async (collectionId: number) => null,
  getCollectionCount: async () => null,
  isOwner: false,
  getCollectionCard: async (collectionId: number) => null,
  addCollectionCard: async (
    collectionId: number,
    name: string,
    cardType: string,
    rarity: string,
    imageUrl: string,
    effect: string,
    attack: number,
    defense: number,
    quantity: number,
    price: number
  ) => false,
});

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare const window: EthereumWindow;

const { ethereum } = window;

const getEtheriumContract = () => {
  if (typeof ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  }
  return null;
};

interface CollectionProviderProps {
  children: ReactNode;
}

export const CollectionProvider = ({ children }: CollectionProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) {
      return alert('Make sure you have MetaMask!');
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
      console.log('No account found');
    }
  };

  const amIOwner = async () => {
    try {
      const contract = getEtheriumContract();
      if (!contract) {
        throw new Error('Ethereum contract is not available');
      }
      const owner = await contract.owner();
      setIsOwner(currentAccount.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.log(error);
      setIsOwner(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
      } else {
        return alert('Please install MetaMask!');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error while connecting wallet');
    }
  };

  const createCollection = async (name: string, nbcard: number) => {
    try {
      const contract = getEtheriumContract();
      if (!contract) {
        throw new Error('Ethereum contract is not available');
      }
      const transaction = await contract.createCollection(name, nbcard);
      await transaction.wait();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getCollection = async (collectionId: number) => {
    try {
        const contract = getEtheriumContract();
        if (!contract) {
            throw new Error('Ethereum contract is not available');
        }
        const collection = await contract.getCollectionDetails(collectionId);
        return collection;
    } catch (error) {
        console.log(error);
        return null;
    }
};

  const getCollectionCount = async () => {
    try {
      const contract = getEtheriumContract();
      if (!contract) {
        throw new Error('Ethereum contract is not available');
      }
      const collectionCount = await contract.getCollectionCount();
      return collectionCount.toNumber();
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getCollectionCard = async (collectionId: number) => {
    try {
      const contract = getEtheriumContract();
      if (!contract) {
        throw new Error('Ethereum contract is not available');
      }
      const collectionCard = await contract.getCardCollection(collectionId);
      console.log(collectionCard);
      return collectionCard;
    }catch (error) {
      console.log(error);
      return null;
  };

};

const addCollectionCard = async (
  collectionId: number,
  name: string,
  cardType: string,
  rarity: string,
  imageUrl: string,
  effect: string,
  attack: number,
  defense: number,
  quantity: number,
  price: number
) => {
  try {
    const contract = getEtheriumContract();
    if (!contract) {
      throw new Error('Ethereum contract is not available');
    }
    const transaction = await contract.addCardToCollection(
      collectionId,
      name,
      cardType,
      rarity,
      imageUrl,
      effect,
      attack,
      defense,
      quantity,
      price
    );
    await transaction.wait();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      amIOwner(); // or any other function that needs to check the owner
    }
  }, [currentAccount]); // Run when currentAccount changes

  window.ethereum.on('accountsChanged', function () {
    checkIfWalletIsConnected();
  });

  return (
    <CollectionContext.Provider value={{ connectWallet, currentAccount, createCollection, getCollection, getCollectionCount, isOwner, getCollectionCard,addCollectionCard }}>
      {children}
    </CollectionContext.Provider>
  );
};
