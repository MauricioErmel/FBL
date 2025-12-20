/**
 * Dice Roller for FBL Hexflower Companion
 * Implements a comprehensive dice rolling system for Forbidden Lands RPG
 */

// --- State Management ---
const diceRollerState = {
    // Dice amounts (persisted across modal close/open)
    atributoCount: 1,
    periciaCount: 0,
    equipamentoCount: 0,
    artifactDieType: 'none', // 'none', 'd8', 'd10', 'd12'

    // Modifiers
    selectedRollType: null, // 'desbravar', 'acampar', 'coletar', 'cacar'
    baseModifier: 0, // From quick roll selection
    customModifier: 0,

    // Roll state
    hasRolled: false,
    canForceRoll: false,
    hasForcedRoll: false,

    // Dice results (array of { value, type, isBonus, isNegative, isFaded })
    atributoDice: [],
    periciaDice: [],
    equipamentoDice: [],
    artifactDie: null, // { value, type, sides }

    // Results
    totalSuccesses: 0,
    atributoSkulls: 0,
    equipamentoSkulls: 0
};

// --- Utility Functions ---

/**
 * Roll a single die using crypto.getRandomValues()
 * @param {number} sides - Number of sides on the die
 * @returns {number} - Roll result (1 to sides)
 */
function rollDie(sides = 6) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % sides) + 1;
}

/**
 * Roll multiple dice
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides per die
 * @returns {number[]} - Array of results
 */
function rollDice(count, sides = 6) {
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push(rollDie(sides));
    }
    return results;
}

/**
 * Get modifier from currentModifiers global (from script.js)
 * @param {string} type - 'desbravar', 'acampar', 'coletar', 'cacar'
 * @returns {number} - The modifier value
 */
function getModifierFromGame(type) {
    if (typeof currentModifiers === 'undefined') return 0;

    switch (type) {
        case 'desbravar':
            return currentModifiers.desbravar?.total || 0;
        case 'acampar':
            return currentModifiers.acampar?.total || 0;
        case 'coletar':
            if (!currentModifiers.coletar?.permitido) return -999; // Not allowed
            return currentModifiers.coletar?.total || 0;
        case 'cacar':
            if (!currentModifiers.cacar?.permitido) return -999; // Not allowed
            return currentModifiers.cacar?.total || 0;
        default:
            return 0;
    }
}

/**
 * Calculate successes from artifact die result
 * @param {number} value - Die result
 * @returns {number} - Number of successes
 */
function getArtifactSuccesses(value) {
    if (value >= 12) return 4;
    if (value >= 10) return 3;
    if (value >= 8) return 2;
    if (value >= 6) return 1;
    return 0;
}

// --- DOM References ---
let modal, rollerContainer;
let diceAmountAtrib, diceAmountSkill, diceAmountEquip;
let atributoDiceDisplay, periciaDiceDisplay, equipamentoDiceDisplay;
let artifactDieTypeSelect;
let customModifierInput;
let btnRollDice, btnForceRoll;
let successCountEl, atributoSkullCountEl, equipamentoSkullCountEl;
let skullResultsContainer;
let appliedModifierValueEl;

function initDOMReferences() {
    modal = document.getElementById('dice-roller-modal');
    rollerContainer = document.getElementById('roller-container');

    diceAmountAtrib = document.getElementById('diceAmountAtrib');
    diceAmountSkill = document.getElementById('diceAmountSkill');
    diceAmountEquip = document.getElementById('diceAmountEquip');

    atributoDiceDisplay = document.getElementById('atributo-dice-display');
    periciaDiceDisplay = document.getElementById('pericia-dice-display');
    equipamentoDiceDisplay = document.getElementById('equipamento-dice-display');

    artifactDieTypeSelect = document.getElementById('artifact-die-type');
    customModifierInput = document.getElementById('custom-modifier');

    btnRollDice = document.getElementById('btn-roll-dice');
    btnForceRoll = document.getElementById('btn-force-roll');

    successCountEl = document.getElementById('success-count');
    atributoSkullCountEl = document.getElementById('atributo-skull-count');
    equipamentoSkullCountEl = document.getElementById('equipamento-skull-count');
    skullResultsContainer = document.getElementById('skull-results');

    appliedModifierValueEl = document.getElementById('applied-modifier-value');
}

// --- UI Update Functions ---

/**
 * Update the total modifier display
 */
function updateModifierDisplay() {
    const total = diceRollerState.baseModifier + diceRollerState.customModifier;
    const sign = total >= 0 ? '+' : '';
    if (appliedModifierValueEl) {
        appliedModifierValueEl.textContent = `${sign}${total}`;

        // Add/remove negative class based on value
        if (total < 0) {
            appliedModifierValueEl.classList.add('negative');
        } else {
            appliedModifierValueEl.classList.remove('negative');
        }
    }
}

/**
 * Create a die element
 * @param {string} type - 'atributo', 'pericia', 'equipamento', or 'artifact-dX'
 * @param {number|string} value - Die value to display
 * @param {object} options - Additional options (isBonus, isNegative, isFaded, isSuccess, isSkull)
 * @returns {HTMLElement}
 */
