import { useEffect, useContext, useState } from "react";
import { XMarkIcon , ArrowLeftIcon} from "@heroicons/react/24/outline";
import background from "../../public/background2.jpg";
import blackmagicien from "../../public/puzzle.png";
import { useNavigate } from "react-router-dom";
import { CollectionContext } from "@/context/CollectionContext";
import { BigNumber } from "ethers"; 

interface CardSet {
  set_name: string;
  tcg_date: string;
  num_of_cards: number;
  added_by_admin: boolean;
  set_image: string;
}

interface Card {
  id: number;
  name: string;
  archetype: string;
  atk: number;
  def: number;
  attribute: string;
  desc: string;
  frameType: string;
  humanReadableCardType: string;
  level: number;
  race: string;
  type: string;
  card_images: { image_url: string }[];
  card_sets: { set_name: string; set_code: string; set_rarity: string; }[];
  price: number;
}


export const Collection = () => {
  const navigate = useNavigate();
  const [cardSets, setCardSets] = useState<any[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [cards, setCards] = useState<Card[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [cardQuantities, setCardQuantities] = useState<{ [key: string]: number }>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [setImages, setSetImages] = useState<{ [key: string]: string | null }>({});
  const {currentAccount, createCollection, getCollectionCount, getCollection, isOwner, getCollectionCard, addCollectionCards, buyCardCollection, getUserCards, getOwnerCount, addMarket, getMarketCards, buyCardFromMarket, removeCardFromMarket, openCollectionBooster } = useContext(CollectionContext)
  const [collectionCount, setCollectionCount] = useState(0);

  useEffect(() => {
    setIsAdmin(isOwner);
  }, [isOwner]);


  useEffect(() => {
    const fetchSets = async () => {
      if (isAdmin) {
        const response = await fetch("https://db.ygoprodeck.com/api/v7/cardsets.php");
        const data: CardSet[] = await response.json();
        const filteredSets = data; 
        setCardSets(filteredSets);
      } else {
        await fetchCollections();
      }
    };

    fetchSets().catch(error => console.error("Error fetching sets:", error));
  }, [isAdmin]);


  const fetchCards = (setName: string) => {
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${setName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setCards(data.data);
        } else {
          console.error("Unexpected data format:", data);
          setCards([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
        setCards([]);
      });
  };
  
  const handleCloseModal = () => {
    setShowCards(false);
    setShowAddSetModal(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleAddSetClick = (setName: string) => {
    setSelectedSet(setName);
    fetchCards(setName);
    setShowAddSetModal(true);
  };



  const handleAddSetConfirm = async () => {
    // 1. Création de la collection avec le nom du set et le nombre de cartes
    const collectionCreated = await createCollection(selectedSet, cards.length);
    console.log("ici",cards.length);
    if (!collectionCreated) {
      console.error("Erreur lors de la création de la collection.");
      return;
    }
  
    // 2. Récupère l'ID de la collection nouvellement créée
    const collectionCount = await getCollectionCount();
    if (collectionCount === null) {
      console.error("Erreur lors de la récupération du compte de collections.");
      return;
    }
    const newCollectionId = collectionCount - 1;
  
    // 3. Prépare toutes les cartes pour les ajouter en une seule transaction
    const cardsToAdd = cards.map((card) => {
      // Détermine le prix en fonction du type de carte
      let price;
      if (card.humanReadableCardType.includes("Normal Monster")) {
        price = 2; // 2 ETH pour les cartes monstres normales
      } else if (card.humanReadableCardType.includes("Spell") || card.humanReadableCardType.includes("Trap")) {
        price = 1; // 1 ETH pour les cartes magie/piège
      } else if (card.humanReadableCardType.includes("Effect Monster")) {
        price = 3; // 2.5 ETH pour les monstres à effet
      } else if (card.frameType.includes("Fusion") || card.frameType.includes("Synchro")) {
        price = 3; // 3 ETH pour les monstres fusion/synchro ou autres
      } else {
        price = 1; // Prix par défaut si le type de carte ne correspond à rien d'autre
      }
  
      return {
        tokenId:0,
        name: card.name,
        cardType: card.type || "Type ici",
        rarity: "Rareté ici", // Remplace par la rareté réelle si disponible
        imageUrl: card.card_images[0].image_url,
        effect: card.desc || "Effet ici", // Remplace par l'effet réel si disponible
        attack: 0, // Utilise l'attribut d'attaque réel ou 0
        defense: card.def || 0, // Utilise l'attribut de défense réel ou 0
        quantity:1, 
        price, // Prix déterminé
      };
    });
  
    // 4. Ajoute toutes les cartes à la collection en une seule transaction
    const success = await addCollectionCards(newCollectionId, cardsToAdd);
    setCards([]);
    setSelectedSet("");
    if (!success) {
      console.error("Erreur lors de l'ajout des cartes à la collection.");
    }
    handleGetCollectionCard(newCollectionId);
    handleCloseModal();
  };
  
  //fonction pour recuperer les sets pour l'utilisateur
  const fetchCollections = async () => {
    const count = (await getCollectionCount()) || 0;
    console.log("Collection count:", count);
    setCollectionCount(count);
    
    const allSetsResponse = await fetch("https://db.ygoprodeck.com/api/v7/cardsets.php");
    const allSetsData = await allSetsResponse.json();
  
    const collectionPromises = Array.from({ length: count }, async (_, i) => {
      const collection = await getCollection(i);
  
      if (collection && collection[0]) {
        const setName = collection[0];
        const matchingSet = allSetsData.find((set: any) => set.set_name === setName);
  
        return {
          num_of_cards: matchingSet?.num_of_cards || null,
          set_code:matchingSet?.set_code ||null,
          set_image: matchingSet?.set_image || null,
          set_name: setName,
          tcg_date: matchingSet?.tcg_date || null,
        };
      }
      return null;
    });
  
    const collections_ = (await Promise.all(collectionPromises)).filter(Boolean);
    setCardSets(collections_);
  };
  
  
  

  const handleGetCollectionCard = async (index: number) => {
    const cards = await getCollectionCard(index)
    if (cards) {
      setCards(prev => ({
        ...prev,
        [index]: cards,
      }))
    }
  }
  
  const handleSeeClick = (index:number) =>{
    setSelectedSet(cardSets[index].set_name);
    handleGetCollectionCard(index);
    setShowAddSetModal(true);
  }

  const sortSets = (type: string) => {
    let sortedSets;
    switch (type) {
      case "name":
        sortedSets = [...cardSets].sort((a, b) => a.set_name.localeCompare(b.set_name));
        break;
      case "release":
        sortedSets = [...cardSets].sort((a, b) => new Date(b.tcg_date).getTime() - new Date(a.tcg_date).getTime());
        break;
      case "cards":
        sortedSets = [...cardSets].sort((a, b) => b.num_of_cards - a.num_of_cards);
        break;
      default:
        sortedSets = cardSets;
    }
    setCardSets(sortedSets);
  };

  useEffect(() => {
    if (cards) {
      console.log("Updated cards:", cards); // Logs whenever cards change
    }
  }, [cards]);
  

  const handleAcheter =async (collectionIndex: number, cardIndex: number, price: number) =>{
    console.log(cardIndex);
    await buyCardCollection(collectionIndex, cardIndex, price);
    handleGetCollectionCard(collectionIndex)
  }

  return (
    <div className="flex bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-black/50 p-2  rounded-full hover:bg-lime-500 transition duration-200"
      >
        <ArrowLeftIcon className="h-6 w-6 text-white" />
      </button>
      {/* Section gauche pour les filtres et le tri */}
      <div className="w-1/4 bg-white/10 h-screen flex flex-col items-center p-4">
        <h2 className="text-white text-6xl mb-4">Filtres</h2>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-950 hover:bg-lime-500 border-l-4 border-lime-500 text-white py-2 px-4"
            onClick={() => sortSets("name")}
          >
            Trier par nom
          </button>
          <button
            className="bg-blue-950 hover:bg-lime-500 border-l-4 border-lime-500 text-white py-2 px-4"
            onClick={() => sortSets("release")}
          >
            Trier par date de sortie
          </button>
          <button
            className="bg-blue-950 hover:bg-lime-500 border-l-4 border-lime-500 text-white py-2 px-4"
            onClick={() => sortSets("cards")}
          >
            Trier par nombre de cartes
          </button>
        </div>
      </div>

      {/* Section droite pour l'affichage des sets */}
      <div className="ml-10 bg-white/10 w-3/4 h-screen overflow-y-scroll p-4">
        <h2 className="text-white text-2xl mb-4">Sets de cartes</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {cardSets.length > 0 && cardSets.map((set,index) => (
            <div key={set.set_name} className="p-4 bg-black/70  rounded-xl  custom-card">
              <h3 className="text-lime-500 text-lg mb-2">{set.set_name}</h3>
              {set.set_image ? ( // Utilisation directe de l'image fournie par l'API
                <img
                  src={set.set_image}
                  alt={set.set_name}
                  className="h-32 mb-8 mx-auto object-cover glow-effect rounded-md"
                />
              ) : (
                <img src={blackmagicien} className="h-32 mb-8 mx-auto glow-effect  rounded-md"/>
              )}
              <p className="text-white text-sm glow-text">Date de sortie: {set.tcg_date}</p>
              <p className="text-white text-sm glow-text">Nombre de Cartes: {set.num_of_cards}</p>
              {isAdmin ?(
                <button 
                className="group relative block mx-auto my-3 h-10 w-1/2 overflow-hidden rounded-2xl bg-lime-500 text-lg font-bold text-white" 
                onClick={() => handleAddSetClick(set.set_name)}
              >
                Ajouter set
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>):
                <button 
                className="group relative block mx-auto my-3 h-10 w-1/2 overflow-hidden rounded-2xl bg-blue-500 text-lg font-bold text-white" 
                onClick={() => handleSeeClick(index)}
              >
                voir les cartes
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour l'ajout de set */}
      {showAddSetModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-black p-8 bg-opacity-90 rounded-lg overflow-y-auto h-4/5 w-3/4 relative">
          <h2 className="text-2xl mb-4">{selectedSet} - Ajouter des cartes</h2>
          <XMarkIcon className="h-10 w-10 text-lime-500 cursor-pointer mb-7" onClick={() => setShowAddSetModal(false)} />
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {isAdmin ? (
          // Admin view - directly maps over `cards`
          cards.length > 0 && cards.map((card, index) => (
            <div key={index} className="rounded-lg">
              <img
                src={card.card_images[0].image_url}
                alt={card.name}
                className="object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          // Non-admin view - maps over `Object.entries(cards)` to handle `cardSet`
          Object.entries(cards).map(([key, cardSet]) => (
            Array.isArray(cardSet) &&
            cardSets.length > 0 && cardSet.map((card, index) => {
              const price = card[9] && card[9]._isBigNumber ? BigNumber.from(card[9]._hex).toString() : "N/A";
              console.log("iciiii",cards);
              console.log("iciiii aussi",key)
              return (
                <div key={index} className="rounded-lg">
                  <div className="card-info ">
                    <div className="flex relative justify-center font-bold ">
                      <p className="text-yellow-500 bg-purple-950 w-full text-center rounded-sm">Prix: {price}</p>
                    </div>
                    <img
                      src={card[4]}
                      alt={card.name}
                      className="object-cover rounded-md"
                    />
                    <div className="flex relative justify-center">
                    {card.quantity > 0 ?(
                    <button
                    className="bg-yellow-500 hover:bg-blue-500 group relative block mx-auto my-3 text-lg custom-card2 text-white"
                    onClick={() => handleAcheter(Number(key),card.tokenId.toNumber(),card.price.toNumber())}
                    >
                    Acheter
                  </button>):(
                    <div className="bg-red-700 group relative block mx-auto my-3 text-lg custom-card2 text-white"> Vendu </div>
                  )}
                  </div>
                  </div>
                </div>
              );
            })
          ))
        )}
          </div>
          {isAdmin &&(
          <button
            className="bg-blue-500 hover:bg-blue-500 group relative block mx-auto my-3 text-lg custom-card text-white"
            onClick={handleAddSetConfirm}
          >
            Confirmer
            <div className="absolute inset-0 custom-card h-full w-full scale-0 transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
          </button>
          )}
        </div>
      </div>
    )}


      <style>{`
        @font-face {
          font-family: 'YuGiOhFont';
          src: url('../../public/yu-gi-oh-matrix-bold.ttf') format('truetype');
        }

        .custom-card {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          padding: 10px 20px;
          border: 1px solid white;
          clip-path: polygon(30% 0%, 94% 0, 100% 7%, 100% 70%, 100% 100%, 5% 100%, 0 93%, 0 0);
          transition: transform 0.3s, box-shadow 0.3s;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-family: 'YuGiOhFont', sans-serif;
        }

        .custom-card2 {
          color: white;
          font-weight: bold;
          padding: 5px 10px;
          border: 2px solid white;
          clip-path: polygon(30% 0%, 94% 0, 100% 7%, 100% 70%, 100% 100%, 5% 100%, 0 93%, 0 0);
          transition: transform 0.3s, box-shadow 0.3s;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-family: 'YuGiOhFont', sans-serif;
        }

        /* Glow effect for images */
        .glow-effect {
          filter: drop-shadow(0px 0px 20px white);
        }

        /* Glow effect for text */
        .glow-text {
          text-shadow: 0px 0px 20px white;
        }
      `}</style>
    </div>
  );
};
