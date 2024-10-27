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


export const Booster = () => {
  const navigate = useNavigate();
  const [cardSets, setCardSets] = useState<any[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [cards, setCards] = useState<Card[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [cardQuantities, setCardQuantities] = useState<{ [key: string]: number }>({});
  const [setImages, setSetImages] = useState<{ [key: string]: string | null }>({});
  const {currentAccount, createCollection, getCollectionCount, getCollection, isOwner, getCollectionCard, addCollectionCards, buyCardCollection, getUserCards, getOwnerCount, addMarket, getMarketCards, buyCardFromMarket, removeCardFromMarket, openCollectionBooster } = useContext(CollectionContext)
  const [collectionCount, setCollectionCount] = useState(0);
  const [showBooster, setShowBooster] = useState(false);

  const handleOpenBooster = () => {
    setShowBooster(true);
    // Simule l'ouverture avec un timeout pour cacher l'effet après un moment
    setTimeout(() => setShowBooster(false), 3000);
  };

  useEffect(() => {
    const fetchSets = async () => {
        await fetchCollections();
    }
        fetchSets().catch(error => console.error("Error fetching sets:", error));
    },[]);


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
  
  
  
  const handleSeeClick = async(index:number,price:number) =>{
    setSelectedSet(cardSets[index].set_name);
    const cards = await openCollectionBooster(index, price, 5);
    if (cards) {
      setCards(prev => ({
        ...prev,
        [index]: cards,
      }))
    }
    // setShowAddSetModal(true);
    handleOpenBooster()
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
  
  return (
    <div className="flex bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-white/10 w-screen h-screen overflow-y-scroll p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 text-white font-bold w-2/4 ">
          {cardSets.length > 0 &&
            cardSets.map((set, index) => (
              <div key={set.set_name} className="text-center p-4 bg-black/80 custom-card rounded-md">
                <h3 className="text-lg font-yugioh mb-2">{set.set_name}</h3>
                {set.set_image ? (
                  <img
                    src={set.set_image}
                    alt={set.set_name}
                    className="h-32 mb-4 mx-auto object-cover glow-effect rounded-md"
                  />
                ) : (
                  <img src={blackmagicien} className="h-32 mb-4 mx-auto glow-effect rounded-md" />
                )}
                <p className="text-white text-sm glow-text">Date de sortie: {set.tcg_date}</p>
                <p className="text-white text-sm glow-text">Nombre de Cartes: {set.num_of_cards}</p>
                <p className="text-white text-sm glow-text">Price: {set.num_of_cards%5}</p>
  
                <button
                  className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black text-xl py-2 px-4 rounded-lg glow-effect transition duration-500"
                  onClick={() => handleSeeClick(index,set.num_of_cards%5)}
                >
                  Ouvrir Booster
                </button>
              </div>
            ))}
        </div>
      </div>
  
      {/* Modal pour l'ajout de set */}
      {showBooster && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-booster-open">
          <div className="bg-gradient-to-b from-yellow-600 to-red-600 p-8 rounded-lg shadow-2xl text-center animate-glow-box">
            <h2 className="text-4xl text-white mb-4 font-yugioh">Booster Ouvert!</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(cards).map(([key, cardSet]) =>
                Array.isArray(cardSet) &&
                cardSets.length > 0 &&
                cardSet.map((card, index) => {
                  const price = card[9] && card[9]._isBigNumber ? BigNumber.from(card[9]._hex).toString() : "N/A";
                  return (
                    <div
                      key={index}
                      className="card-display relative w-40 h-56 rounded-lg shadow-md flex items-center justify-center animate-card-reveal"
                    >
                      <img
                        src={card[4]}
                        alt={card.name}
                        className="rounded-md glow-card"
                      />
                    </div>
                  );
                })
              )}
            </div>
            <button
              className="mt-6 bg-black hover:bg-gray-900 text-yellow-500 px-4 py-2 rounded-full"
              onClick={() => setShowBooster(false)}
            >
              <XMarkIcon className="h-6 w-6 inline mr-2" />
              Fermer
            </button>
          </div>
        </div>
      )}
  
      <style>{`
        /* Ajout de la police Yu-Gi-Oh */
        @font-face {
          font-family: 'YuGiOhFont';
          src: url('../../public/yu-gi-oh-matrix-bold.ttf') format('truetype');
        }
        .font-yugioh {
          font-family: 'YuGiOhFont', sans-serif;
        }
  
        /* Effet de glow pour les boutons */
        .glow-effect {
          filter: drop-shadow(0 0 15px rgb(255, 215, 0));
        }
  
        /* Effet de glow de boîte */
        .animate-glow-box {
          animation: glowBox 2s ease-in-out infinite alternate;
        }
        @keyframes glowBox {
          from {
            box-shadow: 0 0 30px rgba(255, 223, 0, 0.8), 0 0 60px rgba(255, 69, 0, 0.6);
          }
          to {
            box-shadow: 0 0 60px rgba(255, 223, 0, 1), 0 0 80px rgba(255, 69, 0, 1);
          }
        }
  
        /* Effet de révélation de carte */
        .animate-card-reveal {
          animation: cardReveal 1.5s ease-out forwards;
        }
        @keyframes cardReveal {
          from {
            transform: translateY(20px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
  
        /* Animation d'ouverture de booster */
        .animate-booster-open {
          animation: boosterOpen 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes boosterOpen {
          0% {
            opacity: 0;
            transform: scale(0.8) rotateX(20deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateX(0deg);
          }
        }
  
        /* Effet de glow pour les cartes */
        .glow-card {
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
        }
      `}</style>
    </div>
  );
};
