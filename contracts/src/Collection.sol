// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721URIStorage, Ownable {
    // Événements pour les actions
    event CardAdded(uint256 indexed cardId, string name, string cardType, string rarity, string imageUrl, string effect, uint32 attack, uint32 defense);
    event CardPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event CardTraded(address indexed from, address indexed to, uint256 indexed tokenId);
    event BoosterOpened(address indexed user, uint256[] cardIds);
    event CardUpdated(uint256 indexed tokenId, string name, string cardType, string rarity, string imageUrl, string effect, uint32 attack, uint32 defense);
    event CardLimitReached(uint256 indexed tokenId, uint256 maxQuantity);

    string public collectionName;
    uint256 public cardCount; // Utilisation de uint256 pour cardCount

    struct Card {
        string name;
        string cardType;
        string rarity;
        string imageUrl;
        string effect;
        uint32 attack;
        uint32 defense;
        uint256 quantity; // Quantité de cette carte
        uint256 price;    // Prix de la carte
    }

    Card[] public CollectionCards;
    mapping(uint256 => address) public cardToOwner;
    mapping(address => uint256) public ownerCardCount;

    constructor(address initialOwner, string memory _name, uint256 _cardCount) 
        Ownable(initialOwner) 
        ERC721(_name, "YGO") 
    {
        collectionName = _name;
        cardCount = _cardCount;
    }

    // Fonction de mint pour créer une carte
    function mint(address _to, uint256 _tokenId, string memory _uri) internal onlyOwner {
        require(CollectionCards.length < cardCount, "All cards in this collection are already minted.");
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
        ownerCardCount[_to] += 1;
        cardToOwner[_tokenId] = _to;

        emit Transfer(address(0), _to, _tokenId);
    }

    // Ajouter une carte à la collection
    function addCard(
        string memory _name,
        string memory _cardType,
        string memory _rarity,
        string memory _imageUrl,
        string memory _effect,
        uint32 _attack,
        uint32 _defense,
        uint256 _quantity,
        uint256 _price
    ) external onlyOwner {
        CollectionCards.push(Card(_name, _cardType, _rarity, _imageUrl, _effect, _attack, _defense, _quantity, _price));
        uint256 id = CollectionCards.length - 1;
        emit CardAdded(id, _name, _cardType, _rarity, _imageUrl, _effect, _attack, _defense);
    }

    // Fonction d'achat de carte
    function purchaseCard(uint256 tokenId) external payable {
        Card storage card = CollectionCards[tokenId];
        require(msg.value >= card.price, "Not enough Ether sent");
        require(card.quantity > 0, "Card sold out");

        card.quantity--; // Décrémente la quantité
        ownerCardCount[msg.sender]++;
        cardToOwner[tokenId] = msg.sender;

        // Transfert des fonds au propriétaire du contrat
        payable(owner()).transfer(msg.value);

        emit CardPurchased(msg.sender, tokenId, card.price);

        // Vérifie si la quantité est atteinte
        if (card.quantity == 0) {
            emit CardLimitReached(tokenId, 0);
        }
    }

    // Obtenir les détails d'une carte
    function getCardDetails(uint256 tokenId) public view returns (
        string memory name, 
        string memory cardType, 
        string memory rarity, 
        string memory imageUrl, 
        uint256 quantity, 
        uint256 price
    ) {
        Card storage card = CollectionCards[tokenId];
        return (card.name, card.cardType, card.rarity, card.imageUrl, card.quantity, card.price);
    }

    function getCardOwner(uint256 tokenId) public view returns (address) {
        return cardToOwner[tokenId];
    }

    function getOwnerCardCount(address owner) public view returns (uint256) {
        return ownerCardCount[owner];
    }

    function getCollectionCards() public view returns (Card[] memory) {
        return CollectionCards;
    }
}
