const app = {

    // URL de l'API permettant de récupérer les datas Hearthstone
    apiUrl: "https://api.hearthstonejson.com/v1/190920/frFR/cards.collectible.json",
    data: null,
    cardUrl: "https://art.hearthstonejson.com/v1/render/latest/frFR/512x/",
    cardWidth: "135px",
    cardHeight: "200px",
    card1Selected: null,
    card2Selected: null,

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
        let shuffledCards = cardSet;
        console.log(shuffledCards);

        // On créé une grille 3x6
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

        grid.forEach((row, rowIndex) => {
            let rowElement = document.createElement('div');
            rowElement.classList.add('row');
            row.forEach((card, colIndex) => {
                let cardElement = document.createElement('img');
                cardElement.classList.add('card');
                cardElement.setAttribute("id", `${rowIndex}-${colIndex}`);
                // cardElement.setAttribute("id", card.id);
                cardElement.setAttribute("src", this.cardUrl + card.id + ".png");
                cardElement.setAttribute("width", this.cardWidth);
                cardElement.setAttribute("height", this.cardHeight);
                cardElement.addEventListener("click", (event) => this.handleClickCard(event));
                rowElement.appendChild(cardElement);
            });
            memory.appendChild(rowElement);
        });

        setTimeout(this.hideCards, 2000);
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

    /**
     * Fonction qui permet de vérifier si deux cartes retournées sont identiques (via URL)
     * @param {click} event 
     */
    handleClickCard: function (event) {
        const currentCard = event.currentTarget;
        console.log(currentCard);

        // Vérifier si la carte cliquée est retournée vers le bas (face cachée)
        if (currentCard.src.includes("cardback")) {
            // Vérifier si aucune carte n'est actuellement sélectionnée
            if (!this.card1Selected) {
                this.card1Selected = currentCard;

                let coords = this.card1Selected.id.split("-"); //"0-1" -> ["0", "1"]
                let r = parseInt(coords[0]);
                let c = parseInt(coords[1]);

                // Trouver l'ID de la carte correspondante dans cardSet
                let cardId = cardSet[r * 6 + c].id;
                let cardImageUrl = this.cardUrl + cardId + ".png";

                this.card1Selected.src = cardImageUrl;
                console.log(this.card1Selected.src);
            } else if (!this.card2Selected && currentCard !== this.card1Selected) {
                this.card2Selected = currentCard;

                let coords = this.card2Selected.id.split("-"); //"0-1" -> ["0", "1"]
                let r = parseInt(coords[0]);
                let c = parseInt(coords[1]);

                // Trouver l'ID de la carte correspondante dans cardSet
                let cardId = cardSet[r * 6 + c].id;
                let cardImageUrl = this.cardUrl + cardId + ".png";

                this.card2Selected.src = cardImageUrl;
                console.log(this.card2Selected.src);
                setTimeout(() => {
                    this.update();
                }, 1000);
            }
        }
    },

    /**
     * Fonction qui retourne deux cartes qui ne sont pas identiques
     */
    update: function () {
        // Si deux cartes n'ont pas la même URL, elles sont retournées
        if (this.card1Selected.src != this.card2Selected.src) {
            this.card1Selected.src = "images/cardback_0.png";
            this.card2Selected.src = "images/cardback_0.png";
            // errors += 1;
            // document.getElementById("errors").innerText = errors;
        }

        // Réinitialisation
        this.card1Selected = null;
        this.card2Selected = null;
    }
}

document.addEventListener('DOMContentLoaded', () => app.init());
