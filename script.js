// --- CONFIGURAÇÃO -- -
const HEX_SIZE = 40; // Tamanho do lado de cada hexágono
const GRID_WIDTH = 5;
const GRID_HEIGHT = 5;

const terrainInfo = {
    'Planície': '✥ Terreno aberto, é possível trafegar 2 hexágonos por Quarto de Dia<br>✥ -1 em rolagens de COLETAR<br>✥ +1 em rolagens de CAÇAR',
    'Floresta': '✥ Terreno aberto, é possível trafegar 2 hexágonos por Quarto de Dia<br>✥ +1 em rolagens de COLETAR<br>✥ +1 em rolagens de CAÇAR',
    'Floresta Sombria': '✥ Terreno dificultoso, é possível trafegar 1 hexágono por Quarto de Dia<br>✥ -1 em rolagens de COLETAR',
    'Colinas': '✥ Terreno aberto, é possível trafegar 2 hexágonos por Quarto de Dia',
    'Montanhas': '✥ Terreno dificultoso, é possível trafegar 1 hexágono por Quarto de Dia<br>✥ -2 em rolagens de COLETAR<br>✥ -1 em rolagens de CAÇAR',
    'Montanhas Altas': '✥ Intransponível<br>✥ Não é possível coletar ou caçar',
    'Lago ou Rio': '✥ Requer um barco ou balsa<br>✥ Não é possível coletar',
    'Pantano': '✥ Requer uma balsa<br>✥ +1 em rolagens de COLETAR<br>✥ -1 em rolagens de CAÇAR',
    'Charco': '✥ Terreno dificultoso, é possível trafegar 1 hexágono por Quarto de Dia<br>✥ -1 em rolagens de COLETAR',
    'Ruínas': '✥ Terreno dificultoso, é possível trafegar 1 hexágono por Quarto de Dia<br>✥ -2 em rolagens de COLETAR<br>✥ -1 em rolagens de CAÇAR'
};

// --- INICIALIZAÇÃO ---
const solitarySvg = document.getElementById('solitary-hexagon-svg');
const selectedHexagonContainer = document.getElementById('selected-hexweather-container');
let originalTextWindowContent = '';
let currentSelectedHexagon = null; // Default selected hexagon is now null
let selectedTemperatureRowIndex = null;
let selectedTerrainInfo = '';
let currentSelectedTerrainData = null;