function createDieElement(type, value = '?', options = {}) {
    const die = document.createElement('div');
    die.className = `roller-die die-${type}`;

    // Special SVG-based shape for d8 (diamond/losango with rounded corners)
    if (type === 'artifact-d8') {
        // Create SVG diamond
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 50 50');
        svg.setAttribute('class', 'd8-svg');

        // Diamond path with rounded corners using quadratic curves
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Diamond shape: top, right, bottom, left with rounded corners
        path.setAttribute('d', 'M25,3 Q28,3 29,6 L46,22 Q49,25 46,28 L29,44 Q28,47 25,47 Q22,47 21,44 L4,28 Q1,25 4,22 L21,6 Q22,3 25,3 Z');
        path.setAttribute('fill', 'var(--col-btc-sec)');
        svg.appendChild(path);

        die.appendChild(svg);

        // Add content on top
        const content = document.createElement('span');
        content.className = 'die-content d8-content';

        if (value === 6 || value === 7) {
            // Single success icon for 6 and 7
            const img = document.createElement('img');
            img.className = 'die-success-icon';
            img.src = 'img/icons/other/success2.svg';
            img.alt = String(value);
            content.appendChild(img);
        } else if (value === 8) {
            // Two smaller success icons for 8
            for (let i = 0; i < 2; i++) {
                const img = document.createElement('img');
                img.className = 'die-success-icon die-success-icon-small';
                img.src = 'img/icons/other/success2.svg';
                img.alt = '8';
                content.appendChild(img);
            }
        } else {
            content.textContent = value;
        }

        die.appendChild(content);
    }
    // Special SVG-based shape for d10 (hexagon with rounded corners)
    else if (type === 'artifact-d10') {
        // Create SVG hexagon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 50 44');
        svg.setAttribute('class', 'd10-svg');

        // Hexagon path with rounded corners using quadratic curves
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Hexagon with slightly rounded corners
        path.setAttribute('d', 'M13,3 Q12.5,2 14,2 L36,2 Q37.5,2 37,3 L48,20 Q49,22 48,24 L37,41 Q37.5,42 36,42 L14,42 Q12.5,42 13,41 L2,24 Q1,22 2,20 Z');
        path.setAttribute('fill', 'var(--col-accent-cool)');
        svg.appendChild(path);

        die.appendChild(svg);

        // Add content on top
        const content = document.createElement('span');
        content.className = 'die-content d10-content';

        if (value === 6 || value === 7) {
            // Single success icon for 6 and 7
            const img = document.createElement('img');
            img.className = 'die-success-icon';
            img.src = 'img/icons/other/success.svg';
            img.alt = String(value);
            content.appendChild(img);
        } else if (value === 8 || value === 9) {
            // Two smaller success icons for 8 and 9
            for (let i = 0; i < 2; i++) {
                const img = document.createElement('img');
                img.className = 'die-success-icon die-success-icon-small';
                img.src = 'img/icons/other/success.svg';
                img.alt = String(value);
                content.appendChild(img);
            }
        } else if (value === 10) {
            // Three even smaller success icons for 10
            for (let i = 0; i < 3; i++) {
                const img = document.createElement('img');
                img.className = 'die-success-icon die-success-icon-tiny';
                img.src = 'img/icons/other/success.svg';
                img.alt = '10';
                content.appendChild(img);
            }
        } else {
            content.textContent = value;
        }

        die.appendChild(content);
    }
    // Special SVG-based shape for d12 (pentagon with rounded corners)
    else if (type === 'artifact-d12') {
        // Create SVG pentagon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 50 50');
        svg.setAttribute('class', 'd12-svg');

        // Pentagon path with rounded corners using quadratic curves
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Pentagon with rounded corners: top point, top-right, bottom-right, bottom-left, top-left
        path.setAttribute('d', 'M25,3 Q27,3 28,5 L46,18 Q48,20 47,22 L40,43 Q39,46 36,46 L14,46 Q11,46 10,43 L3,22 Q2,20 4,18 L22,5 Q23,3 25,3 Z');
        path.setAttribute('fill', 'var(--col-accent-warm)');
        svg.appendChild(path);

        die.appendChild(svg);

        // Add content on top
        const content = document.createElement('span');
        content.className = 'die-content d12-content';

        if (value === 6 || value === 7) {
            // Single success icon for 6 and 7
            const img = document.createElement('img');
            img.className = 'die-success-icon';
            img.src = 'img/icons/other/success1.svg';
            img.alt = String(value);
            content.appendChild(img);
        } else if (value === 8 || value === 9) {
            // Two smaller success icons for 8 and 9
            for (let i = 0; i < 2; i++) {
                const img = document.createElement('img');
                img.className = 'die-success-icon die-success-icon-small';
                img.src = 'img/icons/other/success1.svg';
                img.alt = String(value);
                content.appendChild(img);
            }
        } else if (value === 10 || value === 11) {
            // Three tiny icons in grid (2 on top, 1 on bottom)
            content.classList.add('die-icon-grid-3');
            for (let i = 0; i < 3; i++) {
                const img = document.createElement('img');
                img.className = 'die-success-icon die-success-icon-tiny';
                img.src = 'img/icons/other/success1.svg';
                img.alt = String(value);
                content.appendChild(img);
            }
        } else if (value === 12) {
            // Four tiny icons in grid (2x2)
            content.classList.add('die-icon-grid-4');
            for (let i = 0; i < 4; i++) {
                const img = document.createElement('img');
                img.className = 'die-success-icon die-success-icon-tiny';
                img.src = 'img/icons/other/success1.svg';
                img.alt = '12';
                content.appendChild(img);
            }
        } else {
            content.textContent = value;
        }

        die.appendChild(content);
    }
    // Check if value is 6 - show success icon instead of number
    else if (value === 6) {
        const img = document.createElement('img');
        img.className = 'die-success-icon';

        // Different icons for different dice types
        if (type === 'atributo') {
            img.src = 'img/icons/other/success1.svg';
        } else if (type === 'pericia') {
            img.src = 'img/icons/other/success.svg';
        } else if (type === 'equipamento') {
            img.src = 'img/icons/other/success2.svg';
        } else if (type.startsWith('artifact-')) {
            // Artifact dice also use success2 (equipment type)
            img.src = 'img/icons/other/success2.svg';
        } else {
            img.src = 'img/icons/other/success.svg';
        }

        img.alt = '6';
        die.appendChild(img);
    }
    // Check if value is 1 - show skull icon for atributo and equipamento only
    else if (value === 1 && (type === 'atributo' || type === 'equipamento')) {
        const img = document.createElement('img');
        img.className = 'die-skull-icon';

        // Different skull icons for atributo and equipamento
        if (type === 'atributo') {
            img.src = 'img/icons/other/caveira1.svg';
        } else if (type === 'equipamento') {
            img.src = 'img/icons/other/caveira2.svg';
        }

        img.alt = '1';
        die.appendChild(img);
    }
    else {
        // For artifact dice, wrap in span so CSS counter-rotation works
        if (type.startsWith('artifact-')) {
            const span = document.createElement('span');
            span.className = 'die-content';
            span.textContent = value;
            die.appendChild(span);
        } else {
            die.textContent = value;
        }
    }

    if (options.isBonus) die.classList.add('die-bonus');
    if (options.isNegative) die.classList.add('die-negative');
    if (options.isFaded) die.classList.add('die-faded');
    if (options.isSuccess) die.classList.add('die-success');
    if (options.isSkull) die.classList.add('die-skull');

    return die;
}

