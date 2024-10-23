// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {

    int private count;
    mapping(int => Collection) private collections;

    // Événements pour suivre les actions
    event CollectionCreated(int indexed collectionId, string name);
    event CardAddedToCollection(int indexed collectionId, uint256 cardId);
    event CardPurchased(int indexed collectionId, address buyer, uint256 cardId);

    constructor() Ownable(msg.sender) {
        count = 0;
    }

    // Créer une nouvelle collection
    function createCollection(string calldata name, uint256 cardCount) external onlyOwner {
        collections[count] = new Collection(msg.sender , name, cardCount);
        count++;
        emit CollectionCreated(count - 1, name);
    }



    // Acheter une carte d'une collection
    function purchaseCard(int collectionId, uint256 cardId) external payable {
        Collection collection = collections[collectionId];
        collection.purchaseCard(cardId);
        emit CardPurchased(collectionId, msg.sender, cardId);
    }


    function addCardToCollection(
        int collectionId,
        string calldata name,
        string calldata cardType,
        string calldata rarity,
        string calldata imageUrl,
        string calldata effect,
        uint32 attack,
        uint32 defense,
        uint256 quantity,
        uint256 price
    ) external onlyOwner {
        Collection collection = collections[collectionId];
        collection.addCard(name, cardType, rarity, imageUrl, effect, attack, defense, quantity, price);
        emit CardAddedToCollection(collectionId, collection.cardCount());
    }


    function getCardCollection(int collectionId) external view returns (Collection.Card[] memory) {
        Collection collection = collections[collectionId];
        return collection.getCollectionCards();
    }
    // Obtenir les détails d'une collection
    function getCollectionDetails(int collectionId) external view returns (string memory, uint256) {
        Collection collection = collections[collectionId];

        return collection.getInfo();
    }

    // Obtenir le nombre de collections créées
    function getCollectionCount() external view returns (int) {
        return count;
    }


}
