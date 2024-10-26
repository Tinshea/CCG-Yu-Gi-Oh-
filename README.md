# Yu-Gi-Oh! Trading Card Game

Bienvenue dans notre application décentralisée (DApp) de jeu de cartes à collectionner inspirée de l'univers Yu-Gi-Oh! ! Ce projet combine les aspects classiques du jeu de cartes à collectionner avec les technologies blockchain, permettant aux utilisateurs de posséder, échanger et collectionner des cartes sous forme de NFT (ERC-721).

Notre DApp offre des fonctionnalités de minting, de gestion de collection, d'achat de boosters, et d'échange de cartes entre joueurs. Grâce à l'intégration de la blockchain Ethereum et de contrats intelligents, chaque carte est unique et peut être véritablement possédée et échangée entre utilisateurs.

# Installation

```bash
# Avec HTTPS
git clone https://github.com/Tinshea/CCG-Yu-Gi-Oh-.git
# Avec SSH
git clone git@github.com:Tinshea/CCG-Yu-Gi-Oh-.git
```

## Configurations
- `HardHat` : Pour gérer et déployer les contrats Solidity.
- `Metamask` : Pour interagir avec la blockchain Ethereum. Pour permettre la connexion à notre environnement local, un réseau Hardhat doit être ajouté dans Metamask avec l'URL RPC `http://localhost:8545` et le Chain ID `31337`.
- `Node.js` ainsi que `NPM ou Yarn` : Pour la gestion des dépendances du frontend et son lancement.

Installez les dépendances.

```bash
# Pour les utilisateurs de Yarn
yarn

# Pour les utilisateurs de NPM
npm install
```

Exécutez le projet.

```bash
# Pour les utilisateurs de Yarn
yarn dev

# Pour les utilisateurs de NPM
npm run dev
```

Vous pouvez maintenant visualiser le projet à l'adresse suivante : `http://localhost:8545`.
Le `owner` par défaut est l'account 0.

## Fonctionnalités des Pages

- **Market** : Dans cette section, les joueurs peuvent acheter et vendre des cartes avec d’autres utilisateurs. C’est l’endroit idéal pour obtenir des cartes rares ou simplement améliorer sa collection en achetant des cartes mises en vente par d'autres joueurs.

- **Booster** : Cette page permet aux joueurs d’acheter des boosters pour obtenir des cartes aléatoires. Elle ajoute une dimension de surprise, car certains types de cartes, indisponibles sur le marché ou dans la collection, peuvent uniquement être obtenus via des boosters.

- **Collection** : Affiche l’ensemble des cartes disponibles dans le jeu. Les utilisateurs peuvent explorer les cartes disponibles, découvrir leurs caractéristiques uniques, et en savoir plus sur les types de cartes présents dans le jeu.

- **Profil** : La page de profil permet aux joueurs de consulter leur collection personnelle, les cartes qu'ils possèdent et leurs statistiques. Ils peuvent également y voir leur historique de transactions et ajuster les paramètres de leur compte.



## Important ;  Metamask

Si vous rencontrez des erreurs lors de l'utilisation de Metamask, il peut être utile de vider le cache de l'extension. Cela permet de résoudre les problèmes liés aux données temporaires qui peuvent parfois interférer avec le bon fonctionnement des transactions ou la connexion au réseau local. Pour vider le cache, accédez aux paramètres de Metamask, recherchez l'option de réinitialisation de l'état du compte, puis confirmez l'opération. Cette action ne supprimera pas vos comptes, mais réinitialisera seulement les données de session de Metamask.
