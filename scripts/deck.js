// ========================================
// ORACLE DECK SYSTEM
// ========================================

// --- Translation Helper ---
function tr(key, fallback) {
    if (typeof t === 'function') {
        const translated = t(key);
        if (translated && translated !== key) return translated;
    }
    return fallback;
}

// --- Card Data ---
const suits = ['H', 'D', 'C', 'S']; // Hearts, Diamonds, Clubs, Spades
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suitSymbols = { H: '♥', D: '♦', C: '♣', S: '♠' };
function getSuitNames() {
    return {
        H: tr('card.hearts', 'Copas'),
        D: tr('card.diamonds', 'Ouros'),
        C: tr('card.clubs', 'Paus'),
        S: tr('card.spades', 'Espadas')
    };
}
const cardValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
const faceCards = ['J', 'Q', 'K'];
function getRankNames() {
    return {
        'J': tr('card.jack', 'Valete'),
        'Q': tr('card.queen', 'Dama'),
        'K': tr('card.king', 'Rei'),
        'A': tr('card.ace', 'Ás')
    };
}

// --- Deck State ---
let deck = [];
let discardPile = [];
let displayedCards = [];
let decidingCardIndex = -1; // Index of the "winning" card in displayedCards (-1 means no distinction)

// --- Fisher-Yates Shuffle ---
function shuffleDeck(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// --- Create a fresh 52-card deck ---
function createDeck() {
    const newDeck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            newDeck.push({ rank, suit });
        }
    }
    return newDeck;
}

// --- Initialize Deck ---
function initializeDeck() {
    deck = shuffleDeck(createDeck());
    discardPile = [];
    displayedCards = [];
    updatePileCounters();
    updateDeckContainerTitle(tr('deck.oracleDeck', 'Baralho Oráculo'));
}

// --- Draw Cards ---
function drawCards(count) {
    // Move displayed cards to discard first
    discardDisplayedCards();

    const drawn = [];
    for (let i = 0; i < count && deck.length > 0; i++) {
        drawn.push(deck.pop());
    }
    displayedCards = drawn;
    updatePileCounters();
    renderDisplayedCards();
    return drawn;
}

// --- Discard Displayed Cards ---
function discardDisplayedCards() {
    if (displayedCards.length > 0) {
        discardPile.push(...displayedCards);
        displayedCards = [];
    }
}

// --- Reset (Shuffle) Deck ---
function resetDeck() {
    // Combine discard + displayed + remaining deck
    const allCards = [...deck, ...discardPile, ...displayedCards];
    deck = shuffleDeck(allCards);
    discardPile = [];
    displayedCards = [];
    updatePileCounters();
    renderDisplayedCards();
    updateDeckContainerTitle(tr('deck.oracleDeck', 'Baralho Oráculo'));
    showOracleMessage(tr('deck.shuffled', 'Baralho embaralhado!'));
}

// --- Update Pile Counters ---
function updatePileCounters() {
    const deckCountEl = document.getElementById('deck-count');
    const discardCountEl = document.getElementById('discard-count');
    const deckCountContainerEl = document.getElementById('deck-count-container');
    const discardCountContainerEl = document.getElementById('discard-count-container');

    if (deckCountEl) deckCountEl.textContent = deck.length;
    if (discardCountEl) discardCountEl.textContent = discardPile.length;
    if (deckCountContainerEl) deckCountContainerEl.textContent = deck.length;
    if (discardCountContainerEl) discardCountContainerEl.textContent = discardPile.length;
}

// --- Update Deck Container Title ---
function updateDeckContainerTitle(message) {
    const titleEl = document.getElementById('deck-container-title');
    if (titleEl) {
        titleEl.textContent = message;
    }
}

// --- Get Card Display Name ---
function getCardDisplayName(card) {
    const rankName = getRankNames()[card.rank] || card.rank;
    const suitName = getSuitNames()[card.suit];
    return `${rankName} ${tr('card.of', 'de')} ${suitName}`;
}