const CALENDAR_CONFIG = {
    startYear: 1165,
    months: [
        { name: 'Cresceoutono', days: 45, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguaoutono', days: 46, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceinverno', days: 45, lighting: ['Escuro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguainverno', days: 46, lighting: ['Escuro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceprimavera', days: 45, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguaprimavera', days: 46, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceverão', days: 45, lighting: ['Claro', 'Claro', 'Claro', 'Escuro'] },
        { name: 'Minguaverão', days: 46, lighting: ['Claro', 'Claro', 'Claro', 'Escuro'] }
    ]
};

const QUARTERS = ['Manhã', 'Tarde', 'Anoitecer', 'Noite'];

const HOT_MONTHS = ['Minguaprimavera', 'Cresceverão', 'Minguaverão', 'Cresceoutono'];
const COLD_MONTHS = ['Cresceprimavera', 'Minguaoutono', 'Cresceinverno', 'Minguainverno'];

// --- CALENDAR & TRAVEL STATE ---
let calendarData = [];
let gameState = {
    currentYear: CALENDAR_CONFIG.startYear,
    currentMonthIndex: 0,
    currentDayInMonth: 0, // Will be 1 on first day
    currentQuarterIndex: 0, // 0-3
    currentQuarterIndex: 0, // 0-3
    currentActionCount: 0, // Actions taken in current quarter
    waitingForTerrainSelection: false
};

function initializeCalendar() {
    // Start Day 1 - REMOVED to show placeholder
    // startNewDay();
    updateInfoDisplay('✥ Para iniciar um registro é preciso que o clima, o terreno, o mês e o dia estejam selecionados abaixo.');
    // renderCalendar(); // Don't render yet, keep placeholder
    setupTravelControls();
    setupCalendarModal();
    setupStartGameModal();
    updateTravelButtonState(); // Initial check
    renderWeatherNavigation();
}

function startNewDay(resetWeather = true) {
    // Advance date
    gameState.currentDayInMonth++;

    const currentMonth = CALENDAR_CONFIG.months[gameState.currentMonthIndex];
    if (gameState.currentDayInMonth > currentMonth.days) {
        gameState.currentDayInMonth = 1;
        gameState.currentMonthIndex++;
        if (gameState.currentMonthIndex >= CALENDAR_CONFIG.months.length) {
            gameState.currentMonthIndex = 0;
            gameState.currentYear++;
        }
    }

    const dayId = calendarData.length + 1;
    const monthData = CALENDAR_CONFIG.months[gameState.currentMonthIndex];

    const newDay = {
        id: dayId,
        year: gameState.currentYear,
        month: monthData.name,
        dayInMonth: gameState.currentDayInMonth,
        lighting: monthData.lighting,
        weather: null,
        quarters: [
            { id: 0, name: 'Manhã', actions: [] },
            { id: 1, name: 'Tarde', actions: [] },
            { id: 2, name: 'Anoitecer', actions: [] },
            { id: 3, name: 'Noite', actions: [] }
        ]
    };

    // If a hexagon is already selected (persisted state), set it as weather for the new day
    if (currentSelectedHexagon !== null && hexagonData[currentSelectedHexagon]) {
        newDay.weather = hexagonData[currentSelectedHexagon];
    }

    calendarData.push(newDay);
    updateTemperatureTable();
}

function renderCalendar() {
    const currentDayDisplay = document.getElementById('current-day-display');

    if (calendarData.length === 0) return; // Don't render if not started

    const day = calendarData[gameState.currentDayIndex];
    const quarterName = QUARTERS[gameState.currentQuarterIndex];

    // Get lighting for current quarter
    const lighting = day.lighting[gameState.currentQuarterIndex];

    if (currentDayDisplay) {
        currentDayDisplay.textContent = `${day.dayInMonth} de ${day.month} de ${day.year} - ${quarterName} (${lighting})`;
    }

    // Update main day details view
    if (typeof showDayDetails === 'function') {
        showDayDetails(day);
    }
}

function setupTravelControls() {
    document.getElementById('btn-desbravar').addEventListener('click', handleDesbravar);
    const btnPermanecer = document.getElementById('btn-permanecer');
    btnPermanecer.addEventListener('click', handlePermanecer);
    document.getElementById('btn-advance-day').addEventListener('click', handleAdvanceDay);
}

function showAdvanceDayButton() {
    document.querySelector('.desbravar-container').style.display = 'none';
    document.getElementById('btn-permanecer').style.display = 'none';

    const btnAdvance = document.getElementById('btn-advance-day');
    btnAdvance.classList.remove('hidden');
    btnAdvance.classList.add('visible');
}

function handleAdvanceDay() {
    startNewDay();

    // Reset UI visibility
    document.querySelector('.desbravar-container').style.display = 'flex';
    document.getElementById('btn-permanecer').style.display = 'block';

    const btnAdvance = document.getElementById('btn-advance-day');
    btnAdvance.classList.remove('visible');
    btnAdvance.classList.add('hidden');

    // Clear weather container visually (logic already handled in startNewDay -> resetSelections)
    // But we want to be sure
    // const weatherContainer = document.getElementById('selected-hexweather-container');
    // if (weatherContainer) weatherContainer.innerHTML = '';

    renderCalendar(); // Update UI to show new day details
}

function updateTravelButtonState() {
    const btnDesbravar = document.getElementById('btn-desbravar');
    const btnPermanecer = document.getElementById('btn-permanecer');

    const isWeatherSelected = currentSelectedHexagon !== null;
    const isTerrainSelected = !!currentSelectedTerrainData;
    const isGameStarted = calendarData.length > 0;
    const canTravel = isWeatherSelected && isTerrainSelected && isGameStarted;

    if (canTravel) {
        btnDesbravar.classList.remove('disabled');
        btnDesbravar.disabled = false;
        btnPermanecer.classList.remove('disabled');
        btnPermanecer.disabled = false;
    } else {
        btnDesbravar.classList.add('disabled');
        btnDesbravar.disabled = true;
        btnPermanecer.classList.add('disabled');
        btnPermanecer.disabled = true;
    }
}

function isFastTerrain(terrainName) {
    return ['Planície', 'Floresta', 'Colinas'].includes(terrainName);
}

function getMaxActions(terrainName) {
    const isMounted = document.getElementById('toggle-mounted').checked;
    if (isFastTerrain(terrainName)) {
        return isMounted ? 3 : 2;
    }
    return 1;
}

function handleDesbravar() {
    if (calendarData.length === 0) {
        alert("Selecione o mês e dia para iniciar (clique no topo).");
        return;
    }

    if (gameState.waitingForTerrainSelection) return;

    if (!currentSelectedTerrainData) {
        // If no terrain selected, force selection
        gameState.waitingForTerrainSelection = true;

        // Clear selected terrain UI to show placeholder
        const selectedTerrain = document.getElementById('selected-terrain');
        const mainTerrainImage = selectedTerrain.querySelector('img');
        const terrainPlaceholder = document.getElementById('terrain-placeholder');
        const terrainTitle = document.getElementById('selected-terrain-title');

        mainTerrainImage.style.display = 'none';
        mainTerrainImage.src = '';
        if (terrainPlaceholder) terrainPlaceholder.style.display = 'flex';
        if (terrainTitle) terrainTitle.textContent = 'Selecione o Terreno';
        return;
    }

    // We have terrain data, proceed with action
    const terrainName = currentSelectedTerrainData.name;
    const maxActions = getMaxActions(terrainName);

    // Record action
    recordAction(currentSelectedTerrainData, 'Desbravar');
    gameState.currentActionCount++;

    // Check if we need to advance quarter
    if (gameState.currentActionCount >= maxActions) {
        advanceQuarter();
    } else {
        renderCalendar(); // Update display for next action number
    }
}

function handlePermanecer() {
    if (calendarData.length === 0) {
        alert("Selecione o mês e dia para iniciar (clique no topo).");
        return;
    }

    if (gameState.waitingForTerrainSelection) return;

    if (!currentSelectedTerrainData) {
        alert("Selecione um terreno primeiro.");
        return;
    }

    // Permanecer consumes the rest of the quarter (or the whole quarter)
    // For simplicity based on request "registre apenas se permaneceu", we add one action entry
    recordAction(currentSelectedTerrainData, 'Permanecer');
    advanceQuarter();
}

function recordAction(terrainData, actionType) {
    const day = calendarData[gameState.currentDayIndex];
    const quarter = day.quarters[gameState.currentQuarterIndex];
    quarter.actions.push({ ...terrainData, action: actionType });

    // Also record weather if not set for the day
    if (!day.weather && currentSelectedHexagon) {
        day.weather = hexagonData[currentSelectedHexagon];
    }
    if (!day.weather && currentSelectedHexagon) {
        day.weather = hexagonData[currentSelectedHexagon];
    }
}

function advanceQuarter() {
    gameState.currentActionCount = 0;
    gameState.currentQuarterIndex++;

    // Check if day is over
    if (gameState.currentQuarterIndex >= QUARTERS.length) {
        // Ensure the last action is rendered before showing the advance button
        if (typeof showDayDetails === 'function') {
            showDayDetails(calendarData[gameState.currentDayIndex]);
        }
        showAdvanceDayButton();
        return;
    }

    renderCalendar();
}



function getPreviousTerrain() {
    // Look back for the last non-null terrain
    // Check current day history backwards
    const day = calendarData[gameState.currentDayIndex];

    // Check current quarter previous slots
    if (gameState.currentSlotIndex === 1 && day.quarters[gameState.currentQuarterIndex].slots[0]) {
        return day.quarters[gameState.currentQuarterIndex].slots[0];
    }

    // Check previous quarters in current day
    for (let q = gameState.currentQuarterIndex - 1; q >= 0; q--) {
        if (day.quarters[q].slots[1]) return day.quarters[q].slots[1];
        if (day.quarters[q].slots[0]) return day.quarters[q].slots[0];
    }

    // Check previous days
    for (let d = gameState.currentDayIndex - 1; d >= 0; d--) {
        const prevDay = calendarData[d];
        for (let q = 3; q >= 0; q--) {
            if (prevDay.quarters[q].slots[1]) return prevDay.quarters[q].slots[1];
            if (prevDay.quarters[q].slots[0]) return prevDay.quarters[q].slots[0];
        }
    }

    return null;
}



let currentInfoMessage = '';

function updateInfoDisplay(content) {
    const infoDisplay = document.getElementById('info-display');
    if (infoDisplay) {
        currentInfoMessage = content; // Store the base message
        let newContent = content;
        if (selectedTerrainInfo) {
            if (newContent) {
                newContent += '<br><br>' + selectedTerrainInfo;
            } else {
                newContent = selectedTerrainInfo;
            }
        }

        // Conditional Prompts
        const isWeatherSelected = currentSelectedHexagon !== null;
        const isTerrainSelected = !!selectedTerrainInfo;
        const isGameStarted = calendarData.length > 0;

        if (isGameStarted) {
            if (!isTerrainSelected) {
                if (newContent) newContent += '<br><br>';
                newContent += '✥ Selecione o terreno';
            }
            if (!isWeatherSelected) {
                if (newContent) newContent += '<br><br>';
                newContent += '✥ Selecione um hexagono de clima no hexflower de clima, mas não esqueça de selecionar a temperatura.';
            }
        } else {
            if (isWeatherSelected && !isTerrainSelected) {
                if (newContent) newContent += '<br><br>';
                newContent += '✥ Selecione o terreno';
            } else if (isTerrainSelected && !isWeatherSelected) {
                if (newContent) newContent += '<br><br>';
                newContent += '✥ Selecione um hexagono de clima no hexflower de clima, mas não esqueça de selecionar a temperatura.';
            }
        }

        // Seasonal Modifiers
        if (calendarData.length > 0) {
            const currentMonthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
            let seasonalModifier = '';

            if (['Cresceprimavera', 'Minguaprimavera'].includes(currentMonthName)) {
                seasonalModifier = '✥ -1 em rolagens de Coletar.';
            } else if (['Cresceoutono', 'Minguaoutono'].includes(currentMonthName)) {
                seasonalModifier = '✥ +1 em rolagens de Coletar.';
            } else if (['Cresceinverno', 'Minguainverno'].includes(currentMonthName)) {
                seasonalModifier = '✥ -2 em rolagens de Coletar.';
            }

            if (seasonalModifier) {
                if (newContent) newContent += '<br><br>';
                newContent += seasonalModifier;
            }
        }

        infoDisplay.innerHTML = newContent;
    }
}

// --- LÓGICA DE RENDERIZAÇÃO ---
function getHexCorner(x, y, size, i) {
    const angle_deg = 60 * i;
    const angle_rad = Math.PI / 180 * angle_deg;
    return {
        x: x + size * Math.cos(angle_rad),
        y: y + size * Math.sin(angle_rad)
    };
}

function createHexagon(targetSvg, q, r, hexWidth, hexHeight, offsetX, offsetY, defs, textContent = null, hasBorder = true, fillImage = null, size = HEX_SIZE) {
    const x = hexWidth * q * 0.75 + hexWidth / 2 + offsetX;
    const y = hexHeight * r + (q % 2) * (hexHeight / 2) + hexHeight / 2 + offsetY;

    let points = "";
    for (let i = 0; i < 6; i++) {
        const corner = getHexCorner(x, y, size, i);
        points += `${corner.x},${corner.y} `;
    }

    // Create group
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'hex-group');
    // We might not have displayNumber here easily unless passed, but blocked hexes usually don't need it for selection
    // However, for consistency, we can add data attributes if needed. 
    // For now, just structure it correctly.

    // 1. Background Polygon (for hover effect)
    const hexBg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hexBg.setAttribute('points', points);
    hexBg.setAttribute('class', 'hex-bg');
    hexBg.setAttribute('stroke', 'none');
    group.appendChild(hexBg);

    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hex.setAttribute('points', points);
    hex.setAttribute('class', 'hexagon');
    if (hasBorder) {
        hex.setAttribute('stroke', '#333');
        hex.setAttribute('stroke-width', '2');
    } else {
        hex.style.stroke = 'none';
        hex.style.strokeWidth = '0';
        group.style.pointerEvents = 'none'; // Disable hover effects
    }

    if (fillImage) {
        const patternId = `pattern-${q}-${r}-${Date.now()}`;
        let pattern = defs.querySelector(`#${patternId}`);
        if (!pattern) {
            pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            pattern.setAttribute('id', patternId);
            pattern.setAttribute('patternContentUnits', 'objectBoundingBox');
            pattern.setAttribute('width', '1');
            pattern.setAttribute('height', '1');
            pattern.setAttribute('viewBox', '-50 -50 100 100');
            pattern.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('href', fillImage);
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', fillImage);
            image.setAttribute('x', '-50');
            image.setAttribute('y', '-50');
            image.setAttribute('width', '100');
            image.setAttribute('height', '100');
            pattern.appendChild(image);
            defs.appendChild(pattern);
        }
        hex.setAttribute('fill', `url(#${patternId})`);
    } else {
        hex.setAttribute('fill', 'transparent');
    }

    group.appendChild(hex);

    if (textContent) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.textContent = textContent;
        group.appendChild(text);
    }

    targetSvg.appendChild(group);
}


