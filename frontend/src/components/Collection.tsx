import { useEffect, useState } from "react";
import { XMarkIcon , ArrowLeftIcon} from "@heroicons/react/24/outline";
import background from "../../public/background2.jpg";
import blackmagicien from "../../public/puzzle.png";

import { useNavigate } from "react-router-dom";

interface CardSet {
  set_name: string;
  tcg_date: string;
  num_of_cards: number;
  added_by_admin: boolean;
  set_image: string;
}

interface Card {
  name: string;
  card_images: { image_url: string }[];
}


export const Collection = () => {
  const navigate = useNavigate();
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [cards, setCards] = useState<Card[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [cardQuantities, setCardQuantities] = useState<{ [key: string]: number }>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [setImages, setSetImages] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    setIsAdmin(true);
    // fetch("/api/check-admin") // URL de ton backend
    //   .then((response) => response.json())
    //   .then((data) => setIsAdmin(data.isAdmin))
    //   .catch((error) => console.error("Error checking admin status:", error));
  }, []);


  useEffect(() => {
    fetch("https://db.ygoprodeck.com/api/v7/cardsets.php")
      .then((response) => response.json())
      .then((data: CardSet[]) => {
        const filteredSets = isAdmin ? data : data.filter(set => set.added_by_admin);
        setCardSets(filteredSets);
      })
      .catch((error) => console.error("Error fetching card sets:", error));
  }, [isAdmin]);

  const fetchCards = (setName: string) => {
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${setName}`)
      .then((response) => response.json())
      .then((data) => setCards(data.data))
      .catch((error) => console.error("Error fetching cards:", error));
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
    setCardQuantities({});
    fetchCards(setName);
    setShowAddSetModal(true);
  };

  const handleCardQuantityChange = (cardName: string, quantity: number) => {
    setCardQuantities((prev) => ({ ...prev, [cardName]: quantity }));
  };

  const handleAddSet = () => {
    console.log("Adding set:", selectedSet, "with quantities:", cardQuantities);
    // Ici, tu ajouterais la logique pour ajouter le set à la collection
    handleCloseModal(); // Ferme le modal après ajout
  };

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

  const fetchSetImage = async (setName: string): Promise<string | null> => {
    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/http://yugiohprices.com/api/set_image/${setName}`);
      const data = await response.json();
      return data?.image_url || null;
    } catch (error) {
      console.error(`Error fetching image for set ${setName}:`, error);
      return null;
    }
  };

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
          {cardSets.map((set) => (
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
              {isAdmin &&(
                <button 
                className="group relative block mx-auto my-3 h-10 w-1/2 overflow-hidden rounded-2xl bg-lime-500 text-lg font-bold text-white" 
                onClick={() => handleAddSetClick(set.set_name)}
              >
                Ajouter set
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>)}
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
              {cards.map((card) => (
                <div key={card.name} className="rounded-lg">
                  <img
                    src={card.card_images[0].image_url}
                    alt={card.name}
                    className="object-cover  rounded-md"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantité"
                    value={cardQuantities[card.name] || 0}
                    onChange={(e) => handleCardQuantityChange(card.name, parseInt(e.target.value) || 0)}
                    className="border border-gray-300 rounded p-1 w-full"
                  />
                </div>
              ))}
            </div>
 
            <button
              className="bg-blue-500 hover:bg-blue-500  group relative block mx-auto my-3 text-lg custom-card text-white"
              onClick={handleAddSet}
            >
              Ajouter set
              <div className="absolute inset-0 custom-card h-full w-full scale-0  transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
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
