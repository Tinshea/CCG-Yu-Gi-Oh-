// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721URIStorage, Ownable {


// Structure de la carte
  struct Card {
    uint256 tokenId;
    string name;
    string cardType;
    string rarity;
    string imageUrl;
    string effect;
    uint32 attack;
    uint32 defense;
    uint256 quantity; 
    uint256 price; 
  }


  Card[] public CollectionCards; // Tableau de toutes les cartes de la collection
  string public collectionName;  // Nom de la collection
  uint256 public cardCount; // Nombre de cartes dans la collection
  mapping(uint256 => address) public cardToOwner; // Carte à propriétaire
  mapping(uint256 => uint256) public tokentoCard; // Id de la carte à l'index de la carte dans le tableau

  constructor(
    string memory _name,
    uint256 _cardCount
  ) Ownable(msg.sender) ERC721(_name, _name) {
    collectionName = _name;
    cardCount = _cardCount;
  }

  function getInfo() public view returns (string memory, uint256) {
    return (collectionName, cardCount);
  }


  function getOwnerCardCount(address owner) public view returns (uint256) {
    return balanceOf(owner);
  }

  function getCollectionCards() public view returns (Card[] memory) {
    return CollectionCards;
  }

  function _mintcollection(
    address _to,
    uint256 _tokenId,
    string memory _uri
  ) internal onlyOwner {
    _mint(_to, _tokenId);
    _setTokenURI(_tokenId, _uri);
    cardToOwner[_tokenId] = _to;

  }

  // Ajouter une carte à la collection
  function addCard(
    uint256 _tokenId,
    string memory _name,
    string memory _cardType,
    string memory _rarity,
    string memory _imageUrl,
    string memory _effect,
    uint32 _attack,
    uint32 _defense,
    uint256 _price,
    address _to
  ) external {
    CollectionCards.push(
      Card(
        _tokenId,
        _name,
        _cardType,
        _rarity,
        _imageUrl,
        _effect,
        _attack,
        _defense,
        1,
        _price
      )
    );
    tokentoCard[_tokenId] = CollectionCards.length - 1;
        require(
      CollectionCards.length < cardCount + 1,
      "All cards in this collection are already minted."
    );
    _mintcollection(_to, _tokenId, _imageUrl);

  }

 function getCard(uint256 tokenId) public view returns (Card memory) {
    return CollectionCards[tokentoCard[tokenId]];
  }

  function getCardDetails(
    uint256 tokenId
  )
    public
    view
    returns (
      string memory name,
      string memory cardType,
      string memory rarity,
      string memory imageUrl,
      uint256 quantity,
      uint256 price
    )
  {
    Card storage card = CollectionCards[tokentoCard[tokenId]];

    return (
      card.name,
      card.cardType,
      card.rarity,
      card.imageUrl,
      card.quantity,
      card.price
    );
  }

  function getCardOwner(uint256 tokenId) public view returns (address) {
    return cardToOwner[tokenId];
  }

  // Obtenir les cartes d'un propriétaire
  function getOwnerCard(address owner) public view returns (Card[] memory) {
    uint256 cardCountowner = getOwnerCardCount(owner);
    Card[] memory ownerCards = new Card[](cardCountowner); // Crée un tableau pour stocker les cartes
    uint256 counter = 0;

    // Parcours de toutes les cartes de la collection
    for (uint256 i = 0; i < CollectionCards.length; i++) {
      if (
        i < CollectionCards.length &&
        _ownerOf(CollectionCards[i].tokenId) == owner
      ) {
        // Ajouter la carte dans le tableau si le propriétaire correspond
        ownerCards[counter] = CollectionCards[i];
        counter++;
      }
    }

    return ownerCards;
  }


  // Fonction d'achat de carte
  function purchaseCard(uint256 tokenId, address _to) external {
    Card storage card = CollectionCards[tokentoCard[tokenId]];
    require(msg.sender != _to, "You cannot buy your own card");

    address ownercard = _ownerOf(tokenId);
    _transfer(ownercard, _to, tokenId);
    if (card.quantity > 0) {
      card.quantity = 0;
    }

  }

// Fonction pour ouvrir un booster
// Cette fonction permet de créer un nombre de cartes cloné aléatoires à partir des cartes de la collection
// et de les attribuer à un utilisateur
function openBooster(address _to, uint256 numCards, uint256 tokenIds) external  returns (Card[] memory) {

  Card[] memory createdCards = new Card[](numCards);
  uint256[] memory cardIds = new uint256[](numCards);

  for (uint256 i = 0; i < numCards; i++) {
    uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, i))) % CollectionCards.length;
    Card memory selectedCard = CollectionCards[randomIndex];

    uint256 newTokenId = tokenIds + i;
    CollectionCards.push(
      Card(
        newTokenId,
        selectedCard.name,
        selectedCard.cardType,
        selectedCard.rarity,
        selectedCard.imageUrl,
        selectedCard.effect,
        selectedCard.attack,
        selectedCard.defense,
        0, 
        selectedCard.price
      )
    );
    tokentoCard[newTokenId] = CollectionCards.length - 1;
    _mintcollection(_to, newTokenId, selectedCard.imageUrl);

    cardIds[i] = newTokenId;
    createdCards[i] = CollectionCards[CollectionCards.length - 1];
  }

  return createdCards;
}

}
