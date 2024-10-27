import React, { useState, useContext, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import back from "../../public/card.png";
import background from "../../public/background2.jpg";
import jaden from "../../public/jaden.png";
import ethereumLogo from "../../public/ethereum-logo.png";

import { CollectionContext } from "@/context/CollectionContext";

interface Card {
  tokenId: number;
  name: string;
  archetype: string;
  attack: number;
  defense: number;
  attribute: string;
  effect: string;
  frameType: string;
  humanReadableCardType: string;
  level: number;
  race: string;
  cardType: string;
  imageUrl: string;
  card_sets: { set_name: string; set_code: string; set_rarity: string }[];
  price: number;
}



export const Market = () => {
  const [selectedCard, setSelectedCard] =  useState<any>();
  const {currentAccount, createCollection, getCollectionCount, getCollection, isOwner, getCollectionCard, addCollectionCards, buyCardCollection, getUserCards, getOwnerCount, addMarket, getMarketCards, buyCardFromMarket, removeCardFromMarket, openCollectionBooster } = useContext(CollectionContext)
  const [marketCards, setMarketCards] = useState<any[]>([])
  
  const handleBuy = async (card: Card) => { 
    alert(`Vous avez acheté ${card.name} pour ${card.price} ETH !`);
    await buyCardFromMarket(card.tokenId, card.price)
  };

  const showCardDetails = (card: Card) => {
    setSelectedCard(card);
  };

  const fetchMarketCards = async () => {
    const cards = await getMarketCards()
    if (cards) {
      setMarketCards(cards)
    }
  }

  useEffect(()=>{
    fetchMarketCards()
  })

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
  <div className="h-full min-h-screen flex items-center justify-center text-white font-sans bg-cover bg-center " style={{ backgroundImage: `url(${background})` }}>
      <div className="max-w-6xl w-full p-6 bg-opacity-80 bg-gray-900 rounded-lg shadow-xl border border-red-900">
        <div
          className="w-full h-60 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${jaden})` }}
        ></div>

        <div className="mb-12 w-full px-8">
          <Slider {...carouselSettings}>
            {marketCards.length > 0 && marketCards.map((card) => (
              <div key={card.id} className="p-4 flex flex-col items-center">
                {/* Container with fixed height */}
                <div className="h-96 w-full flex items-center justify-center">
                  <img src={card.imageUrl} alt={card.name} className="h-full w-full object-contain rounded-lg" />
                </div>
                <h2 className="text-xl font-bold mt-4 text-yellow-500">{card.name}</h2>
                <p className="text-sm text-gray-400">{card.type}</p>
                <p className="text-lg font-bold text-red-400">{card.price.toNumber()} ETH</p>
              </div>
            ))}
          </Slider>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
          {marketCards.length > 0 && marketCards.map((card) => (
            <div
              key={card.id}
              className="relative border border-red-900 rounded-lg shadow-lg bg-gradient-to-b from-black to-gray-800 transform hover:scale-105 transition-all"
            >
              <img src={card.imageUrl} alt={card.name} className="object-cover rounded-t-lg" />

              <div className="p-4 bg-gray-900 text-center rounded-b-lg border-t border-red-900">
                <h3 className="text-lg font-bold text-yellow-500">{card.name}</h3>
                <p className="text-xs italic text-gray-400">{card.cardType}</p>
                <p className="mt-2 pb-5 text-red-400 font-semibold px-auto">
                  {card.price.toNumber()}
                  <img src={ethereumLogo} alt="Ethereum Logo" className="w-5 h-7 ml-2 inline-block" />
                </p>
                <div className="flex justify-center space-x-4">
                  {/* <button
                    onClick={() => showCardDetails(card)}
                    className="bg-red-900 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Voir
                  </button> */}
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

      {/* {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-slate-950  p-6 rounded-lg  border border-white shadow-2xl">
            <button onClick={closeCardDetails} className="absolute top-4 right-4 text-gray-300 font-bold text-lg">
              X
            </button>
            <img src={selectedCard.imageUrl} alt={selectedCard.name} className="w-full h-96 object-contain mb-4 rounded-lg border border-red-900 shadow-md" />
            <h2 className="text-2xl font-bold text-pink-400 mb-2">{selectedCard.name}</h2>
            <p className="text-gray-400">{selectedCard.cardType}</p>
            <p className="text-sm mt-2 mb-4 text-gray-500">{selectedCard.effect}</p>
            <p className="text-xl font-bold text-cyan-500">Prix: {selectedCard.price} ETH</p>
            <button
              className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Acheter
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};
