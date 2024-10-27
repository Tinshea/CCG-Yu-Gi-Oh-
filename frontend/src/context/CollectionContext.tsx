import React, { useEffect, useState, ReactNode } from 'react'
import { ethers } from 'ethers'

import { contractAddress, contractABI } from '../../utils/constant'

export const CollectionContext = React.createContext({
  connectWallet: () => {},
  currentAccount: '',
  createCollection: async (name: string, nbcard: number) => false,
  getCollection: async (collectionId: number) => null,
  getCollectionCount: async () => null,
  isOwner: false,
  getCollectionCard: async (collectionId: number) => null,
  addCollectionCards: async (
    collectionId: number,
    cards: {
      name: string;
      cardType: string;
      rarity: string;
      imageUrl: string;
      effect: string;
      attack: number;
      defense: number;
      price: number;
    }[]
  ): Promise<boolean> => false,
  buyCardCollection: async (
    collectionId: number,
    cardId: number,
    price: number
  ) => false,
  getUserCards: async () => null,
  getOwnerCount: async (id: any) => null,
  addMarket: async (cardId: number) => false,
  getMarketCards: async () => null,
  buyCardFromMarket: async (cardId: number, price: number) => false,
  removeCardFromMarket: async (cardId: number) => false,
  openCollectionBooster: (
    collectionId: number,
    price: number,
    numcards: number
  ): Promise<any> => Promise.resolve([]),
})

interface EthereumWindow extends Window {
  ethereum?: any
}

declare const window: EthereumWindow

const { ethereum } = window

const getEtheriumContract = () => {
  if (typeof ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractABI, signer)
    return contract
  }
  return null
}

interface CollectionProviderProps {
  children: ReactNode
}

export const CollectionProvider = ({ children }: CollectionProviderProps) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) {
      return alert('Make sure you have MetaMask!')
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length > 0) {
      const account = accounts[0]
      setCurrentAccount(account)
    } else {
      connectWallet()
    }
  }

  const getOwnerCount = async (id: any) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const ownerCount = await contract.getOwnerCount(currentAccount)
      return ownerCount.toNumber()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const amIOwner = async () => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const owner = await contract.owner()
      setIsOwner(currentAccount.toLowerCase() === owner.toLowerCase())
    } catch (error) {
      console.log(error)
      setIsOwner(false)
    }
  }

  const connectWallet = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })
        setCurrentAccount(accounts[0])
      } else {
        return alert('Please install MetaMask!')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error while connecting wallet')
    }
  }

  // Section pour gerer les collections

  const createCollection = async (name: string, nbcard: number) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const transaction = await contract.createCollection(name, nbcard)
      await transaction.wait()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const getCollection = async (collectionId: number) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const collection = await contract.getCollectionDetails(collectionId)
      return collection
    } catch (error) {
      console.log(error)
      return null
    }
  }
  const getCollectionCount = async () => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const collectionCount = await contract.getCollectionCount()
      return collectionCount.toNumber()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getCollectionCard = async (collectionId: number) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const collectionCard = await contract.getCardCollection(collectionId)
      return collectionCard
    } catch (error) {
      console.log(error)
      return null
    }
  }
  // const newCards = [
  //   { tokenId:11,
  //     name: 'Card 1',
  //     cardType: 'Type 1',
  //     rarity: 'Rare',
  //     imageUrl: 'http://example.com/image1.png',
  //     effect: 'Effect 1',
  //     attack: 100,
  //     defense: 200,
  //     quantity:1, 
  //     price: ethers.utils.parseEther('0.1')
  //   },
  //   { tokenId:12,
  //     name: 'Card 2',
  //     cardType: 'Type 2',
  //     rarity: 'Common',
  //     imageUrl: 'http://example.com/image2.png',
  //     effect: 'Effect 2',
  //     attack: 150,
  //     defense: 250,
  //     quantity:1, 
  //     price: ethers.utils.parseEther('0.05')
  //   }
  // ];
  
  const addCollectionCards = async (
    collectionId: number,
    cards: {
      name: string,
      cardType: string,
      rarity: string,
      imageUrl: string,
      effect: string,
      attack: number,
      defense: number,
      price: number
    }[]
  ) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const transaction = await contract.addCardsToCollection(
        collectionId,
        currentAccount,
        cards
      )
      await transaction.wait()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const buyCardCollection = async (
    collectionId: number,
    cardId: number,
    price: number
  ) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }

      const parsedAmount = ethers.utils.parseEther(price.toString())
      const transaction = await contract.purchaseCard(
        collectionId,
        cardId,
        currentAccount,
        {
          value: parsedAmount,
        }
      )

      await transaction.wait()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const getUserCards = async () => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const cards = await contract.getOwnerCards(currentAccount)
      return cards
    } catch (error) {
      console.log(error)
      return null
    }
  }


  // Section pour gerer le market

  const addMarket = async (cardId: number) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const transaction = await contract.addCardToMarket(cardId)
      await transaction.wait()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const getMarketCards = async () => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const cards = await contract.getMarketCards()
      return cards
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const buyCardFromMarket = async (cardId: number, price: number) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const transaction = await contract.buyCardFromMarket(
        cardId,
        currentAccount,
        {
          value: ethers.utils.parseEther(price.toString()),
        }
      )
      await transaction.wait()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const removeCardFromMarket = async (cardId: number) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }
      const transaction = await contract.removeCardFromMarket(cardId)
      await transaction.wait()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  // Section pour ouvrir un booster

  const openCollectionBooster = async (
    collectionId: number,
    price: number,
    numcards: number
  ) => {
    try {
      const contract = getEtheriumContract()
      if (!contract) {
        throw new Error('Ethereum contract is not available')
      }

      const parsedAmount = ethers.utils.parseEther(price.toString())
      const transaction = await contract.openCollectionBooster(
        collectionId,
        currentAccount,
        price,
        numcards,
        {
          value: parsedAmount,
        }
      )

      await transaction.wait()
      return new Promise((resolve, reject) => {
        contract.on("BoosterOpened", (newQuote, test, cards) => {
          resolve(cards)
        })
      })
    } catch (error) {
      console.log(error)
      return false
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    if (currentAccount) {
      amIOwner() 
    }
  }, [currentAccount]) 

  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', function () {
        checkIfWalletIsConnected()
      })
    }
  }, [])
  

  return (
    <CollectionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isOwner,
        createCollection,
        getCollection,
        getCollectionCount,
        getCollectionCard,
        addCollectionCards,
        buyCardCollection,
        getUserCards,
        getOwnerCount,
        addMarket,
        getMarketCards,
        buyCardFromMarket,
        removeCardFromMarket,
        openCollectionBooster,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}