// --- Get Oracle Message for Single Card ---
function getOracleMessage(card) {
    const value = cardValues[card.rank];
    const isPositiveSuit = card.suit === 'H' || card.suit === 'D'; // Hearts or Diamonds
    const isFace = faceCards.includes(card.rank);
    const isAce = card.rank === 'A';

    if (isPositiveSuit) {
        if (value <= 3) {
            return tr('oracle.maybeUnclear', 'Talvez, mas o resultado não é claro');
        } else if (value <= 10) {
            return tr('oracle.yesDefinitive', 'Sim (números mais altos são mais definitivos)');
        } else if (isFace) {
            return tr('oracle.yesComplication', 'Sim, mas com alguma complicação');
        } else if (isAce) {
            return tr('oracle.yesExceptional', 'Sim Excepcional');
        }
    } else {
        // Clubs or Spades
        if (value <= 3) {
            return tr('oracle.maybeUnclear', 'Talvez, mas o resultado não é claro');
        } else if (value <= 10) {
            return tr('oracle.noDefinitive', 'Não (números mais altos são mais definitivos)');
        } else if (isFace) {
            return tr('oracle.noComplication', 'Não, e com alguma complicação');
        } else if (isAce) {
            return tr('oracle.noExceptional', 'Não Excepcional');
        }
    }
    return '';
}

// --- Oracle 50/50 ---
function oracle5050() {
    if (deck.length < 1) {
        showOracleMessage(tr('deck.empty', 'Baralho vazio! Embaralhe para continuar.'));
        return;
    }
    decidingCardIndex = -1; // Single card, no distinction needed
    const cards = drawCards(1);
    const message = getOracleMessage(cards[0]);
    const cardName = getCardDisplayName(cards[0]);
    showOracleMessage(`${cardName}: ${message}`);
    updateDeckContainerTitle(message);
}

// --- Oracle Provável (favor positive) ---
function oracleProvavel() {
    if (deck.length < 2) {
        showOracleMessage(tr('deck.notEnough', 'Cartas insuficientes! Embaralhe para continuar.'));
        return;
    }
    const cards = drawCards(2);

    // Separate by suit type
    const positive = cards.filter(c => c.suit === 'H' || c.suit === 'D');
    const negative = cards.filter(c => c.suit === 'C' || c.suit === 'S');

    let decidingCard;
    if (positive.length > 0) {
        // Pick highest value positive card
        decidingCard = positive.reduce((a, b) => cardValues[a.rank] > cardValues[b.rank] ? a : b);
    } else {
        // Both negative, pick lowest value
        decidingCard = negative.reduce((a, b) => cardValues[a.rank] < cardValues[b.rank] ? a : b);
    }

    // Find index of deciding card in displayedCards
    decidingCardIndex = displayedCards.findIndex(c => c.rank === decidingCard.rank && c.suit === decidingCard.suit);
    renderDisplayedCards(); // Re-render with fading

    const message = getOracleMessage(decidingCard);
    const cardName = getCardDisplayName(decidingCard);
    showOracleMessage(`${cardName}: ${message}`);
    updateDeckContainerTitle(message);
}

// --- Oracle Improvável (favor negative) ---
function oracleImprovavel() {
    if (deck.length < 2) {
        showOracleMessage(tr('deck.notEnough', 'Cartas insuficientes! Embaralhe para continuar.'));
        return;
    }
    const cards = drawCards(2);

    // Separate by suit type
    const positive = cards.filter(c => c.suit === 'H' || c.suit === 'D');
    const negative = cards.filter(c => c.suit === 'C' || c.suit === 'S');

    let decidingCard;
    if (negative.length > 0) {
        // Pick highest value negative card
        decidingCard = negative.reduce((a, b) => cardValues[a.rank] > cardValues[b.rank] ? a : b);
    } else {
        // Both positive, pick lowest value
        decidingCard = positive.reduce((a, b) => cardValues[a.rank] < cardValues[b.rank] ? a : b);
    }

    // Find index of deciding card in displayedCards
    decidingCardIndex = displayedCards.findIndex(c => c.rank === decidingCard.rank && c.suit === decidingCard.suit);
    renderDisplayedCards(); // Re-render with fading

    const message = getOracleMessage(decidingCard);
    const cardName = getCardDisplayName(decidingCard);
    showOracleMessage(`${cardName}: ${message}`);
    updateDeckContainerTitle(message);
}

// --- Draw without message ---
function drawOnly(count) {
    if (deck.length < count) {
        showOracleMessage(tr('deck.remaining', 'Cartas insuficientes! Restam {0} cartas.').replace('{0}', deck.length));
        return;
    }
    decidingCardIndex = -1; // No deciding card for simple draws
    drawCards(count);
    const names = displayedCards.map(getCardDisplayName).join(', ');
    showOracleMessage(names);
    updateDeckContainerTitle(tr('deck.oracleDeck', 'Baralho Oráculo'));
}

