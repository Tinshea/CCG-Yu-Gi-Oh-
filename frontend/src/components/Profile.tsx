import { useState, useRef } from "react";
import background from "../../public/background.jpg";
import backCard from "../../public/card.png";
import avatar from "../../public/lewis.png"; 
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import deck from "../../public/deck.png";

interface Card {
  name: string;
  type: string;
  description: string;
  image: string;
}

// Cartes simulées pour l'utilisateur (ajoute tes propres cartes ici)
const userCards: Card[] = [
  {
    name: "Dark Tuner Catastrogue",
    type: "[Fiend/Dark Tuner]",
    description: "This card cannot be used as a Synchro Material Monster...",
    image: backCard, 
  },
  {
    name: "Blue-Eyes White Dragon",
    type: "[Dragon/Effect]",
    description: "This legendary dragon is a powerful engine of destruction.",
    image: backCard, 
  },
  ...new Array(8).fill({
    name: "Carte inconnue",
    type: "Type inconnu",
    description: "Aucune description disponible",
    image: backCard,
  }),
];

export const Profile = () => {
  const [selectedCard, setSelectedCard] = useState<Card>(userCards[0]);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSellWindow, setShowSellWindow] = useState(false);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false); // État pour gérer l'affichage plein écran
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  // Gestion du clic droit pour afficher le menu contextuel
  const handleContextMenu = (event: React.MouseEvent, card: Card, index: number) => {
    event.preventDefault();
    setSelectedCard(card);

    const cardElement = cardRefs.current[index];
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      setMenuPosition({
        x: rect.left - 400,
        y: rect.bottom - window.scrollY - 70,
      });
    }
    setShowMenu(true);
  };

  // Fermeture du menu
  const closeMenu = () => {
    setShowMenu(false);
  };

  // Ouvrir la fenêtre de vente
  const openSellWindow = () => {
    setShowSellWindow(true);
    closeMenu();
  };

  // Confirmer la vente
  const confirmSale = () => {
    alert(`Carte vendue pour ${sellPrice} !`);
    setShowSellWindow(false);
    setSellPrice(0);
  };

  // Annuler la vente
  const cancelSale = () => {
    setShowSellWindow(false);
    setSellPrice(0);
  };

  // Afficher la carte en plein écran
  const showImageInFullScreen = () => {
    setShowFullScreenImage(true);
    closeMenu(); // Fermer le menu contextuel
  };

  // Fermer l'image en plein écran
  const closeFullScreenImage = () => {
    setShowFullScreenImage(false);
  };

  return (
    <div className="flex h-screen bg-cover overflow-hidden" style={{ backgroundImage: `url(${background})` }}>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-black/50 p-2 z-20 rounded-full hover:bg-lime-500 transition duration-200">
        <ArrowLeftIcon className="h-6 w-6 text-white" />
      </button>

      {/* Section gauche: Carte sélectionnée */}
      <div className="w-1/4 h-screen relative">
        <img src={selectedCard.image} className="w-3/4 mx-auto my-4 relative z-10" alt={selectedCard.name} />
        <div className="bg-black w-full h-screen absolute top-0 opacity-70 z-0"></div>
        <div className="text-white relative z-10 p-4">
          <h2 className="text-xl font-bold">{selectedCard.name}</h2>
          <p className="text-sm">{selectedCard.type}</p>
          <p className="mt-2">{selectedCard.description}</p>
        </div>
      </div>

      {/* Section droite divisée en deux */}
      <div className="w-3/4 h-screen flex flex-col">
        {/* Navbar en haut */}
        <div className="grid grid-cols-2 justify-end">
          <div className="flex items-center bg-zinc-300 border-4 border-white p-4 ml-7 w-5/6 h-14">
            <img src={deck} className="w-12" />
            <span className="text-black text-3xl font-extrabold">Cartes possédées</span>
          </div>
          <div className="flex justify-end bg-black items-center border-2 opacity-80 border-white p-4 w-full h-14 rounded-md">
            <span className="text-white text-3xl font-extrabold mx-auto">Bienvenue, Duelliste</span>
            <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white" />
          </div>
        </div>

        {/* Contenu (grille des cartes) en bas */}
        <div className="flex-grow p-7 relative">
          <div className="bg-black w-full h-full absolute top-0 opacity-70 z-10"></div>

          {/* Grille des cartes */}
          <div className="grid grid-cols-10 gap-4 auto-rows-fr relative z-10">
            {userCards.map((card, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className="rounded-lg p-2 cursor-pointer flex justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg"
                onClick={() => setSelectedCard(card)}
                onContextMenu={(e) => handleContextMenu(e, card, index)} // Clic droit
              >
                <img src={card.image} alt={card.name} className="w-full h-40 object-contain" />
              </div>
            ))}
          </div>

          {/* Menu contextuel */}
          {showMenu && menuPosition && (
            <div
              className="absolute bg-white shadow-lg rounded-lg p-4 z-30"
              style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
            >
              <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={showImageInFullScreen}>
                Afficher carte
              </button>
              <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={openSellWindow}>
                Vendre
              </button>
              <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={() => alert("Supprimer")}>
                Supprimer
              </button>
              <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={closeMenu}>
                Annuler
              </button>
            </div>
          )}

          {/* Fenêtre de vente */}
          {showSellWindow && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
              <div className="bg-white rounded-lg p-4 w-1/4">
                <h3 className="text-lg font-bold mb-4">Vendre la carte</h3>
                <label className="block mb-2">Prix de vente :</label>
                <input
                  type="text"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="border border-gray-300 rounded-md w-full p-2 mb-4"
                />
                <div className="flex justify-between">
                  <button onClick={confirmSale} className="bg-black text-white px-4 py-2 rounded-md">
                    Confirmer
                  </button>
                  <button onClick={cancelSale} className="bg-zinc-500 text-white px-4 py-2 rounded-md">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fenêtre plein écran pour l'image de la carte */}
          {showFullScreenImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-40">
              <img src={selectedCard.image} alt={selectedCard.name} className="max-h-full max-w-full" />
              <button
                onClick={closeFullScreenImage}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                &times; {/* Icône pour fermer */}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