function updateTextWithTemperature(row) {
    const lines = originalTextWindowContent.split('<br>');

    const titleIndex = lines.findIndex(line => line.startsWith('<b>'));

    const linesWithoutTitle = [...lines];
    if (titleIndex > -1) {
        linesWithoutTitle.splice(titleIndex, 1);
    }

    const newLines = linesWithoutTitle.filter(line => line && !line.includes('para rolar na tabela de'));
    const newEffect = row.cells[1].innerHTML;
    newLines.push(`✥ ${newEffect}`);

    updateInfoDisplay(newLines.join('<br>'));
}

function renderSelectedHexagon(displayNumber) {
    solitarySvg.innerHTML = ''; // Limpa o SVG

    const selectedHexagonTitle = document.getElementById('selected-hexagon-title');

    if (displayNumber === null) {
        // Restore placeholder state
        if (selectedHexagonTitle) {
            selectedHexagonTitle.textContent = 'Selecione o Clima';
            selectedHexagonTitle.style.fontStyle = 'normal';
        }

        // Draw placeholder hexagon
        const HEX_SIZE_SOLITARY = 40;
        const hexWidth = 2 * HEX_SIZE_SOLITARY;
        const hexHeight = Math.sqrt(3) * HEX_SIZE_SOLITARY;

        // Center in SVG (viewBox is -50 -50 100 100, so center is 0,0)
        const centerX = 0;
        const centerY = 0;

        let points = "";
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i;
            const angle_rad = Math.PI / 180 * angle_deg;
            const x = centerX + HEX_SIZE_SOLITARY * Math.cos(angle_rad);
            const y = centerY + HEX_SIZE_SOLITARY * Math.sin(angle_rad);
            points += `${x},${y} `;
        }

        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hex.setAttribute('points', points);
        hex.setAttribute('class', 'hexagon placeholder'); // Add placeholder class if needed for styling
        hex.setAttribute('stroke', '#444');
        hex.setAttribute('stroke-width', '2');
        hex.setAttribute('fill', 'transparent');
        hex.style.strokeDasharray = '5,5'; // Dashed line for placeholder

        solitarySvg.appendChild(hex);

        // Add text "?"
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', centerX);
        text.setAttribute('y', centerY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#666');
        text.setAttribute('font-size', '24');
        text.textContent = '?';
        solitarySvg.appendChild(text);

        return;
    }

    const HEX_SIZE_SOLITARY = 40; // Tamanho do hexágono solitário
    const hexWidth = 2 * HEX_SIZE_SOLITARY;
    const hexHeight = Math.sqrt(3) * HEX_SIZE_SOLITARY;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    solitarySvg.appendChild(defs);

    // Create the hexagon centered at (0,0) in the viewBox
    const x = 0;
    const y = 0;
    let points = "";
    for (let i = 0; i < 6; i++) {
        const corner = getHexCorner(x, y, HEX_SIZE_SOLITARY, i);
        points += `${corner.x},${corner.y} `;
    }

    if (displayNumber === null) {
        // Render blank placeholder
        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hex.setAttribute('points', points);
        hex.setAttribute('class', 'hexagon placeholder-hex');
        hex.setAttribute('fill', 'transparent');
        hex.setAttribute('stroke', '#ccc');
        hex.setAttribute('stroke-width', '2');
        hex.setAttribute('stroke-dasharray', '5,5'); // Dashed line
        solitarySvg.appendChild(hex);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#ccc');
        text.setAttribute('font-size', '14');
        text.textContent = "Clima";
        solitarySvg.appendChild(text);
        return;
    }

    const hexData = hexagonData[displayNumber];
    if (!hexData) return;

    if (hexData.redImage) {
        const redImageSrc = hexData.redImage;
        const blueImageSrc = hexData.blueImage;

        const patternRedId = `patternRedSolitary-${Date.now()}`;
        const patternBlueId = `patternBlueSolitary-${Date.now()}`;

        // Create patterns with objectBoundingBox
        const patternRed = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        patternRed.setAttribute('id', patternRedId);
        patternRed.setAttribute('patternContentUnits', 'objectBoundingBox');
        patternRed.setAttribute('width', '1');
        patternRed.setAttribute('height', '1');
        patternRed.setAttribute('viewBox', '0 0 1 1');
        patternRed.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        const imageRed = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        imageRed.setAttribute('href', redImageSrc);
        imageRed.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', redImageSrc);
        imageRed.setAttribute('x', '0');
        imageRed.setAttribute('y', '0');
        imageRed.setAttribute('width', '1');
        imageRed.setAttribute('height', '1');
        patternRed.appendChild(imageRed);
        defs.appendChild(patternRed);

        if (blueImageSrc) {
            const patternBlue = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            patternBlue.setAttribute('id', patternBlueId);
            patternBlue.setAttribute('patternContentUnits', 'objectBoundingBox');
            patternBlue.setAttribute('width', '1');
            patternBlue.setAttribute('height', '1');
            patternBlue.setAttribute('viewBox', '0 0 1 1');
            patternBlue.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            const imageBlue = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            imageBlue.setAttribute('href', blueImageSrc);
            imageBlue.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', blueImageSrc);
            imageBlue.setAttribute('x', '0');
            imageBlue.setAttribute('y', '0');
            imageBlue.setAttribute('width', '1');
            imageBlue.setAttribute('height', '1');
            patternBlue.appendChild(imageBlue);
            defs.appendChild(patternBlue);

            // Calculate intersection points
            const y_divide = y + hexHeight / 6;
            const intersection1 = { x: x + 5 * HEX_SIZE_SOLITARY / 6, y: y_divide };
            const intersection2 = { x: x - 5 * HEX_SIZE_SOLITARY / 6, y: y_divide };

            // Get corners
            const c0 = getHexCorner(x, y, HEX_SIZE_SOLITARY, 0);
            const c1 = getHexCorner(x, y, HEX_SIZE_SOLITARY, 1);
            const c2 = getHexCorner(x, y, HEX_SIZE_SOLITARY, 2);
            const c3 = getHexCorner(x, y, HEX_SIZE_SOLITARY, 3);
            const c4 = getHexCorner(x, y, HEX_SIZE_SOLITARY, 4);
            const c5 = getHexCorner(x, y, HEX_SIZE_SOLITARY, 5);

            // Define points for the two polygons
            const polyRed_points = `${c5.x},${c5.y} ${c4.x},${c4.y} ${c3.x},${c3.y} ${intersection2.x},${intersection2.y} ${intersection1.x},${intersection1.y} ${c0.x},${c0.y}`;
            const polyBlue_points = `${intersection1.x},${intersection1.y} ${intersection2.x},${intersection2.y} ${c2.x},${c2.y} ${c1.x},${c1.y}`;

            // Draw red polygon
            const hexRed = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hexRed.setAttribute('points', polyRed_points);
            hexRed.setAttribute('stroke', 'none');
            hexRed.setAttribute('fill', `url(#${patternRedId})`);
            solitarySvg.appendChild(hexRed);

            // Draw blue polygon
            const hexBlue = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hexBlue.setAttribute('points', polyBlue_points);
            hexBlue.setAttribute('stroke', 'none');
            hexBlue.setAttribute('fill', `url(#${patternBlueId})`);
            solitarySvg.appendChild(hexBlue);

            const hexOutline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hexOutline.setAttribute('points', points);
            hexOutline.setAttribute('class', 'hexagon');
            hexOutline.setAttribute('fill', 'transparent');
            hexOutline.setAttribute('stroke', '#333');
            hexOutline.setAttribute('stroke-width', '2');
            solitarySvg.appendChild(hexOutline);
        } else {
            const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hex.setAttribute('points', points);
            hex.setAttribute('class', 'hexagon');
            hex.setAttribute('fill', `url(#${patternRedId})`);
            hex.setAttribute('stroke', '#333');
            hex.setAttribute('stroke-width', '2');
            solitarySvg.appendChild(hex);
        }
    } else {
        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hex.setAttribute('points', points);
        hex.setAttribute('class', 'hexagon');
        hex.setAttribute('fill', 'url(#hexGradient)'); // Fallback gradient
        hex.setAttribute('stroke', '#333');
        hex.setAttribute('stroke-width', '2');
        solitarySvg.appendChild(hex);
    }
}




