import React from 'react';

interface CardProps {
  card: {
    imageUrl: string;
    name: string;
    cardType: string;
    rarity: string;
    effect: string;
    attack: number;
    defense: number;
  };
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="card">
      <img src={card.imageUrl} alt={card.name} />
      <h2>{card.name}</h2>
      <p>Type: {card.cardType}</p>
      <p>Rareté: {card.rarity}</p>
      <p>Effet: {card.effect}</p>
      <p>Attaque: {card.attack}</p>
      <p>Défense: {card.defense}</p>
    </div>
  );
};

export default Card;