/**
 * Render dice in a display container
 * @param {HTMLElement} container
 * @param {Array} diceData - Array of { value, type, isBonus, isNegative, isFaded, isSuccess, isSkull }
 * @param {boolean} animate - Whether to animate the dice
 */
function renderDiceInContainer(container, diceData, animate = false) {
    container.innerHTML = '';

    diceData.forEach((die, index) => {
        // For artifact dice, success is when value >= 6
        // For regular dice, success is when value === 6
        const isArtifact = die.type && die.type.startsWith('artifact-');
        const isSuccess = isArtifact
            ? (die.value >= 6 && !die.isFaded)
            : (die.value === 6 && !die.isFaded);

        const dieEl = createDieElement(die.type, die.value, {
            isBonus: die.isBonus,
            isNegative: die.isNegative,
            isFaded: die.isFaded,
            isSuccess: isSuccess,
            isSkull: die.value === 1 && die.countAsSkull && diceRollerState.hasForcedRoll
        });

        if (animate) {
            dieEl.classList.add('rolling');
            dieEl.style.animationDelay = `${index * 0.1}s`;

            setTimeout(() => {
                dieEl.classList.remove('rolling');
            }, 600 + index * 100);
        }

        container.appendChild(dieEl);
    });
}

/**
 * Update all dice displays based on current state
 */
function updateDiceDisplays() {
    const totalModifier = diceRollerState.baseModifier + diceRollerState.customModifier;
    const basePericiaCount = diceRollerState.periciaCount;
    const effectivePericiaCount = basePericiaCount + totalModifier;

    // Atributo dice (always normal)
    const atributoDice = [];
    for (let i = 0; i < diceRollerState.atributoCount; i++) {
        const dieData = diceRollerState.atributoDice[i] || { value: '?', rolled: false };
        atributoDice.push({
            value: dieData.rolled ? dieData.value : '?',
            type: 'atributo',
            countAsSkull: true
        });
    }
    renderDiceInContainer(atributoDiceDisplay, atributoDice, false);

    // Perícia dice with modifiers
    const periciaDice = [];

    if (totalModifier >= 0) {
        // Positive or zero modifier: normal dice + bonus dice
        for (let i = 0; i < basePericiaCount; i++) {
            const dieData = diceRollerState.periciaDice[i] || { value: '?', rolled: false };
            periciaDice.push({
                value: dieData.rolled ? dieData.value : '?',
                type: 'pericia',
                isBonus: false,
                countAsSkull: false
            });
        }

        // Add bonus dice
        for (let i = 0; i < totalModifier; i++) {
            const dieData = diceRollerState.periciaDice[basePericiaCount + i] || { value: '?', rolled: false };
            periciaDice.push({
                value: dieData.rolled ? dieData.value : '?',
                type: 'pericia',
                isBonus: true,
                countAsSkull: false
            });
        }
    } else {
        // Negative modifier
        const absModifier = Math.abs(totalModifier);

        if (basePericiaCount > absModifier) {
            // More base dice than negative modifier: some normal, some faded
            const normalCount = basePericiaCount - absModifier;

            // Normal dice
            for (let i = 0; i < normalCount; i++) {
                const dieData = diceRollerState.periciaDice[i] || { value: '?', rolled: false };
                periciaDice.push({
                    value: dieData.rolled ? dieData.value : '?',
                    type: 'pericia',
                    countAsSkull: false
                });
            }

            // Faded dice (cancelled by negative modifier)
            for (let i = 0; i < absModifier; i++) {
                periciaDice.push({
                    value: '—',
                    type: 'pericia',
                    isFaded: true,
                    countAsSkull: false
                });
            }
        } else if (basePericiaCount > 0 && basePericiaCount <= absModifier) {
            // All base dice are faded, plus negative dice
            // Faded dice
            for (let i = 0; i < basePericiaCount; i++) {
                periciaDice.push({
                    value: '—',
                    type: 'pericia',
                    isFaded: true,
                    countAsSkull: false
                });
            }

            // Negative dice
            const negativeDiceCount = absModifier - basePericiaCount;
            for (let i = 0; i < negativeDiceCount; i++) {
                const dieData = diceRollerState.periciaDice[i] || { value: '?', rolled: false, isNegative: true };
                periciaDice.push({
                    value: dieData.rolled ? dieData.value : '?',
                    type: 'pericia',
                    isNegative: true,
                    countAsSkull: false
                });
            }
        } else {
            // No base dice, only negative dice
            for (let i = 0; i < absModifier; i++) {
                const dieData = diceRollerState.periciaDice[i] || { value: '?', rolled: false, isNegative: true };
                periciaDice.push({
                    value: dieData.rolled ? dieData.value : '?',
                    type: 'pericia',
                    isNegative: true,
                    countAsSkull: false
                });
            }
        }
    }

    renderDiceInContainer(periciaDiceDisplay, periciaDice, false);

    // Equipamento dice
    const equipamentoDice = [];
    for (let i = 0; i < diceRollerState.equipamentoCount; i++) {
        const dieData = diceRollerState.equipamentoDice[i] || { value: '?', rolled: false };
        equipamentoDice.push({
            value: dieData.rolled ? dieData.value : '?',
            type: 'equipamento',
            countAsSkull: true
        });
    }

    // Add artifact die if selected
    if (diceRollerState.artifactDieType !== 'none') {
        const artifactData = diceRollerState.artifactDie || { value: '?', rolled: false };
        equipamentoDice.push({
            value: artifactData.rolled ? artifactData.value : '?',
            type: `artifact-${diceRollerState.artifactDieType}`,
            isArtifact: true,
            countAsSkull: false // Artifact dice don't count skulls
        });
    }

    renderDiceInContainer(equipamentoDiceDisplay, equipamentoDice, false);
}