function highlightSelectedHexagon(targetDisplayNumber, updateMainDisplay = true) {
    const textWindow = document.getElementById('text-window');
    const selectedHexagonTitle = document.getElementById('selected-hexagon-title');

    originalTextWindowContent = (targetDisplayNumber && hexagonData[targetDisplayNumber] && hexagonData[targetDisplayNumber].text) || "";
    if (textWindow) {
        textWindow.innerHTML = originalTextWindowContent;
    }

    if (selectedHexagonTitle) {
        const titleMatch = originalTextWindowContent.match(/<b>(.*?)<\/b>/);
        selectedHexagonTitle.innerHTML = titleMatch ? titleMatch[1] : 'Selecione o Clima';
    }

    // Remove highlight from all hexagons
    const allHexagons = document.querySelectorAll('.hexagon');
    allHexagons.forEach(hex => {
        hex.classList.remove('selected-modal-hex');
    });

    // Add highlight to target hexagon(s)
    // Add highlight to target hexagon(s)
    if (targetDisplayNumber) {
        const targetGroups = document.querySelectorAll(`.hex-group[data-display-number="${targetDisplayNumber}"]`);
        targetGroups.forEach(group => {
            // Bring to front by moving the group to the end of the parent container
            if (group.parentNode) {
                group.parentNode.appendChild(group);
            }
            // Add highlight class to parts inside
            const hex = group.querySelector('.hexagon');
            if (hex) {
                hex.classList.add('selected-modal-hex');
            }
        });
    }

    const temperatureTable = document.getElementById('temperature-table');
    if (temperatureTable && updateMainDisplay) {
        const selectedRow = temperatureTable.querySelector('tr.selected');
        if (selectedRow) {
            updateTextWithTemperature(selectedRow);
        }
    }
}

