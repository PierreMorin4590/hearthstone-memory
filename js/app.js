const app = {

    // URL de l'API permettant de récupérer les datas Hearthstone
    apiUrl: "https://api.hearthstonejson.com/v1/190920/frFR/cards.collectible.json",
    data: null,
    cardUrl: "https://art.hearthstonejson.com/v1/render/latest/frFR/512x/",
    cardWidth: "135px",
    cardHeight: "200px",

    init: async function () {
        console.log('app.init()');

        this.data = await this.getData();
        console.log(this.data);

        // const test = this.filterCards("THE_SUNKEN_CITY");

        const randomCards = this.selectRandomCards(9);
        console.log(randomCards);

        this.shuffleCards(randomCards); //return cardSet

        const test = this.startGame(randomCards);
        console.log(test);

    },

    /**
     * Fonction qui double puis mélange les cartes
     * @param {array} cardSelected : Tableau qui passe les cartes qu'on veut mélanger
     * @returns {array} cardeSet : Tableau avec les cartes mélangées (index random)
     */
    shuffleCards: function (cardSelected) {
        // On double chaque carte 
        cardSet = cardSelected.concat(cardSelected);

        for (let i = 0; i < cardSet.length; i++) {
            // On randomise l'index
            let j = Math.floor(Math.random() * cardSet.length);
            // On mélange
            let temp = cardSet[i];
            cardSet[i] = cardSet[j];
            cardSet[j] = temp;
        }

        console.log(cardSet);
        return cardSet;
    },

    /**
     * Fonction qui lance le jeu
     * @param {array} cardSelected : Tableau qui passe les cartes
     */
    startGame: function (cardSelected) {
        let grid = []; // variable pour stocker la grille de jeu
        let cardList = cardSelected;

        // On mélange les cartes
        let shuffledCards = this.shuffleCards(cardList);
        console.log(shuffledCards);

        // On créé une grille 4x4
        for (let row = 0; row < 3; row++) {
            let newRow = []; // Créer une nouvelle ligne
            for (let col = 0; col < 6; col++) {
                let index = row * 6 + col;
                newRow.push(shuffledCards[index]); // Ajouter la carte mélangée à la ligne
            }
            grid.push(newRow); // Ajouter la ligne à la grille
        }
        console.log(grid);

        // On génère la grille de départ
        const memory = document.querySelector('.memory');

        grid.forEach(row => {
            let rowElement = document.createElement('div');
            rowElement.classList.add('row');
            row.forEach(card => {
                let cardElement = document.createElement('img');
                cardElement.classList.add('card');
                cardElement.setAttribute("id", card.id);
                cardElement.setAttribute("src", this.cardUrl + card.id + ".png");
                cardElement.setAttribute("width", this.cardWidth);
                cardElement.setAttribute("height", this.cardHeight);
                rowElement.appendChild(cardElement);
            });
            memory.appendChild(rowElement);
        });

        setTimeout(this.hideCards, 5000);
    },

    /**
     * Fonction qui retourne les cartes en début de partie
     */
    hideCards: function () {
        let cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.setAttribute("src", "images/cardback_0.png");
            card.style.width = this.cardWidth;
            card.style.heigth = this.cardHeight;
        });
    },

    /**
     * Fonction asynchrone qui récupère les données de l'API HearthstoneJSON api.hearthstonejson.com/v1/ 
     * @returns {array} apiHearthstone : Tableau avec toutes les cartes Hearthstone ever <3
     */
    getData: async function () {
        try {
            // fetch retourne une promesse (objet)
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch : ${response.status}`);
            }

            // On attend la résolution de la promesse et on récupère les données
            const apiHearthstone = await response.json();

            return apiHearthstone;

        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Fonction qui permet de filtrer les cartes
     * @param {string} filter : Nom du paramètre à filtrer
     * @returns {array} cardsFiltered : Tableau avec les cartes filtrées
     */
    filterCards: function (filter) {
        const cardsFiltered = this.data.filter(card => card.filter === filter);
        console.log(cardsFiltered);

        return cardsFiltered;
    },

    /**
     * SFonction qui sélectionne un nombre donné de cartes au hasard parmi les données récupérées
     * @param {number} count : Nombre de cartes à sélectionner
     * @returns {array} randomCards : Tableau des cartes sélectionnées
     */
    selectRandomCards: function (count) {
        const randomCards = [];
        const totalCards = this.data.length;

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * totalCards);
            randomCards.push(this.data[randomIndex]);
        }

        return randomCards;
    },
}

document.addEventListener('DOMContentLoaded', () => app.init());