/**
 * Update result display
 */
function updateResultDisplay() {
    if (successCountEl) {
        successCountEl.textContent = diceRollerState.totalSuccesses;
    }

    if (diceRollerState.hasForcedRoll && skullResultsContainer) {
        skullResultsContainer.classList.remove('faded');
        if (atributoSkullCountEl) {
            atributoSkullCountEl.textContent = diceRollerState.atributoSkulls;
        }
        if (equipamentoSkullCountEl) {
            equipamentoSkullCountEl.textContent = diceRollerState.equipamentoSkulls;
        }
    } else if (skullResultsContainer) {
        skullResultsContainer.classList.add('faded');
    }

    // Update force roll button state (both top and bottom)
    const forceRollDisabled = !diceRollerState.canForceRoll || diceRollerState.hasForcedRoll;
    if (btnForceRoll) {
        btnForceRoll.disabled = forceRollDisabled;
    }
    const btnForceRollTop = document.getElementById('btn-force-roll-top');
    if (btnForceRollTop) {
        btnForceRollTop.disabled = forceRollDisabled;
    }
}

/**
 * Update the roller container with last roll results
 */
function updateRollerContainer() {
    const preview = document.getElementById('roller-result-preview');
    if (!preview) return;

    if (!diceRollerState.hasRolled) {
        preview.innerHTML = '<span class="roller-placeholder">Clique para rolar dados</span>';
        return;
    }

    let html = '<div class="roller-result-summary">';

    // Successes
    html += `
        <div class="roller-result-item">
            <img src="img/icons/other/success.svg" alt="Sucesso">
            <span class="result-value">${diceRollerState.totalSuccesses}</span>
        </div>
    `;

    // Skulls (only after forced roll)
    if (diceRollerState.hasForcedRoll) {
        if (diceRollerState.atributoSkulls > 0) {
            html += `
                <div class="roller-result-item">
                    <img src="img/icons/other/caveira.svg" alt="Caveira">
                    <span class="result-value" style="color: var(--col-accent-warm);">${diceRollerState.atributoSkulls}</span>
                    <span style="font-size: 0.8em;">(Atrib)</span>
                </div>
            `;
        }
        if (diceRollerState.equipamentoSkulls > 0) {
            html += `
                <div class="roller-result-item">
                    <img src="img/icons/other/caveira.svg" alt="Caveira">
                    <span class="result-value" style="color: var(--col-accent-warm);">${diceRollerState.equipamentoSkulls}</span>
                    <span style="font-size: 0.8em;">(Equip)</span>
                </div>
            `;
        }
    }

    html += '</div>';
    preview.innerHTML = html;
}

// --- Roll Logic ---

/**
 * Perform the main dice roll
 */
function performRoll() {
    const totalModifier = diceRollerState.baseModifier + diceRollerState.customModifier;
    const basePericiaCount = diceRollerState.periciaCount;
    const effectivePericiaCount = basePericiaCount + totalModifier;

    // Reset state
    diceRollerState.hasRolled = true;
    diceRollerState.hasForcedRoll = false;
    diceRollerState.canForceRoll = false;
    diceRollerState.totalSuccesses = 0;
    diceRollerState.atributoSkulls = 0;
    diceRollerState.equipamentoSkulls = 0;

    // Roll atributo dice
    diceRollerState.atributoDice = [];
    for (let i = 0; i < diceRollerState.atributoCount; i++) {
        const value = rollDie(6);
        diceRollerState.atributoDice.push({ value, rolled: true });
        if (value === 6) diceRollerState.totalSuccesses++;
        if (value >= 2 && value <= 5) diceRollerState.canForceRoll = true;
    }

    // Roll perícia dice (track negative dice successes separately)
    diceRollerState.periciaDice = [];
    let negativeDiceSuccesses = 0;

    if (effectivePericiaCount > 0) {
        // Roll normal + bonus dice
        const totalPericiaToRoll = effectivePericiaCount;
        for (let i = 0; i < totalPericiaToRoll; i++) {
            const value = rollDie(6);
            diceRollerState.periciaDice.push({ value, rolled: true, isBonus: i >= basePericiaCount });
            if (value === 6) diceRollerState.totalSuccesses++;
            if (value >= 2 && value <= 5) diceRollerState.canForceRoll = true;
        }
    } else if (effectivePericiaCount < 0) {
        // Roll negative dice (store successes to deduct later)
        const negativeDiceCount = Math.abs(effectivePericiaCount);
        for (let i = 0; i < negativeDiceCount; i++) {
            const value = rollDie(6);
            diceRollerState.periciaDice.push({ value, rolled: true, isNegative: true });
            if (value === 6) {
                // Track how many successes to cancel (will be applied after all dice are rolled)
                negativeDiceSuccesses++;
            }
            if (value >= 2 && value <= 5) diceRollerState.canForceRoll = true;
        }
    }

    // Roll equipamento dice
    diceRollerState.equipamentoDice = [];
    for (let i = 0; i < diceRollerState.equipamentoCount; i++) {
        const value = rollDie(6);
        diceRollerState.equipamentoDice.push({ value, rolled: true });
        if (value === 6) diceRollerState.totalSuccesses++;
        if (value >= 2 && value <= 5) diceRollerState.canForceRoll = true;
    }

    // Roll artifact die if selected
    if (diceRollerState.artifactDieType !== 'none') {
        const sides = parseInt(diceRollerState.artifactDieType.replace('d', ''));
        const value = rollDie(sides);
        diceRollerState.artifactDie = { value, rolled: true, sides };
        diceRollerState.totalSuccesses += getArtifactSuccesses(value);
        // Artifact die with 1-5 can be rerolled on force
        if (value >= 1 && value <= 5) diceRollerState.canForceRoll = true;
    } else {
        diceRollerState.artifactDie = null;
    }

    // Apply negative dice success cancellation AFTER all other dice are rolled
    if (negativeDiceSuccesses > 0) {
        diceRollerState.totalSuccesses = Math.max(0, diceRollerState.totalSuccesses - negativeDiceSuccesses);
    }

    // Update displays with animation
    animateRoll();
}

