// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
event BoosterOpened(address indexed to, int indexed collectionId, Collection.Card[] newCards);

  int private count; //nombre de collections
  uint256 private cardCount = 0; // Nombre total de cartes dans toutes les collections
  mapping(int => Collection) private collections; // Stocker toutes les collections
  uint256[] private marketCards; // Cartes sur le marché
  mapping(uint256 => int) private cardtocollection; // Permet de savoir à quelle collection appartient une carte

  constructor() Ownable(msg.sender) {
    count = 0;
  }

  // Créer une nouvelle collection
  function createCollection(
    string calldata name,
    uint256 initialCardCount
  ) external onlyOwner {
    collections[count] = new Collection(name, initialCardCount);
    count++;
  }

  // Obtenir le nombre total de cartes possédées par un utilisateur dans toutes les collections
  function getOwnerCount(address sender) public view returns (uint256) {
    uint256 totalOwnerCount = 0;

    // Parcourir toutes les collections pour obtenir le nombre total de cartes possédées par l'utilisateur
    for (int i = 0; i < count; i++) {
      Collection collection = collections[i];
      totalOwnerCount += collection.getOwnerCardCount(sender);
    }

    return totalOwnerCount;
  }

  // Acheter une carte d'une collection
  function purchaseCard(
    int collectionId,
    uint256 cardId,
    address _to
  ) external payable {
    Collection collection = collections[collectionId];
    uint256 price;
    uint256 quantity;
    (, , , , quantity, price) = collection.getCardDetails(cardId);
    require(quantity > 0, "Card sold out");

    require(msg.value >= price, "Not enough Ether sent.");
    collection.purchaseCard(cardId, _to);

    payable(owner()).transfer(msg.value); // Transfert des fonds au propriétaire du contrat
  }

  function addCardsToCollection(
      int collectionId,
      address _to,
      Collection.Card[] calldata newCards
  ) external onlyOwner {
      Collection collection = collections[collectionId];
      for (uint256 i = 0; i < newCards.length; i++) {
          collection.addCard(
              cardCount,
              newCards[i].name,
              newCards[i].cardType,
              newCards[i].rarity,
              newCards[i].imageUrl,
              newCards[i].effect,
              newCards[i].attack,
              newCards[i].defense,
              newCards[i].price,
              _to
          );
          cardtocollection[cardCount] = collectionId;
          cardCount++;
      }
  }

  function getCardCollection(
    int collectionId
  ) external view returns (Collection.Card[] memory) {
    Collection collection = collections[collectionId];
    return collection.getCollectionCards();
  }

  function getCollectionDetails(
    int collectionId
  ) external view returns (string memory, uint256) {
    Collection collection = collections[collectionId];

    return collection.getInfo();
  }

  // Obtenir le nombre de collections créées
  function getCollectionCount() external view returns (int) {
    return count;
  }

  // Retourne toutes les cartes possédées par l'utilisateur sur toutes les collections
  function getOwnerCards(
    address owner
  ) external view returns (Collection.Card[] memory) {
    uint256 totalCards = getOwnerCount(owner);

    // Crée un tableau pour stocker toutes les cartes de toutes les collections
    Collection.Card[] memory ownerCards = new Collection.Card[](totalCards);
    uint256 currentIndex = 0;

    // Deuxième étape : Parcourir chaque collection pour récupérer les cartes
    for (int i = 0; i < count; i++) {
      Collection collection = collections[i];
      Collection.Card[] memory cardsInCollection = collection.getOwnerCard(
        owner
      ); // Obtenir les cartes de la collection

      // Ajouter chaque carte au tableau global ownerCards
      for (uint256 j = 0; j < collection.getOwnerCardCount(owner); j++) {
        ownerCards[currentIndex] = cardsInCollection[j];
        currentIndex++;
      }
    }

    return ownerCards;
  }

  function getMarketCards() external view returns (Collection.Card[] memory) {
    Collection.Card[] memory cards = new Collection.Card[](marketCards.length);
    for (uint256 i = 0; i < marketCards.length; i++) {
      Collection collection = collections[cardtocollection[i]];
      cards[i] = collection.getCard(marketCards[i]);
    }
    return cards;
  }

  function addCardToMarket(uint256 cardId) external {
    marketCards.push(cardId);
  }

  function buyCardFromMarket(uint256 cardId, address _to) external payable {
    for (uint256 i = 0; i < marketCards.length; i++) {
      if (marketCards[i] == cardId) {
        Collection collection = collections[cardtocollection[cardId]];
        Collection.Card memory card = collection.getCard(cardId);
        require(msg.value >= card.price, "Not enough Ether sent.");
        address cardowner = collection.getCardOwner(cardId);
        collection.purchaseCard(cardId, _to);
        payable(cardowner).transfer(msg.value);
        removeCardFromMarket(cardId);
        break;
      }
    }
  }

  function removeCardFromMarket(uint256 cardId) public {
    for (uint256 i = 0; i < marketCards.length; i++) {
      if (marketCards[i] == cardId) {
        marketCards[i] = marketCards[marketCards.length - 1]; // Remplace par le dernier élément
        marketCards.pop(); // Réduit la longueur du tableau
        break;
      }
    }
  }

function openCollectionBooster(
    int collectionId,
    address _to,
    uint256 price,
    uint256 numCards
) external payable returns (Collection.Card[] memory) {
    require(msg.value >= price, "Insufficient funds to open booster");

    Collection collection = collections[collectionId];
    cardCount += numCards;
    Collection.Card[] memory newCards = collection.openBooster(
        _to,
        numCards,
        cardCount - numCards
    );

    emit BoosterOpened(_to, collectionId, newCards);

    return newCards;
}

}
