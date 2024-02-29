const app = {

    // URL de l'API permettant de récupérer les datas Hearthstone
    apiUrl: "https://api.hearthstonejson.com/v1/190920/frFR/cards.collectible.json",
    data: null,
    cardUrl: "https://art.hearthstonejson.com/v1/render/latest/frFR/512x/",
    cardWidth: "auto",
    cardHeight: "20vh",
    card1Selected: null,
    card2Selected: null,
    timerInterval: null,
    pairsFound: 0,
    currentCardback: this.currentCardback = "images/cardback_" + Math.floor(Math.random() * 4) + ".png",

    init: async function () {
        console.log('app.init()');

        this.data = await this.getData();
        console.log(this.data);

        // const test = this.filterCards("THE_SUNKEN_CITY");

        const playButton = document.querySelector(".playButton");
        playButton.addEventListener("click", (event) => this.handlePlayGame(event));
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
     * Fonction qui permet de lancer une partie
     * @param {*} event 
     */
    handlePlayGame: function (event) {
        const data = document.querySelector(".data");
        data.classList.remove("hidden");
        const playButton = document.querySelector(".playButton");
        playButton.classList.add("hidden");
        const memory = document.querySelector(".memory");
        memory.classList.remove("hidden");

        // Obtenir de nouvelles cartes aléatoires
        const randomCards = this.selectRandomCards(9);

        // Mélanger les cartes
        const shuffledCards = this.shuffleCards(randomCards);

        this.startGame(shuffledCards);
        this.startTimer();
        console.log(playButton);
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
                cardElement.setAttribute("src", this.cardUrl + card.id + ".png");
                cardElement.style.width = this.cardWidth;
                cardElement.style.height = this.cardHeight;
                cardElement.addEventListener("click", (event) => this.handleClickCard(event));
                rowElement.appendChild(cardElement);
            });
            memory.appendChild(rowElement);
        });

        setTimeout(this.hideCards, 5500);
    },

    /**
     * Fonction qui met fin à la partie et affiche le score
     */
    endGame: function () {
        this.stopTimer();
        const memory = document.querySelector(".memory");
        memory.classList.add("hidden");

        // On supprime toutes les lignes de la mémoire
        while (memory.firstChild) {
            memory.removeChild(memory.firstChild);
        }

        const data = document.querySelector(".data");
        data.classList.add("hidden");
        const score = document.querySelector(".score");
        score.classList.remove("hidden");
        const newGame = document.querySelector(".newGame");
        newGame.classList.remove("hidden");
        newGame.addEventListener("click", (event) => this.handleNewGame(event));

        // Mettre à jour les statistiques
        const finalTime = document.querySelector(".finalTime");
        const finalErrors = document.querySelector(".finalErrors");

        finalTime.textContent = `${document.querySelector('.timerValue').innerText}`;
        finalErrors.textContent = `${document.querySelector('.errorsValue').innerText}`;

        // Réinitialiser les scores
        document.querySelector(".errorsValue").innerText = "0";
        document.querySelector(".timerValue").innerText = "0 sec";
        this.pairsFound = 0;
    },

    /**
     * Fonction pour revenir à l'écran d'accueil depuis l'écran des scores
     */
    handleNewGame: function () {
        console.log("Coucou !");
        const score = document.querySelector(".score");
        score.classList.add("hidden");
        const newGame = document.querySelector(".newGame");
        newGame.classList.add("hidden");
        const playButton = document.querySelector(".playButton");
        playButton.classList.remove("hidden");
    },

    /**
     * Fonction qui lance le timer
     */
    startTimer: function () {
        let seconds = 0;
        const timerElement = document.querySelector('.timerValue');
        this.timerInterval = setInterval(() => {
            seconds++;
            timerElement.innerText = `${seconds} sec`;
        }, 1000);
    },

    /**
     * Fonction qui stoppe le timer
     */
    stopTimer: function () {
        clearInterval(this.timerInterval);
    },

    /**
     * Fonction qui retourne les cartes en début de partie
     */
    hideCards: function () {
        let cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.setAttribute("src", this.currentCardback);
            console.log(this.currentCardback);
            card.style.width = this.cardWidth;
            card.style.height = this.cardHeight;
        });
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
     * Fonction qui sélectionne un nombre donné de cartes au hasard parmi les données récupérées
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
                    this.checkPairs();
                }, 1000);
            }
        }
    },

    /**
     * Fonction qui retourne deux cartes qui ne sont pas identiques
     */
    checkPairs: function () {

        // Si deux cartes n'ont pas la même URL, elles sont retournées
        if (this.card1Selected.src === this.card2Selected.src) {
            // On incrémente les paires
            this.pairsFound++;
            if (this.pairsFound === 9) {
                this.endGame();
            }
        } else {
            this.card1Selected.src = this.currentCardback;
            this.card2Selected.src = this.currentCardback;
            errors = parseInt(document.querySelector(".errorsValue").innerText);
            errors += 1;
            document.querySelector(".errorsValue").innerText = errors;
        }

        // Réinitialisation
        this.card1Selected = null;
        this.card2Selected = null;
    }
}

document.addEventListener('DOMContentLoaded', () => app.init());