/**
 * Animate the roll with cycling numbers
 */
function animateRoll() {
    const animationDuration = 600;
    const cycleInterval = 50; // How often to change the number

    // Get all dice displays
    const atributoDisplay = document.getElementById('atributo-dice-display');
    const periciaDisplay = document.getElementById('pericia-dice-display');
    const equipamentoDisplay = document.getElementById('equipamento-dice-display');

    // Store final values
    const finalAtributo = [...diceRollerState.atributoDice];
    const finalPericia = [...diceRollerState.periciaDice];
    const finalEquipamento = [...diceRollerState.equipamentoDice];
    const finalArtifact = diceRollerState.artifactDie ? { ...diceRollerState.artifactDie } : null;

    // Update displays first with random values for animation
    updateDiceDisplaysWithRandom();
    updateResultDisplay();
    updateRollerContainer();

    // Add rolling class to all dice
    const allDice = document.querySelectorAll('.roller-die:not(.die-faded)');
    allDice.forEach(die => die.classList.add('rolling'));

    // Cycle through random numbers during animation
    let cycleCount = 0;
    const maxCycles = Math.floor(animationDuration / cycleInterval);

    const cycleNumbers = setInterval(() => {
        cycleCount++;

        // Update dice displays with new random values
        allDice.forEach(die => {
            // Skip faded dice
            if (die.classList.contains('die-faded')) return;

            // Get random number based on die type
            if (die.classList.contains('die-artifact-d8')) {
                die.querySelector('.die-content')?.textContent && (die.querySelector('.die-content').textContent = rollDie(8));
            } else if (die.classList.contains('die-artifact-d10')) {
                die.querySelector('.die-content')?.textContent && (die.querySelector('.die-content').textContent = rollDie(10));
            } else if (die.classList.contains('die-artifact-d12')) {
                die.querySelector('.die-content')?.textContent && (die.querySelector('.die-content').textContent = rollDie(12));
            } else {
                // d6 dice - update textContent directly if it's a number
                if (die.textContent && !die.querySelector('img')) {
                    die.textContent = rollDie(6);
                }
            }
        });

        if (cycleCount >= maxCycles) {
            clearInterval(cycleNumbers);
        }
    }, cycleInterval);

    // After animation, show final results
    setTimeout(() => {
        clearInterval(cycleNumbers);

        // Restore final values
        diceRollerState.atributoDice = finalAtributo;
        diceRollerState.periciaDice = finalPericia;
        diceRollerState.equipamentoDice = finalEquipamento;
        diceRollerState.artifactDie = finalArtifact;

        // Update displays with final values
        updateDiceDisplays();
        updateResultDisplay();
        updateRollerContainer();

        // Remove rolling class
        allDice.forEach(die => die.classList.remove('rolling'));
    }, animationDuration);
}

/**
 * Update dice displays with random values (for animation)
 */
function updateDiceDisplaysWithRandom() {
    // Atributo dice with random values
    const atributoContainer = document.getElementById('atributo-dice-display');
    if (atributoContainer) {
        atributoContainer.innerHTML = '';
        for (let i = 0; i < diceRollerState.atributoCount; i++) {
            const die = createDieElement('atributo', rollDie(6));
            atributoContainer.appendChild(die);
        }
    }

    // Perícia dice with random values
    const periciaContainer = document.getElementById('pericia-dice-display');
    if (periciaContainer) {
        periciaContainer.innerHTML = '';
        const totalModifier = diceRollerState.baseModifier + diceRollerState.customModifier;
        const basePericiaCount = diceRollerState.periciaCount;

        if (totalModifier >= 0) {
            // Normal + bonus dice
            for (let i = 0; i < basePericiaCount + totalModifier; i++) {
                const die = createDieElement('pericia', rollDie(6), { isBonus: i >= basePericiaCount });
                periciaContainer.appendChild(die);
            }
        } else {
            const absModifier = Math.abs(totalModifier);
            if (basePericiaCount > absModifier) {
                // Normal + faded dice
                for (let i = 0; i < basePericiaCount - absModifier; i++) {
                    const die = createDieElement('pericia', rollDie(6));
                    periciaContainer.appendChild(die);
                }
                for (let i = 0; i < absModifier; i++) {
                    const die = createDieElement('pericia', '—', { isFaded: true });
                    periciaContainer.appendChild(die);
                }
            } else {
                // Faded + negative dice
                for (let i = 0; i < basePericiaCount; i++) {
                    const die = createDieElement('pericia', '—', { isFaded: true });
                    periciaContainer.appendChild(die);
                }
                for (let i = 0; i < absModifier - basePericiaCount; i++) {
                    const die = createDieElement('pericia', rollDie(6), { isNegative: true });
                    periciaContainer.appendChild(die);
                }
            }
        }
    }

    // Equipamento dice with random values
    const equipamentoContainer = document.getElementById('equipamento-dice-display');
    if (equipamentoContainer) {
        equipamentoContainer.innerHTML = '';
        for (let i = 0; i < diceRollerState.equipamentoCount; i++) {
            const die = createDieElement('equipamento', rollDie(6));
            equipamentoContainer.appendChild(die);
        }

        // Artifact die
        if (diceRollerState.artifactDieType !== 'none') {
            const sides = diceRollerState.artifactDieType === 'd8' ? 8 :
                diceRollerState.artifactDieType === 'd10' ? 10 : 12;
            const die = createDieElement(`artifact-${diceRollerState.artifactDieType}`, rollDie(sides));
            equipamentoContainer.appendChild(die);
        }
    }
}

