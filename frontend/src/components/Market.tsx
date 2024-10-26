import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import back from "../../public/card.png";

interface CardForSale {
  id: number;
  name: string;
  type: string;
  description: string;
  price: number;
  image: string;
  seller: string;
}

const cardsForSale: CardForSale[] = [
  {
    id: 1,
    name: "Blue-Eyes White Dragon",
    type: "[Dragon/Effect]",
    description: "A legendary dragon known for its destructive power.",
    price: 100,
    image: back,
    seller: "PlayerOne",
  },
  {
    id: 2,
    name: "Dark Magician",
    type: "[Spellcaster/Normal]",
    description: "The ultimate wizard in terms of attack and defense.",
    price: 80,
    image: back,
    seller: "PlayerTwo",
  },
  {
    id: 3,
    name: "Dark Magician Girl",
    type: "[Spellcaster/Effect]",
    description: "A magical girl with great skills and a bit of charm.",
    price: 120,
    image: back,
    seller: "PlayerThree",
  },
  {
    id: 4,
    name: "Red-Eyes Black Dragon",
    type: "[Dragon/Effect]",
    description: "A ferocious dragon with a powerful attack.",
    price: 70,
    image: back,
    seller: "PlayerFour",
  },
  {
    id: 5,
    name: "Summoned Skull",
    type: "[Fiend/Normal]",
    description: "This monster has a strong attack and an intimidating presence.",
    price: 60,
    image: back,
    seller: "PlayerFive",
  },
];

export const Market = () => {
  const [selectedCard, setSelectedCard] = useState<CardForSale | null>(null);

  const handleBuy = (card: CardForSale) => {
    alert(`Vous avez acheté ${card.name} pour ${card.price} ETH !`);
  };

  const showCardDetails = (card: CardForSale) => {
    setSelectedCard(card);
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900 flex flex-col items-center justify-center text-white font-sans">
      <div className="max-w-6xl w-full p-6 bg-opacity-80 bg-gray-900 rounded-lg shadow-xl border border-cyan-300">
        <h1 className="text-5xl font-bold text-center mb-10 text-yellow-500 tracking-widest">Market</h1>

        <div className="mb-12 w-full px-8">
          <Slider {...carouselSettings}>
            {cardsForSale.map((card) => (
              <div key={card.id} className="p-4 flex flex-col items-center">
                {/* Container with fixed height */}
                <div className="h-96 w-full flex items-center justify-center">
                  <img src={card.image} alt={card.name} className="h-full w-full object-contain rounded-lg" />
                </div>
                <h2 className="text-xl font-bold mt-4 text-yellow-500">{card.name}</h2>
                <p className="text-sm text-gray-400">{card.type}</p>
                <p className="text-lg font-bold text-cyan-400">{card.price} ETH</p>
              </div>
            ))}
          </Slider>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
          {cardsForSale.map((card) => (
            <div
              key={card.id}
              className="relative border border-cyan-400 rounded-lg shadow-lg bg-gradient-to-b from-black to-gray-800 transform hover:scale-105 transition-all"
            >
              <img src={card.image} alt={card.name} className="object-cover rounded-t-lg" />

              <div className="p-4 bg-gray-900 text-center rounded-b-lg border-t border-cyan-400">
                <h3 className="text-lg font-bold text-yellow-500">{card.name}</h3>
                <p className="text-xs italic text-gray-400">{card.type}</p>
                <p className="mt-2 text-cyan-400 font-semibold">{card.price} ETH</p>
                <p className="text-sm text-gray-500 mb-4">Vendeur: {card.seller}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => showCardDetails(card)}
                    className="bg-blue-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => handleBuy(card)}
                    className="bg-zinc-100 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-slate-950  p-6 rounded-lg  border border-white shadow-2xl">
            <button onClick={closeCardDetails} className="absolute top-4 right-4 text-gray-300 font-bold text-lg">
              X
            </button>
            <img src={selectedCard.image} alt={selectedCard.name} className="w-full h-96 object-contain mb-4 rounded-lg border border-cyan-500 shadow-md" />
            <h2 className="text-2xl font-bold text-pink-400 mb-2">{selectedCard.name}</h2>
            <p className="text-gray-400">{selectedCard.type}</p>
            <p className="text-sm mt-2 mb-4 text-gray-500">{selectedCard.description}</p>
            <p className="text-xl font-bold text-cyan-500">Prix: {selectedCard.price} ETH</p>
            <p className="text-gray-500 mt-1">Vendeur: {selectedCard.seller}</p>
            <button
              onClick={() => handleBuy(selectedCard)}
              className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Acheter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