function renderGrid() {
    const modalMapContainer = document.getElementById('modal-map-container');
    modalMapContainer.innerHTML = `
                <h2>Hexflower de Temperatura</h2>
                <h3>Cresceoutono</h3>
                <div id="map-container">
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" id="toggle-numbers">
                            <span class="slider round"></span>
                        </label>
                        <label for="toggle-numbers">Mostrar/Ocultar Números</label>
                    </div>
                    <svg id="grid-svg" viewBox="0 0 800 600"></svg>
                </div>`;

    const svg = document.getElementById('grid-svg');
    const toggleNumbers = document.getElementById('toggle-numbers');
    svg.innerHTML = ''; // Limpa a grade antiga

    const hexWidth = 2 * HEX_SIZE;
    const hexHeight = Math.sqrt(3) * HEX_SIZE;
    const gridTotalWidth = GRID_WIDTH * hexWidth * 0.75 + hexWidth * 0.25;
    const gridTotalHeight = GRID_HEIGHT * hexHeight + hexHeight / 2;

    const offsetX = (800 - gridTotalWidth) / 2;
    const offsetY = (600 - gridTotalHeight) / 2;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'hexGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '66.66%');
    stop1.setAttribute('stop-color', 'red');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '66.66%');
    stop2.setAttribute('stop-color', 'blue');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);

    for (const hexId in hexagonData) {
        const hexData = hexagonData[hexId];
        if (hexData.visible === false) continue;
        if (hexData.blocked) {
            createHexagon(svg, hexData.q, hexData.r, hexWidth, hexHeight, offsetX, offsetY, defs, hexData.text, false, hexData.redImage);
        }
    }

    const removedHexagons = [1, 5, 21, 22, 24, 25];
    let displayNumber = 1;
    for (let hexNumber = 1; hexNumber <= GRID_WIDTH * GRID_HEIGHT; hexNumber++) {
        if (removedHexagons.includes(hexNumber)) {
            continue;
        }

        const q = (hexNumber - 1) % GRID_WIDTH;
        const r = Math.floor((hexNumber - 1) / GRID_WIDTH);

        const x = hexWidth * q * 0.75 + hexWidth / 2 + offsetX;
        const y = hexHeight * r + (q % 2) * (hexHeight / 2) + hexHeight / 2 + offsetY;

        let points = "";
        for (let i = 0; i < 6; i++) {
            const corner = getHexCorner(x, y, HEX_SIZE, i);
            points += `${corner.x},${corner.y} `;
        }

        // Create group
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'hex-group');
        group.dataset.displayNumber = displayNumber;
        group.dataset.r = r;

        // 1. Background Polygon (for hover effect)
        const hexBg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hexBg.setAttribute('points', points);
        hexBg.setAttribute('class', 'hex-bg');
        hexBg.setAttribute('stroke', 'none');
        group.appendChild(hexBg);

        const hexData = hexagonData[displayNumber];

        if (hexData && hexData.redImage) {
            const redImageSrc = hexData.redImage;
            const blueImageSrc = hexData.blueImage;

            const patternRedId = `patternRed-${displayNumber}-${Date.now()}`;
            const patternBlueId = `patternBlue-${displayNumber}-${Date.now()}`;

            // Create patterns with objectBoundingBox
            const patternRed = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            patternRed.setAttribute('id', patternRedId);
            patternRed.setAttribute('patternContentUnits', 'objectBoundingBox');
            patternRed.setAttribute('width', '1');
            patternRed.setAttribute('height', '1');
            patternRed.setAttribute('viewBox', '-50 -50 100 100');
            patternRed.setAttribute('preserveAspectRatio', 'xMidYMid meet');

            const imageRed = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            imageRed.setAttribute('href', redImageSrc);
            imageRed.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', redImageSrc);
            imageRed.setAttribute('x', '-50');
            imageRed.setAttribute('y', '-50');
            imageRed.setAttribute('width', '100');
            imageRed.setAttribute('height', '100');
            patternRed.appendChild(imageRed);
            defs.appendChild(patternRed);

            if (blueImageSrc) {
                const patternBlue = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                patternBlue.setAttribute('id', patternBlueId);
                patternBlue.setAttribute('patternContentUnits', 'objectBoundingBox');
                patternBlue.setAttribute('width', '1');
                patternBlue.setAttribute('height', '1');
                patternBlue.setAttribute('viewBox', '-50 -50 100 100');
                patternBlue.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                const imageBlue = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                imageBlue.setAttribute('href', blueImageSrc);
                imageBlue.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', blueImageSrc);
                imageBlue.setAttribute('x', '-50');
                imageBlue.setAttribute('y', '-50');
                imageBlue.setAttribute('width', '100');
                imageBlue.setAttribute('height', '100');
                patternBlue.appendChild(imageBlue);
                defs.appendChild(patternBlue);

                // Calculate intersection points
                const y_divide = y + hexHeight / 6;
                const intersection1 = { x: x + 5 * HEX_SIZE / 6, y: y_divide };
                const intersection2 = { x: x - 5 * HEX_SIZE / 6, y: y_divide };

                // Get corners
                const c0 = getHexCorner(x, y, HEX_SIZE, 0);
                const c1 = getHexCorner(x, y, HEX_SIZE, 1);
                const c2 = getHexCorner(x, y, HEX_SIZE, 2);
                const c3 = getHexCorner(x, y, HEX_SIZE, 3);
                const c4 = getHexCorner(x, y, HEX_SIZE, 4);
                const c5 = getHexCorner(x, y, HEX_SIZE, 5);

                // Define points for the two polygons
                const polyRed_points = `${c5.x},${c5.y} ${c4.x},${c4.y} ${c3.x},${c3.y} ${intersection2.x},${intersection2.y} ${intersection1.x},${intersection1.y} ${c0.x},${c0.y}`;
                const polyBlue_points = `${intersection1.x},${intersection1.y} ${intersection2.x},${intersection2.y} ${c2.x},${c2.y} ${c1.x},${c1.y}`;

                // Draw red polygon
                const hexRed = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                hexRed.setAttribute('points', polyRed_points);
                hexRed.setAttribute('stroke', 'none');
                hexRed.setAttribute('fill', `url(#${patternRedId})`);
                hexRed.style.pointerEvents = 'none';
                group.appendChild(hexRed);

                // Draw blue polygon
                const hexBlue = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                hexBlue.setAttribute('points', polyBlue_points);
                hexBlue.setAttribute('stroke', 'none');
                hexBlue.setAttribute('fill', `url(#${patternBlueId})`);
                hexBlue.style.pointerEvents = 'none';
                group.appendChild(hexBlue);

                const hexOutline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                hexOutline.setAttribute('points', points);
                hexOutline.setAttribute('class', 'hexagon');
                hexOutline.setAttribute('fill', 'transparent');
                hexOutline.setAttribute('stroke', '#333');
                hexOutline.setAttribute('stroke-width', '2');
                hexOutline.dataset.displayNumber = displayNumber;
                group.appendChild(hexOutline);
            } else {
                const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                hex.setAttribute('points', points);
                hex.setAttribute('class', 'hexagon');
                hex.setAttribute('fill', `url(#${patternRedId})`);
                hex.setAttribute('stroke', '#333');
                hex.setAttribute('stroke-width', '2');
                hex.dataset.displayNumber = displayNumber;
                group.appendChild(hex);
            }
        } else {
            const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hex.setAttribute('points', points);
            hex.setAttribute('class', 'hexagon');
            hex.dataset.r = r;
            hex.dataset.displayNumber = displayNumber;

            if (displayNumber === 1 || displayNumber === 2) {
                hex.setAttribute('fill', 'red');
            } else {
                hex.setAttribute('fill', 'url(#hexGradient)');
            }
            group.appendChild(hex);
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '20');
        text.setAttribute('class', 'hex-text');
        if (!toggleNumbers.checked) {
            text.classList.add('hidden');
        }

        text.textContent = displayNumber++;
        group.appendChild(text);

        svg.appendChild(group);
    }

    toggleNumbers.addEventListener('change', () => {
        const texts = svg.querySelectorAll('.hex-text');
        texts.forEach(text => {
            text.classList.toggle('hidden', !toggleNumbers.checked);
        });
    });
}

// --- EXECUÇÃO INICIAL ---

function selectHexagon(displayNumber) {
    currentSelectedHexagon = displayNumber;
    renderSelectedHexagon(displayNumber);
    renderWeatherNavigation('3N'); // Reset nav selection and order on new hex selection
    updateTemperatureTable(); // Update table header with modifier
    updateInfoDisplay("✥ Além do hexagono de clima é preciso selecionar uma opção na tabela de Temperatura."); // Prompt for temperature

    const resultDisplay = document.getElementById('dice-result-temp');
    if (resultDisplay) resultDisplay.innerHTML = '';

    // Clear temperature table selection
    const temperatureTable = document.getElementById('temperature-table');
    if (temperatureTable) {
        // Reset lock state
        temperatureTable.classList.remove('locked');

        const rows = temperatureTable.querySelectorAll('tr.selected-row');
        rows.forEach(r => r.classList.remove('selected-row'));
        selectedTemperatureRowIndex = null;

        // Special logic for Hex 1 and 2
        // Wait, did user want this? Existing code had it. I'll keep it but use new class.
        if (displayNumber === 1 || displayNumber === 2) {
            const tableRows = temperatureTable.getElementsByTagName('tr');
            if (tableRows.length >= 4) { // Ensure row exists
                const targetRow = tableRows[3]; // 4th row (0-indexed)
                targetRow.classList.add('selected-row');
                selectedTemperatureRowIndex = 3;
                updateTextWithTemperature(targetRow);
                temperatureTable.classList.add('locked');
            }
        }
    }

    const textWindow = document.getElementById('text-window');
    if (textWindow) {
        textWindow.classList.add('fade-out');
        setTimeout(() => {
            highlightSelectedHexagon(displayNumber);
            textWindow.classList.remove('fade-out');
        }, 300);
    } else {
        highlightSelectedHexagon(displayNumber);
    }

    // Update current day weather
    if (calendarData.length > 0) {
        const currentDay = calendarData[gameState.currentDayIndex];
        // Always update weather directly to enable instant preview
        currentDay.weather = hexagonData[displayNumber];

        // Refresh the display immediately
        showDayDetails(currentDay);
    }

    updateTravelButtonState(); // Check if we can enable buttons
}