/**
 * Animate only re-rolled dice during force roll with cycling numbers
 */
function animateForceRoll() {
    const animationDuration = 600;
    const cycleInterval = 50;

    // Store final values before animation
    const finalAtributo = diceRollerState.atributoDice.map(d => ({ ...d }));
    const finalPericia = diceRollerState.periciaDice.map(d => ({ ...d }));
    const finalEquipamento = diceRollerState.equipamentoDice.map(d => ({ ...d }));
    const finalArtifact = diceRollerState.artifactDie ? { ...diceRollerState.artifactDie } : null;

    // Update displays first so we have the dice elements
    updateDiceDisplays();
    updateResultDisplay();
    updateRollerContainer();

    // Collect re-rolled dice elements
    const rerolledDice = [];

    // For atributo dice
    const atributoDisplay = document.getElementById('atributo-dice-display');
    if (atributoDisplay) {
        const atributoDice = atributoDisplay.querySelectorAll('.roller-die');
        finalAtributo.forEach((dieData, index) => {
            if (dieData.justRerolled && atributoDice[index]) {
                atributoDice[index].classList.add('rolling');
                rerolledDice.push({ element: atributoDice[index], sides: 6 });
            }
        });
    }

    // For perícia dice (skip faded dice)
    const periciaDisplay = document.getElementById('pericia-dice-display');
    if (periciaDisplay) {
        const periciaDiceEls = periciaDisplay.querySelectorAll('.roller-die:not(.die-faded)');
        let dieIndex = 0;
        finalPericia.forEach((dieData) => {
            if (dieData.justRerolled && periciaDiceEls[dieIndex]) {
                periciaDiceEls[dieIndex].classList.add('rolling');
                rerolledDice.push({ element: periciaDiceEls[dieIndex], sides: 6 });
            }
            if (!dieData.isFaded) dieIndex++;
        });
    }

    // For equipamento dice
    const equipamentoDisplay = document.getElementById('equipamento-dice-display');
    if (equipamentoDisplay) {
        const equipamentoDiceEls = equipamentoDisplay.querySelectorAll('.roller-die:not([class*="die-artifact"])');
        let dieIndex = 0;
        finalEquipamento.forEach((dieData) => {
            if (dieData.justRerolled && equipamentoDiceEls[dieIndex]) {
                equipamentoDiceEls[dieIndex].classList.add('rolling');
                rerolledDice.push({ element: equipamentoDiceEls[dieIndex], sides: 6 });
            }
            dieIndex++;
        });

        // Check artifact die
        if (finalArtifact?.justRerolled) {
            const artifactDie = equipamentoDisplay.querySelector('.roller-die[class*="die-artifact"]');
            if (artifactDie) {
                artifactDie.classList.add('rolling');
                const sides = diceRollerState.artifactDieType === 'd8' ? 8 :
                    diceRollerState.artifactDieType === 'd10' ? 10 : 12;
                rerolledDice.push({ element: artifactDie, sides: sides, isArtifact: true });
            }
        }
    }

    // Cycle through random numbers on re-rolled dice
    let cycleCount = 0;
    const maxCycles = Math.floor(animationDuration / cycleInterval);

    const cycleNumbers = setInterval(() => {
        cycleCount++;

        rerolledDice.forEach(({ element, sides, isArtifact }) => {
            if (isArtifact) {
                const content = element.querySelector('.die-content');
                if (content) content.textContent = rollDie(sides);
            } else {
                if (!element.querySelector('img')) {
                    element.textContent = rollDie(sides);
                }
            }
        });

        if (cycleCount >= maxCycles) {
            clearInterval(cycleNumbers);
        }
    }, cycleInterval);

    // After animation, show final results
    setTimeout(() => {
        clearInterval(cycleNumbers);

        // Restore final values
        diceRollerState.atributoDice = finalAtributo;
        diceRollerState.periciaDice = finalPericia;
        diceRollerState.equipamentoDice = finalEquipamento;
        diceRollerState.artifactDie = finalArtifact;

        // Update displays with final values
        updateDiceDisplays();
        updateResultDisplay();
        updateRollerContainer();
    }, animationDuration);
}

/**
 * Perform forced roll (re-roll dice showing 2, 3, 4, 5)
 */
