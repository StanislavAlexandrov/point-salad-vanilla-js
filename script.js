document.addEventListener('DOMContentLoaded', function () {
    let selectedVegetables = [];

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

        if (cardElement.textContent === cardData.condition) {
            // Handle the scoring condition card
            console.log(`Kept scoring condition: ${cardData.condition}`);
            const newCard = shuffledCards.pop();
            const newCardElement = createCard(newCard.condition, newCard);
            board.replaceChild(newCardElement, cardElement);
        } else {
            // Handle the vegetable cards
            selectedVegetables.push({ cardElement, columnIndex });
            cardElement.style.color = 'green';

            if (selectedVegetables.length === 2) {
                // Process the picked vegetables
                console.log(
                    `Kept vegetables: ${selectedVegetables
                        .map(
                            (selected) =>
                                JSON.parse(selected.cardElement.dataset.info)
                                    .vegetable
                        )
                        .join(', ')}`
                );

                // Replace the picked vegetable cards with flipped top-row cards
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
            }
        }
    }
});