function initializeModal() {
    const modal = document.getElementById('hexagon-modal');
    const closeButton = modal.querySelector('.close-button');

    function openModal() {
        modal.style.display = 'block';
        renderGrid();
        renderWeatherNavigation('3N'); // Reset nav selection and order on modal open
        highlightSelectedHexagon(currentSelectedHexagon, false); // Suppress main display update

        if (selectedTemperatureRowIndex !== null) {
            const temperatureTable = document.getElementById('temperature-table');
            const rowToSelect = temperatureTable.getElementsByTagName('tr')[selectedTemperatureRowIndex];
            if (rowToSelect) {
                rowToSelect.classList.add('selected');
                // updateTextWithTemperature(rowToSelect); // Suppressed on open
            }
        } else if (currentSelectedHexagon === 1 || currentSelectedHexagon === 2) {
            const temperatureTable = document.getElementById('temperature-table');
            const fourthRow = temperatureTable.getElementsByTagName('tr')[3];
            if (fourthRow) {
                fourthRow.classList.add('selected');
                // updateTextWithTemperature(fourthRow); // Suppressed on open
                temperatureTable.classList.add('locked');
            }
        }

        const modalMapContainer = document.getElementById('modal-map-container');
        if (modalMapContainer) {
            modalMapContainer.addEventListener('click', (e) => {
                const target = e.target;
                const hexGroup = target.closest('.hex-group');
                if (hexGroup) {
                    const displayNumber = parseInt(hexGroup.dataset.displayNumber);
                    if (!isNaN(displayNumber)) {
                        selectHexagon(displayNumber);
                    }
                }
            });
        }
    }

    function closeModal() {
        // selectedTemperatureRowIndex = null; // Persist selection
        modal.style.display = 'none';
        const modalMapContainer = document.getElementById('modal-map-container');
        modalMapContainer.innerHTML = ''; // Limpa o conteúdo do mapa ao fechar
    }

    selectedHexagonContainer.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    const temperatureTable = document.getElementById('temperature-table');
    temperatureTable.addEventListener('click', (e) => {
        if (temperatureTable.classList.contains('locked')) {
            return;
        }
        const targetRow = e.target.closest('tr');
        if (targetRow && targetRow.rowIndex !== 0) {
            const rows = temperatureTable.querySelectorAll('tr.selected-row');
            rows.forEach(r => r.classList.remove('selected-row'));
            targetRow.classList.add('selected-row');
            selectedTemperatureRowIndex = targetRow.rowIndex;
            updateTextWithTemperature(targetRow);
        }
    });
}

function getTerrainName(imageName) {
    const terrainMap = {
        'montanhasAltas.png': 'Montanhas Altas',
        'planicie.png': 'Planície',
        'charco.png': 'Charco',
        'montanhas.png': 'Montanhas',
        'colinas.png': 'Colinas',
        'pantano.png': 'Pantano',
        'floresta.png': 'Floresta',
        'florestaSombria.png': 'Floresta Sombria',
        'ruinas.png': 'Ruínas',
        'lagoRio.png': 'Lago ou Rio'
    };
    return terrainMap[imageName] || imageName.split('.')[0];
}

function initializeTerrainModal() {
    const terrainModal = document.getElementById('terrain-modal');
    const selectedTerrain = document.getElementById('selected-terrain');
    const terrainGrid = document.getElementById('terrain-grid');
    const closeButton = terrainModal.querySelector('.close-button');
    const mainTerrainImage = selectedTerrain.querySelector('img');
    const terrainPlaceholder = document.getElementById('terrain-placeholder');

    const terrainImages = [
        'charco.png', 'colinas.png', 'floresta.png', 'florestaSombria.png',
        'lagoRio.png', 'montanhas.png', 'montanhasAltas.png', 'pantano.png',
        'planicie.png', 'ruinas.png'
    ];

    // Populate grid
    terrainImages.forEach(imageName => {
        const terrainContainer = document.createElement('div');
        terrainContainer.classList.add('terrain-item');

        const img = document.createElement('img');
        img.src = `img/terrain/${imageName}`;
        const terrainName = getTerrainName(imageName);
        img.alt = terrainName;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = terrainName;

        terrainContainer.appendChild(img);
        terrainContainer.appendChild(nameSpan);
        terrainGrid.appendChild(terrainContainer);

        terrainContainer.addEventListener('click', () => {
            // Logic for selecting terrain
            const terrainData = {
                name: getTerrainName(imageName),
                image: `img/terrain/${imageName}`,
                info: terrainInfo[getTerrainName(imageName)]
            };

            currentSelectedTerrainData = terrainData;

            // Removed ad-hoc button enabling here, handled by updateTravelButtonState

            // Update UI
            mainTerrainImage.src = img.src;
            mainTerrainImage.alt = img.alt;
            mainTerrainImage.style.display = 'block';
            if (terrainPlaceholder) terrainPlaceholder.style.display = 'none';
            const terrainTitle = document.getElementById('selected-terrain-title');
            if (terrainTitle) {
                terrainTitle.textContent = img.alt;
            }

            const terrainName = getTerrainName(imageName);
            selectedTerrainInfo = terrainInfo[terrainName] || '';

            // If we were waiting for selection (Desbravar), record it and advance
            if (gameState.waitingForTerrainSelection) {
                // We don't record immediately here anymore, we just set the data
                // The user needs to click Desbravar again or we can trigger it?
                // Actually, the previous logic was: Click Desbravar -> Select Terrain -> Record & Advance
                // New logic: Select Terrain -> Click Desbravar -> Record (maybe multiple) -> Advance

                // However, if we are in "waitingForTerrainSelection" state, it means the user clicked Desbravar WITHOUT a terrain.
                // So now that they selected one, we should probably execute the Desbravar action they intended.
                gameState.waitingForTerrainSelection = false;
                handleDesbravar(); // Retry the action
            }

            const temperatureTable = document.getElementById('temperature-table');
            if (temperatureTable) {
                const selectedRow = temperatureTable.querySelector('tr.selected');
                if (selectedRow) {
                    updateTextWithTemperature(selectedRow);
                } else {
                    updateInfoDisplay("");
                }
            } else {
                updateInfoDisplay("");
            }

            updateTravelButtonState(); // Check if we can enable buttons
            closeModal();
        });
    });

    function openModal() {
        terrainModal.style.display = 'block';
    }

    function closeModal() {
        terrainModal.style.display = 'none';
    }

    selectedTerrain.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == terrainModal) {
            closeModal();
        }
    });
}

