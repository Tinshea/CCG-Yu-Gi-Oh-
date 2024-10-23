import { useEffect, useState, useContext } from 'react'
import styles from './styles.module.css'
import { CollectionContext } from './context/CollectionContext'

export const App = () => {
  const { connectWallet, currentAccount, createCollection, getCollectionCount, getCollection, isOwner, getCollectionCard, addCollectionCard } = useContext(CollectionContext)
  
  const [collectionName, setCollectionName] = useState('')
  const [collectionNumber, setCollectionNumber] = useState(0)
  const [creationResult, setCreationResult] = useState<boolean | null>(null)
  const [collectionCount, setCollectionCount] = useState(0)
  const [collections, setCollections] = useState<any[]>([])
  const [collectionCards, setCollectionCards] = useState<{ [key: number]: any[] }>({}) // Cartes par collection

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
    setCollectionCount(count)
    
    const collections_ = []
    for (let i = 0; i < count; i++) {
      const collection = await getCollection(i)
      collections_.push(collection)
    }
    setCollections(collections_)
  }

  const handleGetCollectionCard = async (index: number) => {
    const cards = await getCollectionCard(index)
    if (cards) {
      setCollectionCards(prev => ({
        ...prev,
        [index]: cards,  // Associer les cartes à l'index de la collection
      }))
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <div className={styles.body}>
      <h1>{currentAccount}</h1>
      <div>
        {isOwner !== null && (
          <div>{isOwner ? 'Vous êtes le propriétaire du contrat.' : 'Vous n\'êtes pas le propriétaire du contrat.'}</div>
        )}
      </div>
      <button onClick={connectWallet}>Connecter le compte metamask</button>

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
                  <input type="text" placeholder="Nom de la carte" id={`cardName-${index}`} />
                  <input type="text" placeholder="Type de la carte" id={`cardType-${index}`} />
                  <input type="text" placeholder="Rareté de la carte" id={`cardRarity-${index}`} />
                  <input type="text" placeholder="Image de la carte" id={`cardImage-${index}`} />
                  <input type="text" placeholder="Effet de la carte" id={`cardEffect-${index}`} />
                  <input type="number" placeholder="Attaque de la carte" id={`cardAttack-${index}`} />
                  <input type="number" placeholder="Défense de la carte" id={`cardDefense-${index}`} />
                  <input type="number" placeholder="Quantité de la carte" id={`cardQuantity-${index}`} />
                  <input type="number" placeholder="Prix de la carte" id={`cardPrice-${index}`} />
                  <button onClick={() => {
                    const cardName = (document.getElementById(`cardName-${index}`) as HTMLInputElement).value;
                    const cardType = (document.getElementById(`cardType-${index}`) as HTMLInputElement).value;
                    const cardRarity = (document.getElementById(`cardRarity-${index}`) as HTMLInputElement).value;
                    const cardImage = (document.getElementById(`cardImage-${index}`) as HTMLInputElement).value;
                    const cardEffect = (document.getElementById(`cardEffect-${index}`) as HTMLInputElement).value;
                    const cardAttack = Number((document.getElementById(`cardAttack-${index}`) as HTMLInputElement).value);
                    const cardDefense = Number((document.getElementById(`cardDefense-${index}`) as HTMLInputElement).value);
                    const cardQuantity = Number((document.getElementById(`cardQuantity-${index}`) as HTMLInputElement).value);
                    const cardPrice = Number((document.getElementById(`cardPrice-${index}`) as HTMLInputElement).value);
                    addCollectionCard(index, cardName, cardType, cardRarity, cardImage, cardEffect, cardAttack, cardDefense, cardQuantity, cardPrice);
                  }}>Ajouter une carte</button>
                </div>
                <div>
                  <button onClick={() => handleGetCollectionCard(index)}>Voir les cartes</button>
                  <ul>
                    {collectionCards[index] && collectionCards[index].length > 0 ? (
                      collectionCards[index].map((card, cardIndex) => (
                        <li key={cardIndex}>
                          <img src={card.imageUrl} alt={card.name} className={styles.cardImage} />
                          <div><strong>Nom:</strong> {card.name}</div>
                          <div><strong>Type:</strong> {card.cardType}</div>
                          <div><strong>Rareté:</strong> {card.rarity}</div>
                          <div><strong>Effet:</strong> {card.effect}</div>
                          <div><strong>Attaque:</strong> {card.attack}</div>
                          <div><strong>Défense:</strong> {card.defense}</div>
                          <div><strong>Quantité:</strong> {card.quantity.toNumber()}</div>
                          <div><strong>Prix:</strong> {card.price.toNumber()}</div>
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
    </div>
  )
}
