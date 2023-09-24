document.addEventListener('DOMContentLoaded', function () {
    let selectedVegetables = [];

    const player1 = {
        name: 'Player 1',
        conditions: [],
        vegetables: {
            carrots: 0,
            cabbage: 0,
            peppers: 0,
            tomatoes: 0,
            lettuce: 0,
            onions: 0,
        },
    };

    const player2 = {
        name: 'Player 2',
        conditions: [],
        vegetables: {
            carrots: 0,
            cabbage: 0,
            peppers: 0,
            tomatoes: 0,
            lettuce: 0,
            onions: 0,
        },
    };
    let currentPlayer = player1;

    const player1DisplayElement = document.getElementById('player1Display');
    updatePlayerDisplay(player1, player1DisplayElement);
    const player2DisplayElement = document.getElementById('player2Display');
    updatePlayerDisplay(player2, player2DisplayElement);

    const doubleSidedCards = [
        { vegetable: 'carrots', condition: '2 lettuces = 5 points' },
        { vegetable: 'carrots', condition: '3 peppers = 8 points' },
        {
            vegetable: 'carrots',
            condition:
                'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points',
        },
        { vegetable: 'cabbage', condition: '2 lettuces = 5 points' },
        { vegetable: 'cabbage', condition: '3 peppers = 8 points' },
        {
            vegetable: 'cabbage',
            condition:
                'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points',
        },
        { vegetable: 'peppers', condition: '2 lettuces = 5 points' },
        { vegetable: 'peppers', condition: '3 peppers = 8 points' },
        {
            vegetable: 'peppers',
            condition:
                'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points',
        },
        { vegetable: 'tomatoes', condition: '2 lettuces = 5 points' },
        { vegetable: 'tomatoes', condition: '3 peppers = 8 points' },
        {
            vegetable: 'tomatoes',
            condition:
                'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points',
        },
        { vegetable: 'lettuce', condition: '2 lettuces = 5 points' },
        { vegetable: 'lettuce', condition: '3 peppers = 8 points' },
        {
            vegetable: 'lettuce',
            condition:
                'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points',
        },
        { vegetable: 'onions', condition: '2 lettuces = 5 points' },
        { vegetable: 'onions', condition: '3 peppers = 8 points' },
        {
            vegetable: 'onions',
            condition:
                'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points',
        },
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledCards = shuffle(doubleSidedCards.slice());
    const board = document.getElementById('board');
    // Initialize the first row with condition sides facing up
    for (let i = 0; i < 3; i++) {
        const cardElement = createCard(
            shuffledCards[i].condition,
            shuffledCards[i]
        );
        board.appendChild(cardElement);
    }

    // Initialize the second and third rows with vegetable sides facing up
    for (let i = 3; i < 9; i++) {
        const cardElement = createCard(
            shuffledCards[i].vegetable,
            shuffledCards[i]
        );
        board.appendChild(cardElement);
    }

    function createCard(face, cardData) {
        const cardElement = document.createElement('div');
        cardElement.textContent = face;
        cardElement.classList.add('card');
        cardElement.dataset.info = JSON.stringify(cardData);
        cardElement.addEventListener('click', handleCardClick);
        return cardElement;
    }

    function handleCardClick(event) {
        const cardElement = event.target;
        const cardData = JSON.parse(cardElement.dataset.info);
        const columnIndex = Array.from(board.children).indexOf(cardElement) % 3;

        let shouldSwitchPlayer = false;

        if (cardElement.textContent === cardData.condition) {
            // Handle the scoring condition card
            if (shuffledCards.length > 0) {
                const newCard = shuffledCards.pop();
                const newCardElement = createCard(newCard.condition, newCard);
                board.replaceChild(newCardElement, cardElement);
            } else {
                // Handle the situation when no cards are left, perhaps by removing the card or showing a message
                cardElement.remove();
            }
            // Add condition to player1 and update display
            currentPlayer.conditions.push(cardData.condition);
            shouldSwitchPlayer = true; // Set to true to switch the player after taking a condition card
        } else {
            // Handle the vegetable cards
            selectedVegetables.push({ cardElement, columnIndex });
            cardElement.style.color = 'green';

            if (selectedVegetables.length === 2) {
                shouldSwitchPlayer = true;
                // Add vegetables to player1
                selectedVegetables.forEach((selected) => {
                    const vegetable = JSON.parse(
                        selected.cardElement.dataset.info
                    ).vegetable;
                    currentPlayer.vegetables[vegetable]++;
                });
                // Process the picked vegetables
                selectedVegetables.forEach((selected) => {
                    const topRowCard = board.children[selected.columnIndex];
                    const topCardData = JSON.parse(topRowCard.dataset.info);
                    const newCardElement = createCard(
                        topCardData.vegetable,
                        topCardData
                    );
                    board.replaceChild(newCardElement, selected.cardElement);

                    // Update the top row with a new scoring condition card
                    const newTopCard = shuffledCards.pop();
                    const newTopCardElement = createCard(
                        newTopCard.condition,
                        newTopCard
                    );
                    board.replaceChild(newTopCardElement, topRowCard);
                });
                // Reset the selectedVegetables array
                selectedVegetables = [];
                // Switch turns

                shouldSwitchPlayer = true; // Set to true to switch the player after taking two vegetable cards
            }
        }
        // Update player display irrespective of whether a condition or vegetable was selected
        updatePlayerDisplay(
            currentPlayer,
            currentPlayer.name === 'Player 1'
                ? player1DisplayElement
                : player2DisplayElement
        );
        if (shouldSwitchPlayer) {
            // Player switching logic
            if (currentPlayer === player1) {
                currentPlayer = player2;
            } else {
                currentPlayer = player1;
            }
        }

        const activePlayerElement = document.getElementById(
            'activePlayerDisplay'
        );
        activePlayerElement.textContent = `ACTIVE PLAYER: ${currentPlayer.name}`;
    }

    function updateScoreDisplay() {
        const score = calculateScore(player); // Calculate the score
        const scoreElement = document.getElementById(
            player.name === 'Player 1' ? 'score1' : 'score2'
        );
        scoreElement.textContent = `${player.name} Score: ${score}`;
    }
    function updatePlayerDisplay(player, playerDisplayElement) {
        // Clear existing display
        playerDisplayElement.innerHTML = '';

        // Add title
        const title = document.createElement('h3');
        title.textContent = player.name;
        playerDisplayElement.appendChild(title);

        // Add conditions
        player.conditions.forEach((condition, index) => {
            const line = document.createElement('p');
            line.textContent = `Line ${index + 1}: ${condition}`;
            playerDisplayElement.appendChild(line);
        });

        // Add vegetables
        for (const [vegetable, count] of Object.entries(player.vegetables)) {
            const line = document.createElement('p');
            line.textContent = `${vegetable}: ${count}`;
            playerDisplayElement.appendChild(line);
        }

        const score = calculateScore(player);
        const scoreElement = document.getElementById(
            player.name === 'Player 1' ? 'score1' : 'score2'
        );
        scoreElement.textContent = `${player.name} Score: ${score}`;
    }
});

function calculateScore(player) {
    let score = 0;

    player.conditions.forEach((condition) => {
        if (condition === '2 lettuces = 5 points') {
            score += Math.floor(player.vegetables.lettuce / 2) * 5;
        }
        if (condition === '3 peppers = 8 points') {
            score += Math.floor(player.vegetables.peppers / 3) * 8;
        }
        if (
            condition ===
            'each cabbage 2 points and each tomato 2 points and each lettuce minus 4 points'
        ) {
            score += player.vegetables.cabbage * 2;
            score += player.vegetables.tomatoes * 2;
            score -= player.vegetables.lettuce * 4;
        }
    });

    return score;
}