function setupCalendarModal() {
    const modal = document.getElementById('calendar-modal');
    const btn = document.getElementById('current-day-display');
    const span = modal.querySelector('.close-button');
    const grid = document.getElementById('calendar-grid');
    const details = document.getElementById('day-details');

    btn.onclick = function () {
        if (calendarData.length === 0) {
            const startModal = document.getElementById('start-game-modal');
            startModal.style.display = "block";
        } else {
            modal.style.display = "block";
            renderCalendarGrid();
        }
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function renderCalendarGrid() {
        grid.innerHTML = '';
        calendarData.forEach((day, index) => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day-item';
            if (index === gameState.currentDayIndex) dayEl.classList.add('selected');

            const weatherIcon = day.weather ? (day.weather.redImage || day.weather.blueImage) : null;
            let weatherHtml = '';
            if (weatherIcon) {
                // Simple representation
                // weatherHtml = `<img src="${weatherIcon}" style="width:20px; height:20px;">`;
            }

            dayEl.innerHTML = `<div>${day.dayInMonth}/${day.month.substring(0, 3)}</div>${weatherHtml}`;
            dayEl.onclick = () => showDayDetails(day);
            grid.appendChild(dayEl);
        });

        // Show current day details by default
        if (calendarData.length > 0) {
            showDayDetails(calendarData[gameState.currentDayIndex]);
        }
    }
}

function showDayDetails(day) {
    const detailsModal = document.getElementById('day-details');
    const detailsMain = document.getElementById('day-details-main');

    let html = `<h3>${day.dayInMonth} de ${day.month} de ${day.year}</h3>`;
    if (day.weather) {
        const redTitle = getImageTitle(day.weather.redImage);
        const blueTitle = getImageTitle(day.weather.blueImage);
        let weatherName = redTitle;
        if (blueTitle) weatherName += ` e ${blueTitle}`;

        html += `<div class="weather-detail">
            <p><strong>Clima:</strong> ${weatherName}</p>
            <div class="weather-images">
                ${day.weather.redImage ? `<img src="${day.weather.redImage}" alt="${redTitle}">` : ''}
                ${day.weather.blueImage ? `<img src="${day.weather.blueImage}" alt="${blueTitle}">` : ''}
            </div>
        </div>`;
    } else {
        html += `<p><strong>Clima:</strong> Não selecionado</p>`;
    }

    day.quarters.forEach((q, qIdx) => {
        const lighting = day.lighting[qIdx];
        html += `<div class="quarter-detail">
                    <div class="quarter-title">${q.name} (${lighting})</div>`;

        if (q.actions.length === 0) {
            html += `<div class="slot-detail"><span>-</span></div>`;
        } else {
            q.actions.forEach((action, idx) => {
                const verb = action.action === 'Desbravar' ? 'Desbravou' :
                    action.action === 'Permanecer' ? 'Permaneceu' : action.action;

                html += `<div class="slot-detail">
                            <span>${verb}:</span>
                            <img src="${action.image}" alt="${action.name}">
                            <span>${action.name}</span>
                        </div>`;
            });
        }
        html += `</div>`;
    });

    // Update both containers if they exist
    if (detailsModal) detailsModal.innerHTML = html;
    if (detailsMain) detailsMain.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
    selectHexagon(currentSelectedHexagon);
    initializeTerrainModal();
    initializeCalendar();
    updateTemperatureTable();
    initializeDiceRollerTemp();
});

function setupStartGameModal() {
    const modal = document.getElementById('start-game-modal');
    const closeButton = modal.querySelector('.close-button');
    const btnStart = document.getElementById('btn-start-game');
    const selectMonth = document.getElementById('start-month');
    const inputDay = document.getElementById('start-day');

    // Populate months
    CALENDAR_CONFIG.months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month.name;
        selectMonth.appendChild(option);
    });

    closeButton.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    btnStart.onclick = function () {
        const monthIndex = parseInt(selectMonth.value);
        const day = parseInt(inputDay.value);
        const monthData = CALENDAR_CONFIG.months[monthIndex];

        if (day < 1 || day > monthData.days) {
            alert(`Dia inválido para ${monthData.name}. Escolha entre 1 e ${monthData.days}.`);
            return;
        }

        // Set initial state
        gameState.currentMonthIndex = monthIndex;
        gameState.currentDayInMonth = day - 1; // startNewDay increments this, so we set to day-1

        startNewDay(false);
        renderCalendar();
        modal.style.display = "none";
    }
}






function renderWeatherNavigation(selectedHexName = '3N') {
    const svg = document.getElementById('weather-nav-svg');
    if (!svg) return;

    svg.innerHTML = ''; // Clear

    const HEX_SIZE_NAV = 25;
    const GRID_WIDTH_NAV = 3;
    const GRID_HEIGHT_NAV = 3;

    const hexWidth = 2 * HEX_SIZE_NAV;
    const hexHeight = Math.sqrt(3) * HEX_SIZE_NAV;

    const gridTotalWidth = GRID_WIDTH_NAV * hexWidth * 0.75 + hexWidth * 0.25;
    const gridTotalHeight = GRID_HEIGHT_NAV * hexHeight + hexHeight / 2;

    const offsetX = (200 - gridTotalWidth) / 2;
    const offsetY = (200 - gridTotalHeight) / 2;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    let hexConfig = [
        { name: '1N', label: '2, 12', q: 1, r: 0 },
        { name: '2N', label: '3, 4', q: 0, r: 1 },
        { name: '3N', label: 'Atual', q: 1, r: 1 },
        { name: '4N', label: '5, 6', q: 2, r: 1 },
        { name: '5N', label: '9, 10', q: 0, r: 2 },
        { name: '6N', label: '11', q: 1, r: 2 },
        { name: '7N', label: '7, 8', q: 2, r: 2 }
    ];

    if (selectedHexName) {
        const selectedIndex = hexConfig.findIndex(h => h.name === selectedHexName);
        if (selectedIndex > -1) {
            const selectedHex = hexConfig.splice(selectedIndex, 1)[0];
            hexConfig.push(selectedHex);
        }
    }

    hexConfig.forEach(hex => {
        createHexagon(svg, hex.q, hex.r, hexWidth, hexHeight, offsetX, offsetY, defs, hex.label, true, null, HEX_SIZE_NAV);
        // Add data attribute to the last created group for potential identification
        const lastGroup = svg.lastElementChild;
        if (lastGroup.classList.contains('hex-group')) {
            lastGroup.dataset.navName = hex.name;
            if (hex.name === selectedHexName) {
                lastGroup.classList.add('selected-nav-hex');
            }
        }
    });

    svg.onclick = (e) => {
        const group = e.target.closest('.hex-group');
        if (!group) return;

        const navName = group.dataset.navName;
        renderWeatherNavigation(navName);
    };

    initializeDiceRoller();
}