function performForceRoll() {
    if (!diceRollerState.canForceRoll || diceRollerState.hasForcedRoll) return;

    diceRollerState.hasForcedRoll = true;
    diceRollerState.canForceRoll = false;

    // Re-roll atributo dice showing 2-5
    diceRollerState.atributoDice.forEach((die, index) => {
        if (die.value >= 2 && die.value <= 5) {
            const newValue = rollDie(6);
            diceRollerState.atributoDice[index].value = newValue;
            diceRollerState.atributoDice[index].justRerolled = true;
            if (newValue === 6) diceRollerState.totalSuccesses++;
        } else {
            diceRollerState.atributoDice[index].justRerolled = false;
        }
        // Count skulls (1s) after forcing
        if (diceRollerState.atributoDice[index].value === 1) {
            diceRollerState.atributoSkulls++;
        }
    });

    // Re-roll perícia dice
    // Normal dice: re-roll 2-5 (keep 1 and 6)
    // Negative dice: re-roll 1-5 (only keep 6)
    let negativeDiceSuccesses = 0;

    diceRollerState.periciaDice.forEach((die, index) => {
        const shouldReroll = die.isNegative
            ? (die.value !== 6)  // Negative dice: re-roll everything except 6
            : (die.value >= 2 && die.value <= 5);  // Normal dice: re-roll 2-5

        if (shouldReroll) {
            const newValue = rollDie(6);
            diceRollerState.periciaDice[index].value = newValue;
            diceRollerState.periciaDice[index].justRerolled = true;
            if (newValue === 6) {
                if (die.isNegative) {
                    // Track negative dice successes to apply after all re-rolls
                    negativeDiceSuccesses++;
                } else {
                    diceRollerState.totalSuccesses++;
                }
            }
        } else {
            diceRollerState.periciaDice[index].justRerolled = false;
            // Count existing negative 6s that weren't re-rolled
            if (die.isNegative && die.value === 6) {
                negativeDiceSuccesses++;
            }
        }
        // Perícia dice 1s do NOT count as skulls
    });

    // Re-roll equipamento dice showing 2-5
    diceRollerState.equipamentoDice.forEach((die, index) => {
        if (die.value >= 2 && die.value <= 5) {
            const newValue = rollDie(6);
            diceRollerState.equipamentoDice[index].value = newValue;
            diceRollerState.equipamentoDice[index].justRerolled = true;
            if (newValue === 6) diceRollerState.totalSuccesses++;
        } else {
            diceRollerState.equipamentoDice[index].justRerolled = false;
        }
        // Count skulls (1s) after forcing
        if (diceRollerState.equipamentoDice[index].value === 1) {
            diceRollerState.equipamentoSkulls++;
        }
    });

    // Re-roll artifact die if showing 1-5
    if (diceRollerState.artifactDie && diceRollerState.artifactDie.value >= 1 && diceRollerState.artifactDie.value <= 5) {
        const newValue = rollDie(diceRollerState.artifactDie.sides);
        diceRollerState.artifactDie.value = newValue;
        diceRollerState.artifactDie.justRerolled = true;
        diceRollerState.totalSuccesses += getArtifactSuccesses(newValue);
    } else if (diceRollerState.artifactDie) {
        diceRollerState.artifactDie.justRerolled = false;
    }
    // Artifact die 1 does NOT count as skull

    // Apply negative dice success cancellation AFTER all re-rolls
    if (negativeDiceSuccesses > 0) {
        diceRollerState.totalSuccesses = Math.max(0, diceRollerState.totalSuccesses - negativeDiceSuccesses);
    }

    // Animate only re-rolled dice and update
    animateForceRoll();
}

// --- Event Handlers ---

function setupEventListeners() {
    // Modal open/close
    if (rollerContainer) {
        rollerContainer.addEventListener('click', openModal);
    }

    const closeBtn = modal?.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Quick roll buttons
    document.querySelectorAll('.quick-roll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const rollType = btn.dataset.rollType;
            selectQuickRoll(rollType);
        });
    });

    // Custom modifier controls
    const modifierMinus = document.getElementById('modifier-minus');
    const modifierPlus = document.getElementById('modifier-plus');

    if (modifierMinus) {
        modifierMinus.addEventListener('click', () => {
            diceRollerState.customModifier = Math.max(-10, diceRollerState.customModifier - 1);
            customModifierInput.value = diceRollerState.customModifier;
            updateModifierDisplay();
            updateDiceDisplays();
        });
    }

    if (modifierPlus) {
        modifierPlus.addEventListener('click', () => {
            diceRollerState.customModifier = Math.min(10, diceRollerState.customModifier + 1);
            customModifierInput.value = diceRollerState.customModifier;
            updateModifierDisplay();
            updateDiceDisplays();
        });
    }

    if (customModifierInput) {
        customModifierInput.addEventListener('change', () => {
            diceRollerState.customModifier = parseInt(customModifierInput.value) || 0;
            updateModifierDisplay();
            updateDiceDisplays();
        });
    }

    // Dice amount controls
    setupDiceSlotControls();

    // Artifact die select
    if (artifactDieTypeSelect) {
        artifactDieTypeSelect.addEventListener('change', () => {
            diceRollerState.artifactDieType = artifactDieTypeSelect.value;
            diceRollerState.artifactDie = null;
            updateDiceDisplays();
        });
    }

    // Roll button
    if (btnRollDice) {
        btnRollDice.addEventListener('click', performRoll);
    }

    // Force roll button
    if (btnForceRoll) {
        btnForceRoll.addEventListener('click', performForceRoll);
    }

    // Top action buttons (duplicates)
    const btnRollDiceTop = document.getElementById('btn-roll-dice-top');
    const btnForceRollTop = document.getElementById('btn-force-roll-top');

    if (btnRollDiceTop) {
        btnRollDiceTop.addEventListener('click', performRoll);
    }

    if (btnForceRollTop) {
        btnForceRollTop.addEventListener('click', performForceRoll);
    }

    // Global reset button
    const btnResetAll = document.getElementById('btn-reset-all-dice');
    if (btnResetAll) {
        btnResetAll.addEventListener('click', resetAllDice);
    }
}

/**
 * Reset all dice slots and custom modifier
 */
