import { useEffect, useState, useContext } from 'react'
import styles from './styles.module.css'
import { CollectionContext } from './context/CollectionContext'

export const App = () => {
  const { connectWallet, currentAccount, createCollection, getCollectionCount, getCollection, isOwner, getCollectionCard, addCollectionCard, buyCardCollection, getUserCards, getOwnerCount, addMarket, getMarketCards, buyCardFromMarket, removeCardFromMarket, openCollectionBooster } = useContext(CollectionContext)
  
  const [collectionName, setCollectionName] = useState('')
  const [collectionNumber, setCollectionNumber] = useState(0)
  const [creationResult, setCreationResult] = useState<boolean | null>(null)
  const [collectionCount, setCollectionCount] = useState(0)
  const [collections, setCollections] = useState<any[]>([])
  const [collectionCards, setCollectionCards] = useState<{ [key: number]: any[] }>({})
  const [userCards, setUserCards] = useState<any[]>([]) // State to store user's cards
  const [marketCards, setMarketCards] = useState<any[]>([]) // State to store market cards

  const handleCreateCollection = async () => {
    if (!collectionName || !collectionNumber) return
    if (!connectWallet) return
    console.log('createCollection', collectionName, collectionNumber)
    const success = await createCollection(collectionName, collectionNumber)
    setCreationResult(success)
    if (success) {
      fetchCollections()
    }
  }

  const fetchCollections = async () => {
    const count = await getCollectionCount() || 0
    console.log('Collection count:', count)
    setCollectionCount(count)
    
    const collections_ = []
    for (let i = 0; i < count; i++) {
      const collection = await getCollection(i)
      collections_.push(collection)
    }
    console.log('Collections:', collections_)
    setCollections(collections_)
  }

  const handleGetCollectionCard = async (index: number) => {
    const cards = await getCollectionCard(index)
    if (cards) {
      setCollectionCards(prev => ({
        ...prev,
        [index]: cards,
      }))
    }
  }

  const handleBuyCard = async (collectionIndex: number, cardIndex: number, price: number) => {
    await buyCardCollection(collectionIndex, cardIndex, price)
    handleGetCollectionCard(collectionIndex)
  }

  const fetchUserCards = async () => {
    const cards = await getUserCards()
    if (cards) {
      console.log('User cards:', cards)
      setUserCards(cards)
    }
  }

  const fetchMarketCards = async () => {
    const cards = await getMarketCards()
    if (cards) {
      console.log('Market cards:', cards)
      setMarketCards(cards)
    }
  }

  const handleAddToMarket = async (cardId: number, price: number) => {
    await addMarket(cardId)
    fetchMarketCards()
  }

  const handleRemoveFromMarket = async (cardId: number) => {
    await removeCardFromMarket(cardId)
    fetchMarketCards()
  }

  const handleBuyFromMarket = async (cardId: number, price: number) => {
    await buyCardFromMarket(cardId, price)
    fetchMarketCards()
    fetchUserCards()
  }

  useEffect(() => {
    fetchCollections()
    fetchUserCards() // Fetch user's cards when component mounts
    fetchMarketCards() // Fetch market cards when component mounts
  }, [])

  return (
    <div className={styles.body}>
      <h1>Cartes à collectionner</h1>
      <h1>{currentAccount}</h1>
      <div>
        {isOwner !== null && (
          <div>{isOwner ? 'Vous êtes le propriétaire du contrat.' : 'Vous n\'êtes pas le propriétaire du contrat.'}</div>
        )}
      </div>
      <button onClick={connectWallet}>Connecter le compte metamask</button>
      <div>
        <button onClick={async () => {
          const ownerCount = await getOwnerCount(0);
          console.log('Nombre de cartes possédé:', ownerCount);
        }}>
          Obtenir le nombre de propriétaires
        </button>
      </div>
      <h2>Cartes que je possède</h2>
      <div>
        <button onClick={fetchUserCards}>Rafraîchir les cartes</button>
        <ul>
          {userCards.length > 0 ? (
            userCards.map((card, index) => (
              <li key={index}>
                <img src={card.imageUrl} alt={card.name} className={styles.cardImage} />
                <div><strong>id:</strong> {card.tokenId.toNumber()}</div>
                <div><strong>Nom:</strong> {card.name}</div>
                <div><strong>Type:</strong> {card.cardType}</div>
                <div><strong>Rareté:</strong> {card.rarity}</div>
                <div><strong>Effet:</strong> {card.effect}</div>
                <div><strong>Attaque:</strong> {card.attack}</div>
                <div><strong>Défense:</strong> {card.defense}</div>
                <div><strong>Quantité:</strong> {card.quantity.toNumber()}</div>
                <div><strong>Prix:</strong> {card.price.toNumber()}</div>
                <button onClick={() => handleAddToMarket(card.tokenId.toNumber(), card.price.toNumber())}>Ajouter au marché</button>
                <button onClick={() => handleRemoveFromMarket(card.tokenId.toNumber())}>Retirer du marché</button>
              </li>
            ))
          ) : (
            <div>Aucune carte trouvée.</div>
          )}
        </ul>
      </div>
      <div>
        <input
          type="text"
          placeholder="Nom de la collection"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <input
          type="text"
          placeholder="nombre de carte de la collection"
          value={collectionNumber}
          onChange={(e) => setCollectionNumber(Number(e.target.value))}
        />
        <button onClick={handleCreateCollection}>Créer une collection</button>
      </div>
      <div>
        {creationResult ? 'Collection créée avec succès!' : 'Pas de création de collection.'}
      </div>
      <div>
        <h2>Collections</h2>
        <div>Nombre de collections: {collectionCount}</div>

        {collections.length > 0 && (
          <ul>
            {collections.map((collection, index) => (
              <li key={index}>
                <strong>Collection {index + 1}:</strong>
                <div>Nom: {collection[0]}</div>
                <div>Nombre de cartes Max : {collection[1].toNumber()}</div>
                <div>
          <button onClick={async () => {
            const cards = await openCollectionBooster(index, 1, 5); // Replace collectionId, arg2, arg3 with actual arguments
            console.log('Booster cards:', cards);
          }}>
            Open Booster
          </button>
        </div>
                <div>
                  <input type="text" placeholder="Nom de la carte" id={`cardName-${index}`} />
                  <input type="text" placeholder="Type de la carte" id={`cardType-${index}`} />
                  <input type="text" placeholder="Rareté de la carte" id={`cardRarity-${index}`} />
                  <input type="text" placeholder="Image de la carte" id={`cardImage-${index}`} />
                  <input type="text" placeholder="Effet de la carte" id={`cardEffect-${index}`} />
                  <input type="number" placeholder="Attaque de la carte" id={`cardAttack-${index}`} />
                  <input type="number" placeholder="Défense de la carte" id={`cardDefense-${index}`} />
                  <input type="number" placeholder="Prix de la carte" id={`cardPrice-${index}`} />
                  <button onClick={() => {
                    const cardName = (document.getElementById(`cardName-${index}`) as HTMLInputElement).value;
                    const cardType = (document.getElementById(`cardType-${index}`) as HTMLInputElement).value;
                    const cardRarity = (document.getElementById(`cardRarity-${index}`) as HTMLInputElement).value;
                    const cardImage = (document.getElementById(`cardImage-${index}`) as HTMLInputElement).value;
                    const cardEffect = (document.getElementById(`cardEffect-${index}`) as HTMLInputElement).value;
                    const cardAttack = Number((document.getElementById(`cardAttack-${index}`) as HTMLInputElement).value);
                    const cardDefense = Number((document.getElementById(`cardDefense-${index}`) as HTMLInputElement).value);
                    const cardPrice = Number((document.getElementById(`cardPrice-${index}`) as HTMLInputElement).value);
                    addCollectionCard(index, cardName, cardType, cardRarity, cardImage, cardEffect, cardAttack, cardDefense, cardPrice);
                  }}>Ajouter une carte</button>
                </div>
                <div>
                  <button onClick={() => handleGetCollectionCard(index)}>Voir les cartes</button>
                  <ul>
                    {collectionCards[index] && collectionCards[index].length > 0 ? (
                      collectionCards[index].map((card, cardIndex) => (
                        <li key={cardIndex}>
                          <img src={card.imageUrl} alt={card.name} className={styles.cardImage} />
                          <div><strong>id:</strong> {card.tokenId.toNumber()}</div>
                          <div><strong>Nom:</strong> {card.name}</div>
                          <div><strong>Type:</strong> {card.cardType}</div>
                          <div><strong>Rareté:</strong> {card.rarity}</div>
                          <div><strong>Effet:</strong> {card.effect}</div>
                          <div><strong>Attaque:</strong> {card.attack}</div>
                          <div><strong>Défense:</strong> {card.defense}</div>
                          <div><strong>Quantité:</strong> {card.quantity.toNumber()}</div>
                          <div><strong>Prix:</strong> {card.price.toNumber()}</div>
                          {!isOwner && (
                            <button onClick={() => handleBuyCard(index, card.tokenId.toNumber(), card.price.toNumber())}>Acheter la carte</button>
                          )}
                        </li>
                      ))
                    ) : (
                      <div>Aucune carte trouvée pour cette collection.</div>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>Marché</h2>
        <ul>
          {marketCards.length > 0 ? (
            marketCards.map((card, index) => (
              <li key={index}>
                <img src={card.imageUrl} alt={card.name} className={styles.cardImage} />
                <div><strong>id:</strong> {card.tokenId.toNumber()}</div>
                <div><strong>Nom:</strong> {card.name}</div>
                <div><strong>Type:</strong> {card.cardType}</div>
                <div><strong>Rareté:</strong> {card.rarity}</div>
                <div><strong>Effet:</strong> {card.effect}</div>
                <div><strong>Attaque:</strong> {card.attack}</div>
                <div><strong>Défense:</strong> {card.defense}</div>
                <div><strong>Quantité:</strong> {card.quantity.toNumber()}</div>
                <div><strong>Prix:</strong> {card.price.toNumber()}</div>
                <button onClick={() => handleBuyFromMarket(card.tokenId.toNumber(), card.price.toNumber())}>Acheter du marché</button>
              </li>
            ))
          ) : (
            <div>Aucune carte trouvée sur le marché.</div>
          )}
        </ul>
      </div>
    </div>
  )
}