function initializeDiceRoller() {
    const die1 = document.getElementById('die-1');
    const die2 = document.getElementById('die-2');
    const btnRoll = document.getElementById('btn-roll-nav');
    const resultDisplay = document.getElementById('dice-result-nav');

    if (!die1 || !die2 || !btnRoll) return;

    // Clear existing content
    // Clear existing content only if empty (optional, or just don't reset)
    if (!die1.textContent) die1.textContent = '1';
    if (!die2.textContent) die2.textContent = '1';

    // Remove old event listeners to prevent duplicates (cloning is a simple way)
    const newBtn = btnRoll.cloneNode(true);
    btnRoll.parentNode.replaceChild(newBtn, btnRoll);

    newBtn.addEventListener('click', () => {
        // Animation
        die1.classList.add('shake');
        die2.classList.add('shake');
        let counter = 0;
        const interval = setInterval(() => {
            const r1 = Math.floor(Math.random() * 6) + 1;
            const r2 = Math.floor(Math.random() * 6) + 1;
            die1.textContent = r1;
            die2.textContent = r2;
            counter++;
            if (counter > 10) {
                clearInterval(interval);
                die1.classList.remove('shake');
                die2.classList.remove('shake');
                finalRoll(die1, die2);
            }
        }, 50);
    });

    function finalRoll(d1, d2) {
        const array = new Uint32Array(2);
        crypto.getRandomValues(array);
        const r1 = (array[0] % 6) + 1;
        const r2 = (array[1] % 6) + 1;
        const sum = r1 + r2;

        d1.textContent = r1;
        d2.textContent = r2;

        // Logic for Hexagon 2 Blocking (Top Edge)
        // Blocked sums: 2, 3, 4, 5, 6, 12
        const blockedSums = [2, 3, 4, 5, 6, 12];
        if (currentSelectedHexagon === 2 && blockedSums.includes(sum)) {
            if (resultDisplay) {
                // Using HTML to bold the warning if needed, or just text
                resultDisplay.innerHTML = `Resultado: ${sum} <span style="color:var(--col-accent-warm)">BLOQUEADO</span>`;
            }
            renderWeatherNavigation('3N');
        }

        // Logic for Hexagon 19 Blocking (Bottom Edge)
        if (currentSelectedHexagon === 19 && sum === 11) {
            if (resultDisplay) {
                resultDisplay.innerHTML = `Resultado: ${sum} <span style="color:var(--col-accent-warm)">BLOQUEADO</span>`;
            }
            renderWeatherNavigation('3N');
            return;
        }

        if (resultDisplay) resultDisplay.textContent = `Resultado: ${sum}`;

        selectHexagonBySum(sum);
    }
}

function selectHexagonBySum(sum) {
    const svg = document.getElementById('weather-nav-svg');
    if (!svg) return;

    const allGroups = svg.querySelectorAll('.hex-group');
    let targetNavName = null;

    allGroups.forEach(group => {
        const textElement = group.querySelector('text');
        if (textElement) {
            const labelText = textElement.textContent;
            // Split by comma and trim
            const numbers = labelText.split(',').map(s => s.trim());
            if (numbers.includes(sum.toString())) {
                targetNavName = group.dataset.navName;
            }
        }
    });

    if (targetNavName) {
        renderWeatherNavigation(targetNavName);
    }
}


function getTemperatureModifier() {
    if (currentSelectedHexagon === null) return 0;
    if (typeof hexagonData === 'undefined' || !hexagonData[currentSelectedHexagon]) return 0;

    const currentMonthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
    if (HOT_MONTHS.includes(currentMonthName)) {
        return hexagonData[currentSelectedHexagon].temperatureModHot || 0;
    } else {
        return hexagonData[currentSelectedHexagon].temperatureModCold || 0;
    }
}

function updateTemperatureTable() {
    const currentMonthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
    const table = document.getElementById('temperature-table');
    if (!table) return;

    const mod = getTemperatureModifier();
    let modString = '';
    if (mod !== 0) {
        const sign = mod > 0 ? '+' : '';
        modString = ` <span style="color:var(--col-accent-deep)">(${sign}${mod})</span>`;
    }

    let html = '';

    if (HOT_MONTHS.includes(currentMonthName)) {
        html = `
            <tr>
                <td>d12${modString}</td>
                <td>Calor (MESES QUENTES)</td>
            </tr>
            <tr>
                <td>1 - 8</td>
                <td><b>Ameno</b>. Sem alterações.</td>
            </tr>
            <tr>
                <td>9 - 11</td>
                <td><b>Calor</b>. Água precisa ser consumida em cada Quarto de Dia para ficar DESIDRATADO.</td>
            </tr>
            <tr>
                <td>12</td>
                <td><b>Escaldante</b>. Água precisa ser consumida em cada Quarto de Dia para não ficar DESIDRATADO. Personagens usando armadura precisam fazer uma rolagem de Resiliência em cada Quarto de Dia, falha significa -1 de AGILIDADE.</td>
            </tr>
        `;
    } else {
        html = `
            <tr>
                <td>d12${modString}</td>
                <td>Frio (MESES FRIOS)</td>
            </tr>
            <tr>
                <td>1 - 8</td>
                <td><b>Ameno</b>. Sem alterações.</td>
            </tr>
            <tr>
                <td>9 - 11</td>
                <td><b>Frio</b>. Se não tiver proteção adequada, role RESILIÊNCIA em cada Quarto de dia para não ficar HIPOTÉRMICO.</td>
            </tr>
            <tr>
                <td>12</td>
                <td><b>Cortante</b>. Se não tiver proteção adequada, role RESILIÊNCIA em cada <u>hora</u> do dia para não ficar HIPOTÉRMICO.</td>
            </tr>
        `;
    }

    table.innerHTML = html;
}

function initializeDiceRollerTemp() {
    const die = document.getElementById('die-d12');
    const dieNumber = die ? die.querySelector('.die-number') : null;
    const btnRoll = document.getElementById('btn-roll-temp');
    const resultDisplay = document.getElementById('dice-result-temp');

    if (!die || !dieNumber || !btnRoll) return;

    // Reset content if empty
    if (!dieNumber.textContent) dieNumber.textContent = '1';

    // Remove old event listeners
    const newBtn = btnRoll.cloneNode(true);
    btnRoll.parentNode.replaceChild(newBtn, btnRoll);

    newBtn.addEventListener('click', () => {
        die.classList.add('shake');
        let counter = 0;
        const interval = setInterval(() => {
            const r = Math.floor(Math.random() * 12) + 1;
            dieNumber.textContent = r;
            counter++;
            if (counter > 10) {
                clearInterval(interval);
                die.classList.remove('shake');
                const array = new Uint32Array(1);
                crypto.getRandomValues(array);
                const rFinal = (array[0] % 12) + 1;
                dieNumber.textContent = rFinal;
                finalRoll(dieNumber, rFinal);
            }
        }, 50);
    });

    function finalRoll(numberSpan, r) {
        // Calculate Total with Modifier
        const mod = getTemperatureModifier();
        const total = r + mod;

        if (resultDisplay) {
            const sign = mod >= 0 ? '+' : '';
            resultDisplay.innerHTML = `Resultado: ${total} <span style="color:var(--col-accent-deep)">(${r} ${sign}${mod})</span>`;
        }

        // Highlight Temperature Table Row
        const table = document.getElementById('temperature-table');
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => row.classList.remove('selected-row'));

            let rowIndex = -1;
            if (total <= 8) {
                rowIndex = 1; // 2nd row
            } else if (total >= 9 && total <= 11) {
                rowIndex = 2; // 3rd row
            } else if (total >= 12) {
                rowIndex = 3; // 4th row
            }

            if (rowIndex > -1 && rows[rowIndex]) {
                rows[rowIndex].classList.add('selected-row');
                updateTextWithTemperature(rows[rowIndex]);
            }
        }
    }
}