function resetAllDice() {
    // Reset Atributo
    diceRollerState.atributoCount = 1;
    diceAmountAtrib.value = 1;
    diceRollerState.atributoDice = [];

    // Reset Perícia
    diceRollerState.periciaCount = 0;
    diceAmountSkill.value = 0;
    diceRollerState.periciaDice = [];

    // Reset Equipamento
    diceRollerState.equipamentoCount = 0;
    diceAmountEquip.value = 0;
    diceRollerState.equipamentoDice = [];
    diceRollerState.artifactDieType = 'none';
    if (artifactDieTypeSelect) artifactDieTypeSelect.value = 'none';
    diceRollerState.artifactDie = null;

    // Reset custom modifier
    diceRollerState.customModifier = 0;
    if (customModifierInput) customModifierInput.value = 0;

    // Reset quick roll selection and base modifier
    diceRollerState.selectedRollType = null;
    diceRollerState.baseModifier = 0;
    document.querySelectorAll('.quick-roll-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Reset roll state
    diceRollerState.hasRolled = false;
    diceRollerState.canForceRoll = false;
    diceRollerState.hasForcedRoll = false;
    diceRollerState.totalSuccesses = 0;
    diceRollerState.atributoSkulls = 0;
    diceRollerState.equipamentoSkulls = 0;

    // Update displays
    updateModifierDisplay();
    updateDiceDisplays();
    updateResultDisplay();
}

function setupDiceSlotControls() {
    // Atributo controls
    const atributoSlot = document.querySelector('.dice-slot[data-dice-type="atributo"]');
    if (atributoSlot) {
        const minusBtn = atributoSlot.querySelector('.minus-btn');
        const plusBtn = atributoSlot.querySelector('.plus-btn');

        minusBtn?.addEventListener('click', () => {
            diceRollerState.atributoCount = Math.max(1, diceRollerState.atributoCount - 1);
            diceAmountAtrib.value = diceRollerState.atributoCount;
            updateDiceDisplays();
        });

        plusBtn?.addEventListener('click', () => {
            diceRollerState.atributoCount = Math.min(10, diceRollerState.atributoCount + 1);
            diceAmountAtrib.value = diceRollerState.atributoCount;
            updateDiceDisplays();
        });
    }

    if (diceAmountAtrib) {
        diceAmountAtrib.addEventListener('change', () => {
            diceRollerState.atributoCount = Math.max(1, Math.min(10, parseInt(diceAmountAtrib.value) || 1));
            diceAmountAtrib.value = diceRollerState.atributoCount;
            updateDiceDisplays();
        });
    }

    // Perícia controls
    const periciaSlot = document.querySelector('.dice-slot[data-dice-type="pericia"]');
    if (periciaSlot) {
        const minusBtn = periciaSlot.querySelector('.minus-btn');
        const plusBtn = periciaSlot.querySelector('.plus-btn');

        minusBtn?.addEventListener('click', () => {
            diceRollerState.periciaCount = Math.max(0, diceRollerState.periciaCount - 1);
            diceAmountSkill.value = diceRollerState.periciaCount;
            updateDiceDisplays();
        });

        plusBtn?.addEventListener('click', () => {
            diceRollerState.periciaCount = Math.min(10, diceRollerState.periciaCount + 1);
            diceAmountSkill.value = diceRollerState.periciaCount;
            updateDiceDisplays();
        });
    }

    if (diceAmountSkill) {
        diceAmountSkill.addEventListener('change', () => {
            diceRollerState.periciaCount = Math.max(0, Math.min(10, parseInt(diceAmountSkill.value) || 0));
            diceAmountSkill.value = diceRollerState.periciaCount;
            updateDiceDisplays();
        });
    }

    // Equipamento controls
    const equipamentoSlot = document.querySelector('.dice-slot[data-dice-type="equipamento"]');
    if (equipamentoSlot) {
        const minusBtn = equipamentoSlot.querySelector('.minus-btn');
        const plusBtn = equipamentoSlot.querySelector('.plus-btn');

        minusBtn?.addEventListener('click', () => {
            diceRollerState.equipamentoCount = Math.max(0, diceRollerState.equipamentoCount - 1);
            diceAmountEquip.value = diceRollerState.equipamentoCount;
            updateDiceDisplays();
        });

        plusBtn?.addEventListener('click', () => {
            diceRollerState.equipamentoCount = Math.min(10, diceRollerState.equipamentoCount + 1);
            diceAmountEquip.value = diceRollerState.equipamentoCount;
            updateDiceDisplays();
        });
    }

    if (diceAmountEquip) {
        diceAmountEquip.addEventListener('change', () => {
            diceRollerState.equipamentoCount = Math.max(0, Math.min(10, parseInt(diceAmountEquip.value) || 0));
            diceAmountEquip.value = diceRollerState.equipamentoCount;
            updateDiceDisplays();
        });
    }
}

function selectQuickRoll(rollType) {
    // Clear previous selection
    document.querySelectorAll('.quick-roll-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (diceRollerState.selectedRollType === rollType) {
        // Deselect
        diceRollerState.selectedRollType = null;
        diceRollerState.baseModifier = 0;
    } else {
        // Select new
        diceRollerState.selectedRollType = rollType;
        const modifier = getModifierFromGame(rollType);

        if (modifier === -999) {
            // Not allowed
            alert(`${rollType.toUpperCase()} não é permitido no terreno atual.`);
            diceRollerState.selectedRollType = null;
            diceRollerState.baseModifier = 0;
        } else {
            diceRollerState.baseModifier = modifier;
            document.querySelector(`.quick-roll-btn[data-roll-type="${rollType}"]`)?.classList.add('active');
        }
    }

    updateModifierDisplay();
    updateDiceDisplays();
}

function openModal() {
    if (modal) {
        modal.style.display = 'block';
        updateQuickRollBonuses();
        updateDiceDisplays();
        updateResultDisplay();
    }
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        // Persist values in state (already done via event handlers)
    }
}

// --- Initialization ---

function initDiceRoller() {
    initDOMReferences();

    if (!modal || !rollerContainer) {
        console.warn('Dice Roller: Required DOM elements not found');
        return;
    }

    setupEventListeners();

    // Initialize displays
    updateModifierDisplay();
    updateDiceDisplays();
    updateResultDisplay();
    updateRollerContainer();
    updateQuickRollBonuses();

    console.log('Dice Roller initialized');
}

/**
 * Update the bonus displays for each quick roll type
 */
function updateQuickRollBonuses() {
    const rollTypes = ['desbravar', 'acampar', 'coletar', 'cacar'];

    rollTypes.forEach(type => {
        const bonusEl = document.getElementById(`bonus-${type}`);
        if (bonusEl) {
            const modifier = getModifierFromGame(type);
            if (modifier === -999) {
                bonusEl.textContent = '—';
                bonusEl.title = 'Não permitido';
                bonusEl.classList.remove('negative');
            } else {
                const sign = modifier >= 0 ? '+' : '';
                bonusEl.textContent = `${sign}${modifier}`;
                bonusEl.title = '';

                // Add negative class for negative modifiers
                if (modifier < 0) {
                    bonusEl.classList.add('negative');
                } else {
                    bonusEl.classList.remove('negative');
                }
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDiceRoller);
