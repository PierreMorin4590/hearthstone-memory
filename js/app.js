const app = {

    // URL de l'API permettant de récupérer les datas Hearthstone
    apiUrl: "https://api.hearthstonejson.com/v1/190920/frFR/cards.collectible.json",
    data: null,
    cardUrl: "https://art.hearthstonejson.com/v1/render/latest/frFR/512x/", 

    init: async function () {
        console.log('app.init()');

        const memory = document.querySelector('.memory');
        console.log(memory);

        this.data = await this.getData();
        console.log(this.data);

        const test = this.filterCards("THE_SUNKEN_CITY");
        console.log(test);
        
        const randomCards = this.selectRandomCards(20);
        console.log(randomCards);

        randomCards.forEach((card) => this.addTile(memory, card.id));
    },

    addTile: async function (element, id) {
        const card = document.createElement("img");
        card.setAttribute("src", this.cardUrl+id+".png");
        card.setAttribute("width", "150px");
        element.appendChild(card);


    },

    /**
     * Fonction asynchrone qui récupère les données de l'API HearthstoneJSON api.hearthstonejson.com/v1/ 
     * @returns 
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
     * Filtrer les cartes par ensemble (set)
     * @param {string} set Nom de l'ensemble à filtrer
     */
    filterCards: function (filter) {
        const cardsFiltered = this.data.filter(card => card.filter === filter);
        console.log(cardsFiltered);
        return cardsFiltered;
    },

    /**
     * Sélectionner un nombre donné de cartes au hasard parmi les données récupérées
     * @param {number} count Nombre de cartes à sélectionner
     * @returns {Array} Tableau des cartes sélectionnées
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