// --- Show Oracle Message ---
function showOracleMessage(message) {
    const msgEl = document.getElementById('oracle-message');
    if (msgEl) {
        msgEl.textContent = message;
        msgEl.classList.add('show');
        setTimeout(() => msgEl.classList.remove('show'), 100);
    }
}

// --- Render Displayed Cards ---
function renderDisplayedCards() {
    const container = document.getElementById('displayed-cards');
    if (!container) return;

    container.innerHTML = '';

    displayedCards.forEach((card, index) => {
        const cardEl = createCardElement(card);
        cardEl.style.animationDelay = `${index * 0.1}s`;
        cardEl.classList.add('card-draw-animation');

        // Fade non-deciding cards when there are multiple cards and a deciding card is set
        if (displayedCards.length > 1 && decidingCardIndex !== -1 && index !== decidingCardIndex) {
            cardEl.classList.add('card-faded');
        }

        container.appendChild(cardEl);
    });

    // Also update container preview
    renderContainerPreview();
}

// --- Render Container Preview (last drawn card) ---
function renderContainerPreview() {
    const previewEl = document.getElementById('deck-card-preview');
    if (!previewEl) return;

    if (displayedCards.length > 0) {
        const lastCard = displayedCards[displayedCards.length - 1];
        previewEl.innerHTML = '';
        const cardEl = createCardElement(lastCard, true);
        previewEl.appendChild(cardEl);
    } else {
        previewEl.innerHTML = '<div class="card-back card-mini"><img src="img/icons/other/cardback.svg" alt=""></div>';
    }
}

// --- Create Card Element ---
function createCardElement(card, mini = false) {
    const div = document.createElement('div');
    div.className = `playing-card ${mini ? 'card-mini' : ''}`;

    const isRed = card.suit === 'H' || card.suit === 'D';
    div.classList.add(isRed ? 'card-red' : 'card-black');

    const symbol = suitSymbols[card.suit];
    const rank = card.rank;

    div.innerHTML = `
        <div class="card-corner card-top-left">
            <span class="card-rank">${rank}</span>
            <span class="card-suit">${symbol}</span>
        </div>
        <div class="card-center">
            <span class="card-suit-large">${symbol}</span>
        </div>
        <div class="card-corner card-bottom-right">
            <span class="card-rank">${rank}</span>
            <span class="card-suit">${symbol}</span>
        </div>
    `;

    return div;
}

// --- Setup Modal Handlers ---
function setupDeckModal() {
    const modal = document.getElementById('deck-modal');
    const container = document.getElementById('deck-container');
    const closeBtn = modal ? modal.querySelector('.close-button') : null;

    if (container) {
        container.addEventListener('click', () => {
            if (modal) modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Button handlers
    const btn5050 = document.getElementById('btn-oracle-5050');
    const btnProvavel = document.getElementById('btn-oracle-provavel');
    const btnImprovavel = document.getElementById('btn-oracle-improvavel');
    const btnShuffle = document.getElementById('btn-deck-shuffle');
    const btnDraw1 = document.getElementById('btn-draw-1');
    const btnDraw2 = document.getElementById('btn-draw-2');

    if (btn5050) btn5050.addEventListener('click', oracle5050);
    if (btnProvavel) btnProvavel.addEventListener('click', oracleProvavel);
    if (btnImprovavel) btnImprovavel.addEventListener('click', oracleImprovavel);
    if (btnShuffle) btnShuffle.addEventListener('click', resetDeck);
    if (btnDraw1) btnDraw1.addEventListener('click', () => drawOnly(1));
    if (btnDraw2) btnDraw2.addEventListener('click', () => drawOnly(2));
}

// --- Initialize on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    initializeDeck();
    setupDeckModal();
    renderContainerPreview();
});

// --- Hook into initial start button ---
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn-initial-start');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            initializeDeck();
        });
    }

    const startGameBtn = document.getElementById('btn-start-game');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            initializeDeck();
        });
    }
});

// --- Export/Import Deck State for Save System ---
function getDeckState() {
    return {
        deck: [...deck],
        discardPile: [...discardPile],
        displayedCards: [...displayedCards]
    };
}

function restoreDeckState(state) {
    if (!state) return;

    deck = state.deck || [];
    discardPile = state.discardPile || [];
    displayedCards = state.displayedCards || [];

    updatePileCounters();
    renderDisplayedCards();
    updateDeckContainerTitle(tr('deck.oracleDeck', 'Baralho Oráculo'));
}

