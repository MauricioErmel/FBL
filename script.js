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
    'Montanhas Altas': '✥ Intransponível<br>✥ Não é possível COLETAR ou CAÇAR',
    'Lago ou Rio': '✥ Requer um barco ou balsa<br>✥ Não é possível COLETAR',
    'Pantano': '✥ Requer uma balsa<br>✥ +1 em rolagens de COLETAR<br>✥ -1 em rolagens de CAÇAR',
    'Charco': '✥ Terreno dificultoso, é possível trafegar 1 hexágono por Quarto de Dia<br>✥ -1 em rolagens de COLETAR',
    'Ruínas': '✥ Terreno dificultoso, é possível trafegar 1 hexágono por Quarto de Dia<br>✥ -2 em rolagens de COLETAR<br>✥ -1 em rolagens de CAÇAR'
};

// --- INICIALIZAÇÃO ---
const solitarySvg = document.getElementById('solitary-hexagon-svg');
const solitaryTerrainSvg = document.getElementById('solitary-terrain-svg');
const selectedHexagonContainer = document.getElementById('selected-hexweather-container');
let originalTextWindowContent = '';
let currentSelectedHexagon = null; // Default selected hexagon is now null
let selectedTemperatureRowIndex = null;
let selectedTerrainInfo = '';
let currentSelectedTerrainData = null;

const CALENDAR_CONFIG = {
    startYear: 1165,
    months: [
        { name: 'Cresceprimavera', image: 'img/months/cresceprimavera.webp', days: 45, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguaprimavera', image: 'img/months/minguaprimavera.webp', days: 46, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceverão', image: 'img/months/cresceverao.webp', days: 45, lighting: ['Claro', 'Claro', 'Claro', 'Escuro'] },
        { name: 'Minguaverão', image: 'img/months/minguaverao.webp', days: 46, lighting: ['Claro', 'Claro', 'Claro', 'Escuro'] },
        { name: 'Cresceoutono', image: 'img/months/cresceoutono.webp', days: 45, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguaoutono', image: 'img/months/minguaoutono.webp', days: 46, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceinverno', image: 'img/months/cresceinverno.webp', days: 45, lighting: ['Escuro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguainverno', image: 'img/months/minguainverno.webp', days: 46, lighting: ['Escuro', 'Claro', 'Escuro', 'Escuro'] }
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

let isOnboarding = false; // Flag to track onboarding state
let onboardingStep = 0; // 0: None, 1: Date Selected (Weather Next), 2: Weather Selected (Terrain Next)

function initializeCalendar() {
    // Start Day 1 - REMOVED to show placeholder
    // startNewDay();
    updateInfoDisplay('✥ Para iniciar um registro é preciso que o clima, o terreno, o mês e o dia estejam selecionados abaixo.');
    // renderCalendar(); // Don't render yet, keep placeholder
    setupTravelControls();
    setupCalendarModal();
    setupStartGameModal();
    setupInfoModal();
    setupGeneralInfoModal();
    updateTravelButtonState(); // Initial check
    updateTravelButtonState(); // Initial check
    renderWeatherNavigation();
    renderSelectedTerrain(null); // Initialize terrain placeholder
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

    if (typeof updateActiveHexagonData === 'function') {
        updateActiveHexagonData(CALENDAR_CONFIG.months[gameState.currentMonthIndex].name);
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
        journal: [],
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

    // Update index to point to the new day
    gameState.currentDayIndex = calendarData.length - 1;
    gameState.currentQuarterIndex = 0;
    gameState.currentActionCount = 0;

    // Reset Weather Selection
    if (resetWeather) {
        renderSelectedHexagon(null);
        updateInfoDisplay("");
    } else {
        // preserve info if needed
        if (typeof currentInfoMessage !== 'undefined') {
            updateInfoDisplay(currentInfoMessage);
        }
    }

    updateTravelButtonState();

    // Update Journal UI
    const journalSection = document.getElementById('journal-section');
    const journalEditor = document.getElementById('journal-editor');
    if (journalSection) journalSection.style.display = 'block';
    if (journalEditor) journalEditor.innerHTML = '';

    // Sync dropdown
    const selectQuarter = document.getElementById('journal-quarter-select');
    if (selectQuarter) {
        selectQuarter.value = gameState.currentQuarterIndex;
    }

    renderJournalEntries();
    updateTemperatureTable();
    autoSave();
}

function renderCalendar() {
    const currentDayDisplay = document.getElementById('current-day-display');

    if (calendarData.length === 0) return; // Don't render if not started

    const day = calendarData[gameState.currentDayIndex];
    const quarterName = QUARTERS[gameState.currentQuarterIndex];

    // Get lighting for current quarter
    const lighting = day.lighting[gameState.currentQuarterIndex];

    if (currentDayDisplay) {
        currentDayDisplay.innerHTML = `${day.dayInMonth} de ${day.month} de ${day.year} - ${quarterName} (${lighting})`;
        currentDayDisplay.classList.remove('has-reset-btn');


    }

    // Update main day details view
    if (typeof showDayDetails === 'function') {
        showDayDetails(day);
    }

    // Refresh info display (to update lighting based on new quarter)
    if (typeof updateInfoDisplay === 'function' && typeof currentInfoMessage !== 'undefined') {
        updateInfoDisplay(currentInfoMessage);
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

    // Open Modal and focus on Weather Navigation
    if (typeof startDayWeatherModal === 'function') {
        const modal = document.getElementById('hexagon-modal');
        if (modal) modal.dataset.preventClose = "true";

        startDayWeatherModal();
        setTimeout(() => {
            const weatherNav = document.getElementById('weather-navigation');
            if (weatherNav) {
                weatherNav.scrollIntoView({ behavior: 'smooth', block: 'center' });
                weatherNav.classList.add('flash-highlight');
                weatherNav.classList.add('awaiting-roll');

                setTimeout(() => {
                    weatherNav.classList.remove('flash-highlight');
                }, 1500);
            }
        }, 300); // Slight delay to ensure modal render
    }
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

    const journalSection = document.getElementById('journal-section');
    if (journalSection) {
        if (isGameStarted) {
            journalSection.classList.remove('disabled');
        } else {
            journalSection.classList.add('disabled');
        }
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
        renderSelectedTerrain(null);
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
    autoSave();
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
    autoSave();
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

    // Sync dropdown
    const selectQuarter = document.getElementById('journal-quarter-select');
    if (selectQuarter && gameState.currentQuarterIndex < QUARTERS.length) {
        selectQuarter.value = gameState.currentQuarterIndex;
    }

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
    autoSave();
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
    const infoDisplay = document.getElementById('info-display-text');
    if (infoDisplay) {
        currentInfoMessage = content; // Store the base message

        // --- PRE-CLEAN INPUT CONTENT ---
        // If content comes from updateTextWithTemperature, it might already have raw terrain info.
        // We want to rebuild the Coletar/Cacar lines with our seasonal logic, so we strip them from the input.
        let contentLines = content.split('<br>');
        contentLines = contentLines.filter(line => {
            if (line.includes('em rolagens de COLETAR')) return false;
            if (line.includes('em rolagens de CAÇAR')) return false;
            if (line.includes('Iluminação:')) return false; // Filter out old Lighting info
            return true;
        });
        let newContent = contentLines.join('<br>');

        let terrainText = selectedTerrainInfo || '';
        let terrainColetarMod = 0;
        let terrainCacarMod = 0; // NEW: Track Hunting Mod
        let terrainColetarForbidden = false;
        let terrainCacarForbidden = false; // NEW: Track Forbidden Hunting

        // --- 1. PRE-PARSE TERRAIN FORBIDDEN FLAGS ---
        if (terrainText.includes('Não é possível COLETAR')) {
            terrainColetarForbidden = true;
        }
        if (terrainText.includes('Não é possível CAÇAR')) { // NEW
            terrainCacarForbidden = true;
        }

        // --- 2. PARSE TERRAIN NUMERIC MODIFIERS ---
        // We do this BEFORE any seasonal logic so we know what the base is.

        // Coletar
        if (!terrainColetarForbidden) {
            const matchColetar = terrainText.match(/✥\s*([+-]?\d+)\s*em rolagens de COLETAR/);
            if (matchColetar) {
                terrainColetarMod = parseInt(matchColetar[1].replace('+', ''), 10);
            }
        }

        // Cacar (NEW)
        if (!terrainCacarForbidden) {
            const matchCacar = terrainText.match(/✥\s*([+-]?\d+)\s*em rolagens de CAÇAR/);
            if (matchCacar) {
                terrainCacarMod = parseInt(matchCacar[1].replace('+', ''), 10);
            }
        }

        // --- 3. DETERMINE SEASONAL MODIFIERS ---
        let monthColetarMod = 0;
        let monthCacarMod = 0; // NEW
        let showSeasonal = false;

        if (calendarData.length > 0) {
            const currentMonthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
            if (['Cresceprimavera', 'Minguaprimavera'].includes(currentMonthName)) {
                monthColetarMod = -1;
                monthCacarMod = -1; // NEW
                showSeasonal = true;
            } else if (['Cresceoutono', 'Minguaoutono'].includes(currentMonthName)) {
                monthColetarMod = +1;
                monthCacarMod = +1; // NEW
                showSeasonal = true;
            } else if (['Cresceinverno', 'Minguainverno'].includes(currentMonthName)) {
                monthColetarMod = -2;
                monthCacarMod = -2; // NEW
                showSeasonal = true;
            }
        }

        // --- 4. COMBINE AND FORMAT OUTPUT STRINGS ---
        let finalColetarString = '';
        let finalCacarString = ''; // NEW

        if (showSeasonal) {
            const currentMonth = CALENDAR_CONFIG.months[gameState.currentMonthIndex];
            const monthIcon = `<img src="${currentMonth.image}" class="source-tag" onclick="showSimplePopup('${currentMonth.name}', 'Dias: ${currentMonth.days}<br>Iluminação: ${currentMonth.lighting.join(', ')}')">`;

            // COLETAR Logic
            if (!terrainColetarForbidden) {
                const totalColetar = terrainColetarMod + monthColetarMod;
                const signColetar = totalColetar > 0 ? '+' : '';

                let sourceIcons = monthIcon;
                if (terrainColetarMod !== 0 && currentSelectedTerrainData) {
                    const bgColor = currentSelectedTerrainData.color || 'var(--col-bg-main)';
                    const tContentSafe = (selectedTerrainInfo || '').replace(/`/g, '\\`').replace(/'/g, "\\'");
                    const terrainIcon = `<img src="${currentSelectedTerrainData.image}" class="source-tag" style="background-color: ${bgColor};" onclick="showSimplePopup('${currentSelectedTerrainData.name}', \`${tContentSafe}\`)">`;
                    sourceIcons = `${terrainIcon}${monthIcon}`;
                }

                finalColetarString = `${sourceIcons} ${signColetar}${totalColetar} em rolagens de COLETAR.`;
            }

            // CAÇAR Logic (NEW)
            if (!terrainCacarForbidden) {
                const totalCacar = terrainCacarMod + monthCacarMod;
                const signCacar = totalCacar > 0 ? '+' : '';

                let sourceIcons = monthIcon;
                if (terrainCacarMod !== 0 && currentSelectedTerrainData) {
                    const bgColor = currentSelectedTerrainData.color || 'var(--col-bg-main)';
                    const tContentSafe = (selectedTerrainInfo || '').replace(/`/g, '\\`').replace(/'/g, "\\'");
                    const terrainIcon = `<img src="${currentSelectedTerrainData.image}" class="source-tag" style="background-color: ${bgColor};" onclick="showSimplePopup('${currentSelectedTerrainData.name}', \`${tContentSafe}\`)">`;
                    sourceIcons = `${terrainIcon}${monthIcon}`;
                }

                finalCacarString = `${sourceIcons} ${signCacar}${totalCacar} em rolagens de CAÇAR.`;
            }

            // ROBUST CLEANUP: Remove modifier lines from terrainText if they are being handled
            let lines = terrainText.split(/<br>/);
            lines = lines.filter(line => {
                // If we are showing a final string for COLETAR, remove the raw COLETAR line
                if (finalColetarString && line.includes('em rolagens de COLETAR')) return false;
                // If we are showing a final string for CAÇAR, remove the raw CAÇAR line
                if (finalCacarString && line.includes('em rolagens de CAÇAR')) return false;
                return true;
            });
            terrainText = lines.join('<br>');
        }

        // --- 5. BUILD FINAL CONTENT ---

        // Append remaining Terrain Info (cleaned) and avoid duplicates
        if (terrainText) {
            let uniqueLines = [];
            const rawLines = terrainText.split(/<br>/);

            rawLines.forEach(line => {
                const trimmed = line.trim();
                if (!trimmed) return;

                // Remove the bullet for logical comparison
                const textCheck = trimmed.replace(/^✥\s*/, '').trim();
                if (textCheck.length === 0) return;

                // If newContent already has this text (likely from updateTextWithTemperature which adds icons), skip it to avoid duplication.
                if (newContent && newContent.includes(textCheck)) {
                    return;
                }

                uniqueLines.push(trimmed);
            });

            if (uniqueLines.length > 0) {
                if (newContent) {
                    newContent += '<br><br>' + uniqueLines.join('<br>');
                } else {
                    newContent = uniqueLines.join('<br>');
                }
            }
        }

        // Conditional Prompts (Weather/Terrain selection warnings)
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

        // Append Combined/Seasonal Modifiers
        if (finalColetarString) {
            if (newContent) newContent += '<br>';
            newContent += finalColetarString;
        }
        if (finalCacarString) { // NEW
            if (newContent) newContent += '<br>';
            newContent += finalCacarString;
        }

        // --- 6. APPEND LIGHTING INFO (Dynamic Update) ---
        if (calendarData.length > 0) {
            const currentMonth = CALENDAR_CONFIG.months[gameState.currentMonthIndex];
            if (currentMonth) {
                const lighting = currentMonth.lighting[gameState.currentQuarterIndex] || 'Desconhecido';

                // Determine Icon
                let lightingIconSrc = currentMonth.image;
                if (lighting === 'Claro') {
                    lightingIconSrc = 'img/icons/other/day.svg';
                } else if (lighting === 'Escuro') {
                    lightingIconSrc = 'img/icons/other/night.svg';
                }

                const lightingIcon = `<img src="${lightingIconSrc}" class="source-tag" onclick="showSimplePopup('${currentMonth.name}', 'Dias: ${currentMonth.days}<br>Iluminação: ${currentMonth.lighting.join(', ')}')">`;

                let lightingText = `Iluminação: ${lighting}`;
                if (lighting === 'Escuro') {
                    lightingText += ' <b>*Caso não enxergue no escuro*</b> -2 para desbravar, e todas no grupo precisam fazer uma rolagem de PATRULHA — falhar significa que elas caíram e receberam 1 ponto de dano em Força.';
                }

                if (newContent) newContent += '<br>';
                newContent += `${lightingIcon} ${lightingText}`;
            }
        }

        infoDisplay.innerHTML = newContent;
    }
}

function showToast(message) {
    const toast = document.getElementById("toast-notification");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    // After 3 seconds, remove the show class to hide it
    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
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
        hex.setAttribute('stroke', 'var(--col-accent-cool)');
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
    const tempName = row.querySelector('b') ? row.querySelector('b').textContent : null;

    const tempIcons = {
        'Ameno': 'img/icons/other/mild.svg',
        'Frio': 'img/icons/other/cold.svg',
        'Calor': 'img/icons/other/hot.svg',
        'Escaldante': 'img/icons/other/scorching.svg',
        'Cortante': 'img/icons/other/biting.svg'
    };

    // We need to parse tempName if it's like "Ameno (modifiers)". But mostly it's just "Ameno".
    // Actually the b tag content is "Ameno", "Calor", etc.
    // We should safeguard against non-matches.

    // Fallback if no icon found?
    let iconHtml = '';
    if (tempName) {
        // Clean tempName just in case
        const cleanedName = tempName.trim();
        const iconSrc = tempIcons[cleanedName];
        if (iconSrc) {
            iconHtml = `<img src="${iconSrc}" class="source-tag" onclick="showSimplePopup('${cleanedName}', \`${newEffect.replace(/`/g, '\\`').replace(/'/g, "\\'")}\`)">`;
        } else {
            iconHtml = `<span style="font-size:1.2em; vertical-align:middle; margin-right:5px;">✥</span>`;
        }
    } else {
        iconHtml = `<span style="font-size:1.2em; vertical-align:middle; margin-right:5px;">✥</span>`;
    }

    newLines.push(`${iconHtml} ${newEffect}`);

    // --- TERRAIN INFO ---
    if (selectedTerrainInfo && currentSelectedTerrainData) {
        const bgColor = currentSelectedTerrainData.color || 'var(--col-bg-main)';
        const terrainIcon = `<img src="${currentSelectedTerrainData.image}" class="source-tag" style="background-color: ${bgColor};" onclick="showSimplePopup('${currentSelectedTerrainData.name}', \`${selectedTerrainInfo.replace(/`/g, '\\`').replace(/'/g, "\\'")}\`)">`;
        // Split terrain info by <br> if it has multiple lines, but usually it's one block.  
        // Actually terrainInfo in script.js has <br>. We should split it to add icon to each line?
        // Let's split.
        const tLines = selectedTerrainInfo.split('<br>');
        tLines.forEach(line => {
            if (line.trim().startsWith('✥')) {
                newLines.push(`${terrainIcon} ${line.trim().substring(1).trim()}`);
            } else {
                newLines.push(`${terrainIcon} ${line.trim()}`);
            }
        });
    }

    // --- MONTH INFO ---
    const currentMonth = CALENDAR_CONFIG.months[gameState.currentMonthIndex];
    if (currentMonth) {
        const lighting = currentMonth.lighting[gameState.currentQuarterIndex] || 'Desconhecido';

        // Determine Icon
        let lightingIconSrc = currentMonth.image; // Default fallback
        if (lighting === 'Claro') {
            lightingIconSrc = 'img/icons/other/day.svg';
        } else if (lighting === 'Escuro') {
            lightingIconSrc = 'img/icons/other/night.svg';
        }

        const lightingIcon = `<img src="${lightingIconSrc}" class="source-tag" onclick="showSimplePopup('${currentMonth.name}', 'Dias: ${currentMonth.days}<br>Iluminação: ${currentMonth.lighting.join(', ')}')">`;

        let lightingText = `Iluminação: ${lighting}`;
        if (lighting === 'Escuro') {
            lightingText += ' <b>*Caso não enxergue no escuro*</b> -2 para desbravar, e todas no grupo precisam fazer uma rolagem de PATRULHA — falhar significa que elas caíram e receberam 1 ponto de dano em Força.';
        }

        newLines.push(`${lightingIcon} ${lightingText}`);
    }

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
            // hexRed.setAttribute('cursor', 'pointer'); // Conflict with container click
            // hexRed.onclick = () => showWeatherPopup(redImageSrc);
            solitarySvg.appendChild(hexRed);

            // Draw blue polygon
            const hexBlue = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hexBlue.setAttribute('points', polyBlue_points);
            hexBlue.setAttribute('stroke', 'none');
            hexBlue.setAttribute('fill', `url(#${patternBlueId})`);
            // hexBlue.setAttribute('cursor', 'pointer'); // Conflict with container click
            // hexBlue.onclick = () => showWeatherPopup(blueImageSrc);
            solitarySvg.appendChild(hexBlue);

            const hexOutline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hexOutline.setAttribute('points', points);
            hexOutline.setAttribute('class', 'hexagon');
            hexOutline.setAttribute('fill', 'transparent');
            hexOutline.setAttribute('stroke', 'var(--col-accent-cool)');
            hexOutline.setAttribute('stroke-width', '2');
            hexOutline.style.pointerEvents = 'none'; // Ensure click goes through outline
            solitarySvg.appendChild(hexOutline);
        } else {
            const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            hex.setAttribute('points', points);
            hex.setAttribute('class', 'hexagon');
            hex.setAttribute('fill', `url(#${patternRedId})`);
            hex.setAttribute('stroke', 'var(--col-accent-cool)');
            hex.setAttribute('stroke-width', '2');
            // hex.setAttribute('cursor', 'pointer'); // Conflict with container click
            // hex.onclick = () => showWeatherPopup(redImageSrc);
            solitarySvg.appendChild(hex);
        }
    } else {
        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hex.setAttribute('points', points);
        hex.setAttribute('class', 'hexagon');
        hex.setAttribute('fill', 'url(#hexGradient)'); // Fallback gradient
        hex.setAttribute('stroke', 'var(--col-accent-cool)');
        hex.setAttribute('stroke-width', '2');
        solitarySvg.appendChild(hex);
    }
}


function renderSelectedTerrain(terrainData) {
    solitaryTerrainSvg.innerHTML = '';
    const selectedTerrainTitle = document.getElementById('selected-terrain-title');

    const HEX_SIZE_SOLITARY = 40;

    // Center in SVG (viewBox is -50 -50 100 100)
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

    if (!terrainData) {
        if (selectedTerrainTitle) {
            selectedTerrainTitle.textContent = 'Selecione o Terreno';
        }

        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hex.setAttribute('points', points);
        hex.setAttribute('class', 'hexagon placeholder');
        hex.setAttribute('stroke', '#444');
        hex.setAttribute('stroke-width', '2');
        hex.setAttribute('fill', 'transparent');
        hex.style.strokeDasharray = '5,5';

        solitaryTerrainSvg.appendChild(hex);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', centerX);
        text.setAttribute('y', centerY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#666');
        text.setAttribute('font-size', '24');
        text.textContent = '?';
        solitaryTerrainSvg.appendChild(text);
        return;
    }

    if (selectedTerrainTitle) {
        selectedTerrainTitle.textContent = terrainData.name;
    }

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    solitaryTerrainSvg.appendChild(defs);

    const patternId = `patternTerrain-${Date.now()}`;
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', patternId);
    pattern.setAttribute('patternContentUnits', 'objectBoundingBox');
    pattern.setAttribute('width', '1');
    pattern.setAttribute('height', '1');
    pattern.setAttribute('viewBox', '0 0 1 1');
    pattern.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', terrainData.image);
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', terrainData.image);
    image.setAttribute('x', '0');
    image.setAttribute('y', '0');
    image.setAttribute('width', '1');
    image.setAttribute('height', '1');

    pattern.appendChild(image);
    defs.appendChild(pattern);

    // Background Color Hexagon
    const hexBg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hexBg.setAttribute('points', points);
    hexBg.setAttribute('fill', terrainData.color || '#444');
    hexBg.setAttribute('stroke', 'none');
    solitaryTerrainSvg.appendChild(hexBg);

    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hex.setAttribute('points', points);
    hex.setAttribute('class', 'hexagon');
    hex.setAttribute('fill', `url(#${patternId})`);
    hex.setAttribute('stroke', 'var(--col-accent-cool)');
    hex.setAttribute('stroke-width', '2');

    solitaryTerrainSvg.appendChild(hex);
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
        const selectedRow = temperatureTable.querySelector('tr.selected-row') || temperatureTable.querySelector('tr.selected');
        if (selectedRow) {
            updateTextWithTemperature(selectedRow);
        } else if (originalTextWindowContent) {
            // Show weather info even without temp selected
            const lines = originalTextWindowContent.split('<br>');
            const titleIndex = lines.findIndex(line => line.startsWith('<b>'));
            const linesWithoutTitle = [...lines];
            if (titleIndex > -1) {
                linesWithoutTitle.splice(titleIndex, 1);
            }
            let content = linesWithoutTitle.filter(l => l.trim()).join('<br>');

            if (content) {
                content += '<br><br>✥ Além do hexagono de clima é preciso selecionar uma opção na tabela de Temperatura.';
                updateInfoDisplay(content);
            }
        }
    }
}

function renderGrid() {
    const modalMapContainer = document.getElementById('modal-map-container');
    const currentMonth = CALENDAR_CONFIG.months[gameState.currentMonthIndex];
    modalMapContainer.innerHTML = `
                <h3 style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <img src="${currentMonth.image}" alt="${currentMonth.name}" style="height: 1.5em;">
                    ${currentMonth.name}
                </h3>
                <div id="map-container">
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" id="toggle-numbers">
                            <span class="slider round"></span>
                        </label>
                        <!--<label for="toggle-numbers">Mostrar/Ocultar Números</label>-->
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
                hexOutline.setAttribute('stroke', 'var(--col-accent-cool)');
                hexOutline.setAttribute('stroke-width', '2');
                hexOutline.dataset.displayNumber = displayNumber;
                group.appendChild(hexOutline);
            } else {
                const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                hex.setAttribute('points', points);
                hex.setAttribute('class', 'hexagon');
                hex.setAttribute('fill', `url(#${patternRedId})`);
                hex.setAttribute('stroke', 'var(--col-accent-cool)');
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

function selectHexagon(displayNumber, navSelection = '3N') {
    currentSelectedHexagon = displayNumber;

    const tempContainer = document.getElementById('temperature-container');
    const weatherNav = document.getElementById('weather-navigation');

    if (tempContainer && weatherNav) {
        if (!displayNumber) {
            tempContainer.classList.add('disabled-container');
            weatherNav.classList.add('disabled-container');
        } else {
            tempContainer.classList.remove('disabled-container');
            weatherNav.classList.remove('disabled-container');
        }
    }

    renderSelectedHexagon(displayNumber);
    renderWeatherNavigation(navSelection); // Reset nav selection and order on new hex selection
    updateTemperatureTable(); // Update table header with modifier
    updateInfoDisplay("✥ Além do hexagono de clima é preciso selecionar uma opção na tabela de Temperatura."); // Prompt for temperature

    const resultDisplay = document.getElementById('dice-result-temp');
    if (resultDisplay) resultDisplay.innerHTML = '';

    // Clear temperature table selection
    const temperatureTable = document.getElementById('temperature-table');
    if (temperatureTable) {
        // Reset lock state
        temperatureTable.classList.remove('locked');

        const rows = temperatureTable.querySelectorAll('tr');
        rows.forEach(r => {
            r.classList.remove('selected-row');
            r.classList.remove('faded-row');
        });
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
            if (tableRows[1]) tableRows[1].classList.add('faded-row');
            if (tableRows[2]) tableRows[2].classList.add('faded-row');
        }
    }

    // Disable/Enable dice roll UI
    const btnRollTemp = document.getElementById('btn-roll-temp');
    const dieIcon = document.getElementById('die-d12');

    if (btnRollTemp && dieIcon) {
        if (displayNumber === 1 || displayNumber === 2) {
            btnRollTemp.disabled = true;
            btnRollTemp.classList.add('disabled');
            dieIcon.classList.add('disabled');
        } else {
            btnRollTemp.disabled = false;
            btnRollTemp.classList.remove('disabled');
            dieIcon.classList.remove('disabled');
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
        if (calendarData.length === 0) {
            alert('Primeiro selecione o mês e o dia iniciais!');
            return;
        }
        modal.style.display = 'block';
        renderGrid();
        renderWeatherNavigation('3N'); // Reset nav selection and order on modal open
        highlightSelectedHexagon(currentSelectedHexagon, false); // Suppress main display update

        const subtitle = document.getElementById('initial-hex-subtitle');
        if (subtitle) {
            subtitle.style.display = currentSelectedHexagon === null ? 'block' : 'none';
        }

        if (selectedTemperatureRowIndex !== null) {
            const temperatureTable = document.getElementById('temperature-table');
            const rowToSelect = temperatureTable.getElementsByTagName('tr')[selectedTemperatureRowIndex];
            if (rowToSelect) {
                rowToSelect.classList.add('selected');
                // updateTextWithTemperature(rowToSelect); // Suppressed on open
            }
        } else if (currentSelectedHexagon === 1 || currentSelectedHexagon === 2) {
            const temperatureTable = document.getElementById('temperature-table');
            const rows = temperatureTable.getElementsByTagName('tr');
            const fourthRow = rows[3];
            if (fourthRow) {
                fourthRow.classList.add('selected');
                // updateTextWithTemperature(fourthRow); // Suppressed on open
                temperatureTable.classList.add('locked');
            }
            if (rows[1]) rows[1].classList.add('faded-row');
            if (rows[2]) rows[2].classList.add('faded-row');
        }

        const modalMapContainer = document.getElementById('modal-map-container');
        if (modalMapContainer) {
            modalMapContainer.addEventListener('click', (e) => {
                // Unlock modal on manual map interaction
                const modal = document.getElementById('hexagon-modal');
                if (modal) modal.dataset.preventClose = "false";

                // Remove highlight/border from weather navigation logic
                const weatherNav = document.getElementById('weather-navigation');
                if (weatherNav) weatherNav.classList.remove('awaiting-roll');

                const target = e.target;
                const hexGroup = target.closest('.hex-group');
                if (hexGroup) {
                    const displayNumber = parseInt(hexGroup.dataset.displayNumber);
                    if (!isNaN(displayNumber)) {
                        selectHexagon(displayNumber);

                        if (displayNumber === 1 || displayNumber === 2) {
                            const temperatureTable = document.getElementById('temperature-table');
                            if (temperatureTable && temperatureTable.rows.length > 3) {
                                const targetRow = temperatureTable.rows[3];

                                // Visual selection
                                const currentSelected = temperatureTable.querySelectorAll('tr.selected-row');
                                currentSelected.forEach(r => r.classList.remove('selected-row'));
                                targetRow.classList.add('selected-row');
                                selectedTemperatureRowIndex = targetRow.rowIndex;

                                // Update Data
                                updateTextWithTemperature(targetRow);

                                const bTag = targetRow.querySelector('b');
                                if (bTag && calendarData.length > 0) {
                                    calendarData[gameState.currentDayIndex].temperature = bTag.textContent;
                                    const descCell = targetRow.cells[1];
                                    if (descCell) {
                                        calendarData[gameState.currentDayIndex].temperatureDesc = descCell.innerHTML;
                                    }
                                    showDayDetails(calendarData[gameState.currentDayIndex]);
                                }

                                // Focus Temperature Table (Visual Feedback)
                                const tempContainer = document.getElementById('temperature-container');
                                if (tempContainer) {
                                    tempContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    tempContainer.classList.add('flash-highlight');
                                    setTimeout(() => {
                                        tempContainer.classList.remove('flash-highlight');
                                    }, 1500);
                                }

                                // Proceed to close logic
                                setTimeout(() => {
                                    // Ensure lock is released
                                    const modal = document.getElementById('hexagon-modal');
                                    if (modal) modal.dataset.preventClose = 'false';

                                    if (typeof window.startDayWeatherModalClose === 'function') {
                                        window.startDayWeatherModalClose();
                                    } else if (modal) {
                                        modal.style.display = 'none';
                                        if (typeof autoSave === 'function') autoSave();
                                    }

                                    const infoDisplay = document.getElementById('info-display');
                                    if (infoDisplay) {
                                        infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }, 3500);
                            }
                        } else {
                            // Trigger Focus Temperature Animation (similar to dice roll)
                            setTimeout(() => {
                                const tempContainer = document.getElementById('temperature-container');
                                if (tempContainer) {
                                    tempContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    tempContainer.classList.add('flash-highlight');
                                    tempContainer.classList.add('awaiting-roll');

                                    setTimeout(() => {
                                        tempContainer.classList.remove('flash-highlight');
                                    }, 1500);
                                }
                            }, 1500);
                        }
                    }
                }
            });
        }
    }

    function closeModal() {
        // Check for lock
        if (modal.dataset.preventClose === "true") {
            alert("Você deve rolar a navegação ou selecionar um clima no mapa antes de fechar.");
            return;
        }

        // Enforce temperature selection if a hexagon is selected
        if (currentSelectedHexagon !== null && selectedTemperatureRowIndex === null) {
            alert('Selecione uma opção na Tabela de Temperatura!');
            return;
        }

        // Onboarding Logic: Transition from Weather to Terrain
        if (isOnboarding && onboardingStep === 1) {
            // Step 1 Complete (Weather Selected), Move to Step 2 (Terrain)
            onboardingStep = 2;
            modal.style.display = 'none'; // Close weather modal

            // Open Terrain Modal
            const terrainModal = document.getElementById('terrain-modal');
            if (terrainModal) {
                terrainModal.style.display = 'block';
                // Update subtitle if needed? Default is "Selecione o Terreno atual"
            }
            return;
        }

        // Onboarding Logic: Transition from Weather to Terrain
        if (isOnboarding && onboardingStep === 1) {
            // Step 1 Complete (Weather Selected), Move to Step 2 (Terrain)
            onboardingStep = 2;
            modal.style.display = 'none'; // Close weather modal

            // Open Terrain Modal
            const terrainModal = document.getElementById('terrain-modal');
            if (terrainModal) {
                terrainModal.style.display = 'block';
                // Update subtitle if needed? Default is "Selecione o Terreno atual"
            }
            return;
        }

        // selectedTemperatureRowIndex = null; // Persist selection
        modal.style.display = 'none';
        const modalMapContainer = document.getElementById('modal-map-container');
        modalMapContainer.innerHTML = ''; // Limpa o conteúdo do mapa ao fechar

        // Trigger auto save when modal closes
        autoSave();
    }

    window.startDayWeatherModal = openModal;
    window.startDayWeatherModalClose = closeModal;
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

            const bTag = targetRow.querySelector('b');
            if (bTag && calendarData.length > 0) {
                calendarData[gameState.currentDayIndex].temperature = bTag.textContent;
                // Get full content from the second cell (index 1)
                const descCell = targetRow.cells[1];
                if (descCell) {
                    calendarData[gameState.currentDayIndex].temperatureDesc = descCell.innerHTML;
                }
                showDayDetails(calendarData[gameState.currentDayIndex]);
            }

            // Remove highlight/border if present
            const tempCtx = document.getElementById('temperature-container');
            if (tempCtx) tempCtx.classList.remove('awaiting-roll');

            // Auto-close modal after 3s and focus info-display (same logic as dice roll)
            setTimeout(() => {
                if (typeof window.startDayWeatherModalClose === 'function') {
                    window.startDayWeatherModalClose();
                    // Focus info-display
                    const infoDisplay = document.getElementById('info-display');
                    if (infoDisplay) {
                        infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }, 3000);
        }
    });
}

function getTerrainName(imageName) {
    const terrainMap = {
        'montanhasAltas.webp': 'Montanhas Altas',
        'planicie.webp': 'Planície',
        'charco.webp': 'Charco',
        'montanhas.webp': 'Montanhas',
        'colinas.webp': 'Colinas',
        'pantano.webp': 'Pantano',
        'floresta.webp': 'Floresta',
        'florestaSombria.webp': 'Floresta Sombria',
        'ruinas.webp': 'Ruínas',
        'lagoRio.webp': 'Lago ou Rio'
    };
    return terrainMap[imageName] || imageName.split('.')[0];
}

function initializeTerrainModal() {
    const terrainModal = document.getElementById('terrain-modal');
    const selectedTerrain = document.getElementById('selected-terrain');
    const terrainGrid = document.getElementById('terrain-grid');
    const closeButton = terrainModal.querySelector('.close-button');


    const terrainImages = [
        'charco.webp', 'colinas.webp', 'floresta.webp', 'florestaSombria.webp',
        'lagoRio.webp', 'montanhas.webp', 'montanhasAltas.webp', 'pantano.webp',
        'planicie.webp', 'ruinas.webp'
    ];

    const terrainColors = {
        'Charco': '#879253',
        'Pantano': '#84ce94',
        'Lago ou Rio': '#378cc3',
        'Montanhas Altas': '#c07c00',
        'Montanhas': '#c68f00',
        'Colinas': '#c3d263',
        'Floresta Sombria': '#07760f', // Note: Check consistency with getTerrainName
        'Planície': '#a0d76b',
        'Ruínas': '#6f6f6f',
        'Floresta': '#0a8e21'
    };

    // Create Tooltip if not exists
    let tooltip = document.getElementById('terrain-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'terrain-tooltip';
        document.body.appendChild(tooltip);
    }

    // Populate grid
    terrainGrid.innerHTML = ''; // Clear existing content if any
    terrainImages.forEach(imageName => {
        const terrainContainer = document.createElement('div');
        terrainContainer.classList.add('terrain-item');

        const terrainName = getTerrainName(imageName);

        // --- Create SVG Hexagon ---
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '-50 -50 100 100');
        svg.style.width = '100px';
        svg.style.height = '100px';
        svg.style.display = 'block';

        const size = 40; // Same as solitary hexagon
        let points = "";
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i;
            const angle_rad = Math.PI / 180 * angle_deg;
            const x = size * Math.cos(angle_rad);
            const y = size * Math.sin(angle_rad);
            points += `${x},${y} `;
        }

        // Background Color Hexagon
        const hexBg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hexBg.setAttribute('points', points);
        const bgColor = terrainColors[terrainName] || '#444';
        hexBg.setAttribute('fill', bgColor);
        hexBg.setAttribute('stroke', 'none');
        svg.appendChild(hexBg);

        // Image
        const imageSize = 50;
        const imgSvg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        imgSvg.setAttribute('href', `img/terrain/${imageName}`);
        imgSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `img/terrain/${imageName}`);
        imgSvg.setAttribute('x', -imageSize / 2);
        imgSvg.setAttribute('y', -imageSize / 2);
        imgSvg.setAttribute('width', imageSize);
        imgSvg.setAttribute('height', imageSize);
        svg.appendChild(imgSvg);

        // Border Hexagon (optional, for definition)
        const hexBorder = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hexBorder.setAttribute('points', points);
        hexBorder.setAttribute('fill', 'none');
        hexBorder.setAttribute('stroke', 'var(--col-accent-cool)');
        hexBorder.setAttribute('stroke-width', '2');
        svg.appendChild(hexBorder);

        terrainContainer.appendChild(svg);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = terrainName;
        nameSpan.style.marginTop = '5px';

        terrainContainer.appendChild(nameSpan);
        terrainGrid.appendChild(terrainContainer);

        // --- Tooltip Logic ---
        terrainContainer.addEventListener('mouseenter', () => {
            const info = terrainInfo[terrainName] || '';
            tooltip.innerHTML = `<strong>${terrainName}</strong>${info}`;
            tooltip.style.display = 'block';
        });

        terrainContainer.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        });

        terrainContainer.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });


        terrainContainer.addEventListener('click', () => {
            // Logic for selecting terrain
            const terrainData = {
                name: terrainName,
                image: `img/terrain/${imageName}`,
                info: terrainInfo[terrainName],
                color: terrainColors[terrainName] || '#444' // Included color
            };

            currentSelectedTerrainData = terrainData;

            // Update UI
            renderSelectedTerrain(terrainData);

            selectedTerrainInfo = terrainInfo[terrainName] || '';

            // If we were waiting for selection (Desbravar), record it and advance
            if (gameState.waitingForTerrainSelection) {
                gameState.waitingForTerrainSelection = false;
                handleDesbravar(); // Retry the action
            }

            const temperatureTable = document.getElementById('temperature-table');
            if (temperatureTable) {
                const selectedRow = temperatureTable.querySelector('tr.selected-row') || temperatureTable.querySelector('tr.selected');
                if (selectedRow) {
                    updateTextWithTemperature(selectedRow);
                } else if (originalTextWindowContent) {
                    // Fallback to preserve weather info if available
                    const lines = originalTextWindowContent.split('<br>');
                    const titleIndex = lines.findIndex(line => line.startsWith('<b>'));
                    const linesWithoutTitle = [...lines];
                    if (titleIndex > -1) {
                        linesWithoutTitle.splice(titleIndex, 1);
                    }
                    let content = linesWithoutTitle.filter(l => l.trim()).join('<br>');

                    if (content) {
                        content += '<br><br>✥ Além do hexagono de clima é preciso selecionar uma opção na tabela de Temperatura.';
                        updateInfoDisplay(content);
                    } else {
                        updateInfoDisplay(""); // Should not happen if originalTextWindowContent is valid
                    }
                } else {
                    updateInfoDisplay("");
                }
            } else {
                updateInfoDisplay("");
            }

            updateTravelButtonState(); // Check if we can enable buttons
            updateTravelButtonState(); // Check if we can enable buttons

            // Onboarding Logic for Terrain Selection
            if (isOnboarding && onboardingStep === 2) {
                isOnboarding = false;
                onboardingStep = 0;

                // Finish Onboarding: Reveal Main Content
                const mainContent = document.getElementById('main-content');
                const startJourneyContainer = document.getElementById('start-journey-container');
                const siteHeader = document.getElementById('site-header');

                if (mainContent) mainContent.style.display = 'block'; // Show everything
                if (startJourneyContainer) startJourneyContainer.style.display = 'none'; // Hide start button

                closeModal();
                return;
            }

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

    btn.addEventListener('click', function () {
        if (calendarData.length === 0) {
            const startModal = document.getElementById('start-game-modal');
            startModal.style.display = "block";
        } else {
            modal.style.display = "block";
            renderCalendarGrid();
        }
    });

    span.addEventListener('click', function () {
        modal.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    function renderCalendarGrid() {
        grid.innerHTML = '';

        // Group by Month Year
        const grouped = {};
        calendarData.forEach((day, index) => {
            const key = `${day.month} ${day.year}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push({ day, index });
        });

        // Render groups
        for (const [key, items] of Object.entries(grouped)) {
            const section = document.createElement('div');
            section.className = 'calendar-month-section';
            section.style.width = '100%';
            section.style.marginBottom = '10px';

            const title = document.createElement('div');
            title.className = 'calendar-month-title';
            title.style.fontWeight = 'bold';
            title.style.color = 'var(--col-text-highlight)';
            title.style.marginBottom = '5px';
            title.style.borderBottom = '1px solid var(--col-accent-cool)';
            title.textContent = key;
            section.appendChild(title);

            const daysContainer = document.createElement('div');
            daysContainer.style.display = 'flex';
            daysContainer.style.flexWrap = 'wrap';
            daysContainer.style.gap = '10px';

            items.forEach(({ day, index }) => {
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day-item';
                if (index === gameState.currentDayIndex) {
                    dayEl.classList.add('selected');
                    dayEl.classList.add('viewing-day');
                }

                dayEl.innerHTML = `<div>${day.dayInMonth}</div>`;
                dayEl.title = `${day.dayInMonth} de ${day.month}`; // Tooltip for context
                dayEl.onclick = () => {
                    document.querySelectorAll('.calendar-day-item').forEach(el => el.classList.remove('viewing-day'));
                    dayEl.classList.add('viewing-day');
                    showDayDetails(day);
                };
                daysContainer.appendChild(dayEl);
            });

            section.appendChild(daysContainer);
            grid.appendChild(section);
        }

        // Show current day details by default
        if (calendarData.length > 0) {
            showDayDetails(calendarData[gameState.currentDayIndex]);
        }
    }
}

function showDayDetails(day) {
    const detailsModal = document.getElementById('day-details');
    const detailsMain = document.getElementById('day-details-main');

    let html = ``;
    if (day.weather) {
        const redTitle = getImageTitle(day.weather.redImage);
        const blueTitle = getImageTitle(day.weather.blueImage);
        let weatherName = redTitle;
        if (blueTitle) weatherName += ` e ${blueTitle}`;

        if (day.temperature) {
            weatherName += ` (${day.temperature})`;
        }

        const tempIcons = {
            'Ameno': 'img/icons/other/mild.svg',
            'Frio': 'img/icons/other/cold.svg',
            'Calor': 'img/icons/other/hot.svg',
            'Escaldante': 'img/icons/other/scorching.svg',
            'Cortante': 'img/icons/other/biting.svg'
        };

        const tempIconSrc = tempIcons[day.temperature];
        const tempBadgeContent = tempIconSrc
            ? `<img src="${tempIconSrc}" alt="${day.temperature}" style="max-height: 100%; max-width: 100%;">`
            : day.temperature;

        html += `<div class="weather-detail">
            <p><strong>Clima:</strong> ${weatherName}</p>
            <div class="weather-images">
                ${day.weather.redImage ? `<img src="${day.weather.redImage}" alt="${redTitle}" style="cursor: pointer;" onclick="showGeneralPopup('${day.weather.redImage}')">` : ''}
                ${day.weather.blueImage ? `<img src="${day.weather.blueImage}" alt="${blueTitle}" style="cursor: pointer;" onclick="showGeneralPopup('${day.weather.blueImage}')">` : ''}
                ${day.temperature ? `<div class="temp-badge" style="cursor: pointer;" onclick="showSimplePopup('${day.temperature}', \`${day.temperatureDesc ? day.temperatureDesc.replace(/<b>.*?<\/b>\.?\s*/, '').replace(/`/g, '\\`').replace(/'/g, "\\'") : ''}\`)">${tempBadgeContent}</div>` : ''}
            </div>
        </div>`;
    } else {
        html += `<p><strong>Clima:</strong> Não selecionado</p>`;
    }

    day.quarters.forEach((q, qIdx) => {
        const lighting = day.lighting[qIdx];
        const isCurrent = qIdx === gameState.currentQuarterIndex;

        const quarterEntries = (Array.isArray(day.journal)) ? day.journal.filter(e => e.quarterIndex === qIdx) : [];

        html += `<div class="quarter-detail${isCurrent ? ' current-quarter' : ''}">
                    <div class="quarter-title">
                        ${q.name} (${lighting})`;

        quarterEntries.forEach(entry => {
            html += `<button class="quarter-note-btn view-note-btn" data-day-id="${day.id}" data-entry-id="${entry.id}" title="Ver nota">
                        <img src="img/icons/buttons/note.svg">
                      </button>`;
        });

        html += `   </div>`;

        if (q.actions.length === 0) {
            html += `<div class="slot-detail"><span>-</span></div>`;
        } else {
            q.actions.forEach((action, idx) => {
                const verb = action.action === 'Desbravar' ? 'Desbravou' :
                    action.action === 'Permanecer' ? 'Permaneceu' : action.action;

                const actionClass = action.action === 'Desbravar' ? 'text-desbravou' : 'text-permanecer';
                const bgColor = action.color || 'transparent';

                html += `<div class="slot-detail">
                            <span class="${actionClass}">${verb}:</span>
                            <img src="${action.image}" alt="${action.name}" style="background-color: ${bgColor}">
                            <span>${action.name}</span>
                        </div>`;
            });
        }
        html += `</div>`;
    });

    // Generate HTML for Journal Section separate from the main HTML so we can exclude it from main view
    // Generate HTML for Journal Section separate from the main HTML so we can exclude it from main view
    let journalHtml = '';

    // Always show header and add button in modal
    journalHtml += `<h3>Diário <button id="btn-add-entry-modal" data-day-index="${day.id - 1}">Adicionar Entrada</button></h3>`;

    if (Array.isArray(day.journal) && day.journal.length > 0) {
        journalHtml += `<div class="journal-entries-list">`;
        // Sort by quarter
        const entries = [...day.journal].sort((a, b) => a.quarterIndex - b.quarterIndex);

        entries.forEach(entry => {
            const quarterName = QUARTERS[entry.quarterIndex] || 'Desconhecido';
            journalHtml += `<div class="journal-entry" data-entry-id="${entry.id}">
                        <div class="journal-entry-header">
                            <span class="journal-entry-quarter">${quarterName}</span>
                            <button class="btn-edit-entry-modal" data-day-index="${day.id - 1}" data-entry-id="${entry.id}" style="background:none; border:none; color:var(--col-accent-cool); cursor:pointer; text-decoration:underline; font-size:0.85em;">Editar</button>
                        </div>
                        <div class="journal-entry-content">${entry.content}</div>
                    </div>`;
        });
        journalHtml += `</div>`;
    }

    // Update containers
    // detailsMain gets only the base HTML (without journal)
    if (detailsMain) detailsMain.innerHTML = html;

    // detailsModal gets base HTML + Journal
    if (detailsModal) detailsModal.innerHTML = html + journalHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial state: Hide main content, show start button
    const mainContent = document.getElementById('main-content');
    const startJourneyContainer = document.getElementById('start-journey-container');
    const initialStartBtn = document.getElementById('btn-initial-start');

    // Check for Save State
    const hasSave = !!localStorage.getItem('fbl_hexflower_save');

    if (hasSave) {
        // If save exists, show main content immediately (will be populated by auto-load)
        if (mainContent) mainContent.style.display = 'block';
        if (startJourneyContainer) startJourneyContainer.style.display = 'none';
    } else {
        // No save, show onboarding start button
        if (mainContent) mainContent.style.display = 'none';
        if (startJourneyContainer) startJourneyContainer.style.display = 'block';
    }

    if (initialStartBtn) {
        initialStartBtn.addEventListener('click', () => {
            const startModal = document.getElementById('start-game-modal');
            if (startModal) startModal.style.display = 'block';
        });
    }

    initializeModal();
    // Initialize with null to ensure containers are disabled if no valid selection exists/persisted
    // logic in selectHexagon handles null check
    selectHexagon(currentSelectedHexagon);
    initializeTerrainModal();
    initializeCalendar();
    updateTemperatureTable();
    initializeDiceRollerTemp();

    const toggleMounted = document.getElementById('toggle-mounted');
    const labelMounted = document.querySelector('label[for="toggle-mounted"]');

    if (toggleMounted && labelMounted) {
        toggleMounted.addEventListener('change', () => {
            if (toggleMounted.checked) {
                labelMounted.textContent = 'Todos Montados!';
            } else {
                labelMounted.textContent = 'Todos Montados?';
            }
        });
    }
    initializeJournal();
    initializeEditFromModal();
    initializeModalJournal();
});

function initializeEditFromModal() {
    // This function's previous logic is now handled in initializeModalJournal to ensure 
    // editing happens within the modal itself. Keeping this function empty or removing its 
    // internal listener prevents the modal from closing unexpectedly.
}

let editingEntryId = null;

let editingDayIndex = null;

function initializeJournal() {
    const editor = document.getElementById('journal-editor');
    const toolbar = document.querySelector('.editor-toolbar');
    const colorPicker = document.getElementById('editor-color');
    const btnSave = document.getElementById('btn-save-entry');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const selectQuarter = document.getElementById('journal-quarter-select');

    if (!editor || !toolbar) return;

    // Toolbar buttons
    toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('.tool-btn');
        if (!btn) return;

        const cmd = btn.dataset.cmd;
        if (cmd) {
            document.execCommand(cmd, false, null);
            editor.focus();
        }
    });

    // Color picker
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            editor.focus();
        });
    }

    btnSave.addEventListener('click', () => {
        const content = editor.innerHTML;
        if (!content.trim()) return;

        const dayIndex = editingDayIndex !== null ? editingDayIndex : gameState.currentDayIndex;
        const currentDay = calendarData[dayIndex];
        const quarterVal = parseInt(selectQuarter.value);

        // Ensure journal is array (migration check)
        if (!Array.isArray(currentDay.journal)) {
            currentDay.journal = [];
        }

        if (editingEntryId !== null) {
            // Update existing
            const entryIndex = currentDay.journal.findIndex(e => e.id === editingEntryId);
            if (entryIndex > -1) {
                currentDay.journal[entryIndex].content = content;
                currentDay.journal[entryIndex].quarterIndex = quarterVal;
                // timestamp could be updated if we tracked edit time
            }
            editingEntryId = null;
            btnSave.textContent = "Salvar Entrada";
            btnCancel.style.display = 'none';
        } else {
            // New Entry
            const newEntry = {
                id: Date.now(),
                quarterIndex: quarterVal,
                content: content,
                timestamp: Date.now()
            };
            currentDay.journal.push(newEntry);
        }

        // Create a copy of the index we used for potential refresh
        const savedDayIndex = dayIndex;

        editor.innerHTML = '';
        renderJournalEntries();

        // If we were editing from the modal (or any non-current day), refresh modal visual
        // Only refresh modal if it's currently open (implied by editingDayIndex possibly)
        // Always refresh details to show new notes (buttons) immediately
        showDayDetails(calendarData[savedDayIndex]);

        editingEntryId = null;
        editingDayIndex = null;
        saveToLocalStorage(); // Auto-save
        autoSave();
    });

    btnCancel.addEventListener('click', () => {
        editingEntryId = null;
        editingDayIndex = null;
        editor.innerHTML = '';
        btnSave.textContent = "Salvar Entrada";
        btnCancel.style.display = 'none';
    });
}

function renderJournalEntries() {
    const listContainer = document.getElementById('journal-entries-list');
    const currentDay = calendarData[gameState.currentDayIndex];
    if (!listContainer || !currentDay) return;

    // Migration check: if string, convert to object/hide or do nothing (we assume array now)
    let entries = Array.isArray(currentDay.journal) ? currentDay.journal : [];

    // Sort by quarter then time? Or just by time? 
    // Usually grouped by quarter is nice, or chronological.
    // Let's sort by quarter index first, then creation id
    entries.sort((a, b) => {
        if (a.quarterIndex !== b.quarterIndex) {
            return a.quarterIndex - b.quarterIndex;
        }
        return a.id - b.id;
    });

    listContainer.innerHTML = '';

    entries.forEach(entry => {
        const entryEl = document.createElement('div');
        entryEl.className = 'journal-entry';
        entryEl.dataset.entryId = entry.id;

        const quarterName = QUARTERS[entry.quarterIndex] || 'Desconhecido';

        entryEl.innerHTML = `
            <div class="journal-entry-header">
                <span class="journal-entry-quarter">${quarterName}</span>
                <div class="journal-entry-actions">
                    <button class="btn-edit-entry" data-id="${entry.id}">Editar</button>
                </div>
            </div>
            <div class="journal-entry-content">${entry.content}</div>
        `;

        // Bind edit
        const btnEdit = entryEl.querySelector('.btn-edit-entry');
        btnEdit.addEventListener('click', () => {
            loadEntryForEdit(entry);
        });

        listContainer.appendChild(entryEl);
    });
}

function loadEntryForEdit(entry) {
    const editor = document.getElementById('journal-editor');
    const selectQuarter = document.getElementById('journal-quarter-select');
    const btnSave = document.getElementById('btn-save-entry');
    const btnCancel = document.getElementById('btn-cancel-edit');

    editingEntryId = entry.id;

    // ... existing loadEntryForEdit ...
    editor.innerHTML = entry.content;
    selectQuarter.value = entry.quarterIndex;

    btnSave.textContent = "Atualizar Entrada";
    btnCancel.style.display = 'block';

    // Scroll to editor
    editor.scrollIntoView({ behavior: 'smooth' });
}

function initializeModalJournal() {
    // --- Elements ---
    const modalEditorContainer = document.getElementById('modal-journal-section');
    const modalEditor = document.getElementById('modal-journal-editor');
    const modalToolbar = document.querySelector('.modal-editor-toolbar');
    const modalColorPicker = document.getElementById('modal-editor-color');
    const modalBtnSave = document.getElementById('modal-btn-save-entry');
    const modalBtnCancel = document.getElementById('modal-btn-cancel-edit');
    const modalSelectQuarter = document.getElementById('modal-journal-quarter-select');

    // --- Toolbar Helpers ---
    if (modalToolbar) {
        modalToolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.tool-btn');
            if (btn && btn.dataset.cmd) {
                document.execCommand(btn.dataset.cmd, false, null);
                modalEditor.focus();
            }
        });
    }
    if (modalColorPicker) {
        modalColorPicker.addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            modalEditor.focus();
        });
    }

    // --- Global Click Listener for Dynamic Buttons in Modal ---
    document.body.addEventListener('click', (e) => {
        // "Adicionar Entrada" Button
        if (e.target.id === 'btn-add-entry-modal') {
            const dayIndex = parseInt(e.target.dataset.dayIndex);
            if (!isNaN(dayIndex)) {
                editingDayIndex = dayIndex; // Set context
                editingEntryId = null; // New entry

                modalEditor.innerHTML = ''; // Clear editor
                if (modalSelectQuarter) modalSelectQuarter.value = 0; // Default or maybe try to guess?

                modalBtnSave.textContent = "Salvar Entrada";
                modalEditorContainer.style.display = 'block'; // Show editor
                // Scroll to editor
                modalEditorContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // "Editar" Button (inside journal entry list in modal)
        if (e.target.classList.contains('btn-edit-entry-modal')) {
            const dayIndex = parseInt(e.target.dataset.dayIndex);
            const entryId = parseInt(e.target.dataset.entryId);

            if (!isNaN(dayIndex) && !isNaN(entryId)) {
                editingDayIndex = dayIndex;
                editingEntryId = entryId;

                const day = calendarData[dayIndex];
                const entry = day.journal.find(en => en.id === entryId);

                if (entry) {
                    modalEditor.innerHTML = entry.content;
                    if (modalSelectQuarter) modalSelectQuarter.value = entry.quarterIndex;
                    modalBtnSave.textContent = "Atualizar Entrada";
                    modalEditorContainer.style.display = 'block';
                    modalEditorContainer.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    // --- Save Action ---
    if (modalBtnSave) {
        modalBtnSave.addEventListener('click', () => {
            const content = modalEditor.innerHTML;
            if (!content.trim() || editingDayIndex === null) return;

            const currentDay = calendarData[editingDayIndex];
            const quarterVal = parseInt(modalSelectQuarter.value);

            if (!Array.isArray(currentDay.journal)) {
                currentDay.journal = [];
            }

            if (editingEntryId !== null) {
                // Update existing
                const entryIndex = currentDay.journal.findIndex(e => e.id === editingEntryId);
                if (entryIndex > -1) {
                    currentDay.journal[entryIndex].content = content;
                    currentDay.journal[entryIndex].quarterIndex = quarterVal;
                }
            } else {
                // New Entry
                const newEntry = {
                    id: Date.now(),
                    quarterIndex: quarterVal,
                    content: content,
                    timestamp: Date.now()
                };
                currentDay.journal.push(newEntry);
            }

            // Reset and Refresh
            editingEntryId = null;
            modalEditor.innerHTML = '';
            modalEditorContainer.style.display = 'none'; // Hide editor after save

            // Refresh Modal View
            showDayDetails(currentDay);

            // If we modified the current day, also refresh main page journal list
            if (editingDayIndex === gameState.currentDayIndex) {
                renderJournalEntries();
            }
            editingDayIndex = null;
            saveToLocalStorage(); // Auto-save
            autoSave();
        });
    }

    // --- Cancel Action ---
    if (modalBtnCancel) {
        modalBtnCancel.addEventListener('click', () => {
            editingEntryId = null;
            editingDayIndex = null;
            modalEditor.innerHTML = '';
            modalEditorContainer.style.display = 'none';
        });
    }
}




function handleResetStartDay(e) {
    if (e) e.stopPropagation(); // Prevent triggering modal

    // Reset Game State
    calendarData = [];
    gameState.currentDayIndex = 0;
    gameState.currentActionCount = 0;
    gameState.currentQuarterIndex = 0;
    // We don't reset terrain/weather selections as requested

    // Update Display
    const currentDayDisplay = document.getElementById('current-day-display');
    if (currentDayDisplay) {
        currentDayDisplay.innerHTML = 'Selecione o mês e dia para iniciar';
        currentDayDisplay.classList.remove('has-reset-btn');
    }

    // Reset Buttons
    updateTravelButtonState();

    // Clear Day Details
    const detailsMain = document.getElementById('day-details-main');
    if (detailsMain) detailsMain.innerHTML = '';

    saveToLocalStorage(); // Auto-save cleared state
    // autoSave not needed here as we want immediate save logic
}

function setupStartGameModal() {
    const modal = document.getElementById('start-game-modal');
    const closeButton = modal.querySelector('.close-button');
    const btnStart = document.getElementById('btn-start-game');
    const selectMonth = document.getElementById('start-month');
    const inputDay = document.getElementById('start-day');

    const inputYear = document.getElementById('start-year');

    // Populate months
    CALENDAR_CONFIG.months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month.name;
        selectMonth.appendChild(option);
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    btnStart.onclick = function () {
        const monthIndex = parseInt(selectMonth.value);
        const day = parseInt(inputDay.value);
        const year = parseInt(inputYear.value);
        const monthData = CALENDAR_CONFIG.months[monthIndex];

        if (isNaN(year) || year < 0) {
            alert("Ano inválido.");
            return;
        }

        if (day < 1 || day > monthData.days) {
            alert(`Dia inválido para ${monthData.name}. Escolha entre 1 e ${monthData.days}.`);
            return;
        }

        // Set initial state
        gameState.currentYear = year;
        gameState.currentMonthIndex = monthIndex;
        gameState.currentDayInMonth = day - 1; // startNewDay increments this, so we set to day-1

        startNewDay(false);
        renderCalendar();

        // Start Onboarding
        isOnboarding = true;
        onboardingStep = 1;

        modal.style.display = "none";

        // Open Weather Modal
        const weatherContainer = document.getElementById('selected-hexweather-container');
        if (weatherContainer) weatherContainer.click();

        saveToLocalStorage(); // Auto-save initial state
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

    const currentMonthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
    let hexConfig = [];

    if (currentMonthName === 'Minguaprimavera') {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '6, 11', q: 0, r: 1 },
            { name: '3N', label: 'Atual', q: 1, r: 1 },
            { name: '4N', label: '2, 7', q: 2, r: 1 },
            { name: '5N', label: '5, 10', q: 0, r: 2 },
            { name: '6N', label: '4, 9', q: 1, r: 2 },
            { name: '7N', label: '3, 8', q: 2, r: 2 }
        ];
    } else if (['Cresceverão', 'Minguaverão'].includes(currentMonthName)) {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '10, 11', q: 0, r: 1 },
            { name: '3N', label: 'Atual', q: 1, r: 1 },
            { name: '4N', label: '2, 3', q: 2, r: 1 },
            { name: '5N', label: '8, 9', q: 0, r: 2 },
            { name: '6N', label: '6, 7', q: 1, r: 2 },
            { name: '7N', label: '4, 5', q: 2, r: 2 }
        ];
    } else if (currentMonthName === 'Cresceoutono') {
        hexConfig = [
            { name: '1N', label: '2, 12', q: 1, r: 0 },
            { name: '2N', label: '3, 4', q: 0, r: 1 },
            { name: '3N', label: 'Atual', q: 1, r: 1 },
            { name: '4N', label: '5, 6', q: 2, r: 1 },
            { name: '5N', label: '9, 10', q: 0, r: 2 },
            { name: '6N', label: '11', q: 1, r: 2 },
            { name: '7N', label: '7, 8', q: 2, r: 2 }
        ];
    } else if (['Cresceprimavera', 'Cresceinverno', 'Minguainverno'].includes(currentMonthName)) {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '10, 11', q: 0, r: 1 },
            { name: '3N', label: 'Atual', q: 1, r: 1 },
            { name: '4N', label: '2, 3', q: 2, r: 1 },
            { name: '5N', label: '8, 9', q: 0, r: 2 },
            { name: '6N', label: '6, 7', q: 1, r: 2 },
            { name: '7N', label: '4, 5', q: 2, r: 2 }
        ];
    } else if (currentMonthName === 'Minguaoutono') {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '2, 3', q: 0, r: 1 },
            { name: '3N', label: 'Atual', q: 1, r: 1 },
            { name: '4N', label: '10, 11', q: 2, r: 1 },
            { name: '5N', label: '4, 5', q: 0, r: 2 },
            { name: '6N', label: '6, 7', q: 1, r: 2 },
            { name: '7N', label: '8, 9', q: 2, r: 2 }
        ];
    } else {
        // Fallback default
        hexConfig = [
            { name: '1N', label: '2, 12', q: 1, r: 0 },
            { name: '2N', label: '3, 4', q: 0, r: 1 },
            { name: '3N', label: 'Atual', q: 1, r: 1 },
            { name: '4N', label: '5, 6', q: 2, r: 1 },
            { name: '5N', label: '9, 10', q: 0, r: 2 },
            { name: '6N', label: '11', q: 1, r: 2 },
            { name: '7N', label: '7, 8', q: 2, r: 2 }
        ];
    }

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

        // Unlock modal
        const modal = document.getElementById('hexagon-modal');
        if (modal) modal.dataset.preventClose = "false";

        // Remove highlight/border if present
        const weatherNav = document.getElementById('weather-navigation');
        if (weatherNav) weatherNav.classList.remove('awaiting-roll');

        // Immediate visual feedback on Nav
        renderWeatherNavigation(navName);

        // Delayed navigation and focus shift (Focus Effect)
        setTimeout(() => {
            const mapContainer = document.getElementById('modal-map-container');
            if (mapContainer) {
                mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Hexagon change after scroll starts
            setTimeout(() => {
                handleNavigate(navName);

                // NEW STEP: Check logic for Hex 1 or 2 vs Normal Focus
                setTimeout(() => {
                    if (currentSelectedHexagon === 1 || currentSelectedHexagon === 2) {
                        const temperatureTable = document.getElementById('temperature-table');
                        if (temperatureTable && temperatureTable.rows.length > 3) {
                            const targetRow = temperatureTable.rows[3];

                            // Visual selection
                            const currentSelected = temperatureTable.querySelectorAll('tr.selected-row');
                            currentSelected.forEach(r => r.classList.remove('selected-row'));
                            targetRow.classList.add('selected-row');
                            selectedTemperatureRowIndex = targetRow.rowIndex;

                            // Update Data
                            updateTextWithTemperature(targetRow);

                            const bTag = targetRow.querySelector('b');
                            if (bTag && calendarData.length > 0) {
                                calendarData[gameState.currentDayIndex].temperature = bTag.textContent;
                                const descCell = targetRow.cells[1];
                                if (descCell) {
                                    calendarData[gameState.currentDayIndex].temperatureDesc = descCell.innerHTML;
                                }
                                showDayDetails(calendarData[gameState.currentDayIndex]);
                            }

                            // Focus Temperature Table (Visual Feedback)
                            const tempContainer = document.getElementById('temperature-container');
                            if (tempContainer) {
                                tempContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                tempContainer.classList.add('flash-highlight');
                                setTimeout(() => {
                                    tempContainer.classList.remove('flash-highlight');
                                }, 1500);
                            }

                            // Proceed to close logic
                            setTimeout(() => {
                                // Ensure lock is released
                                const modal = document.getElementById('hexagon-modal');
                                if (modal) modal.dataset.preventClose = 'false';

                                if (typeof window.startDayWeatherModalClose === 'function') {
                                    window.startDayWeatherModalClose();
                                } else if (modal) {
                                    modal.style.display = 'none';
                                    if (typeof autoSave === 'function') autoSave();
                                }

                                const infoDisplay = document.getElementById('info-display');
                                if (infoDisplay) {
                                    infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }, 3500);
                        }
                    } else {
                        const tempContainer = document.getElementById('temperature-container');
                        if (tempContainer) {
                            tempContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            tempContainer.classList.add('flash-highlight');
                            tempContainer.classList.add('awaiting-roll');

                            setTimeout(() => {
                                tempContainer.classList.remove('flash-highlight');
                            }, 1500);
                        }
                    }
                }, 2000); // 3rd delay
            }, 500);
        }, 1500); // Main delay matches dice roll
    };

    // Add click listener for auto-save on map
    const mapContainer = document.getElementById('weather-nav-svg');
    if (mapContainer) {
        mapContainer.addEventListener('click', () => {
            // Remove highlight/border if present when user interacts with hexes manually
            const weatherNav = document.getElementById('weather-navigation');
            if (weatherNav) weatherNav.classList.remove('awaiting-roll');

            // We can't easily hook into every internal click without specific logic,
            // but handleNavigate already calls autoSave.
            // If we want "click on anything", we might add a global listener or rely on logic points.
        });
    }

    initializeDiceRoller(hexConfig);
}

const REMOVED_HEXAGONS = [1, 5, 21, 22, 24, 25];
const GRID_WIDTH_VAL = 5;

function handleNavigate(navName) {
    if (!currentSelectedHexagon) return;
    if (navName === '3N') {
        // Re-select current hex to reset temperature table and visuals
        selectHexagon(currentSelectedHexagon);
        return;
    }

    // Edge Wrapping Logic
    const EDGE_WRAPS = {
        1: { '1N': 15, '2N': 13 },
        3: { '1N': 17, '4N': 9 },
        4: { '1N': 14, '2N': 18 },
        8: { '1N': 18, '4N': 14 },
        9: { '2N': 17, '5N': 3 },
        13: { '4N': 15, '7N': 1 },
        14: { '2N': 19, '5N': 8, '6N': 4 },
        15: { '5N': 8, '6N': 1 },
        17: { '6N': 3, '7N': 9 },
        18: { '4N': 19, '6N': 8, '7N': 1 },
        19: { '5N': 18, '7N': 14 }
    };

    if (EDGE_WRAPS[currentSelectedHexagon] && EDGE_WRAPS[currentSelectedHexagon][navName]) {
        const targetId = EDGE_WRAPS[currentSelectedHexagon][navName];
        selectHexagon(targetId, navName);
        return;
    }

    // 1. Map current DisplayID (1-19) to Grid Coordinates (1-25)
    let gridIdOfCurrent = -1;
    let counter = 1;

    for (let i = 1; i <= 25; i++) {
        if (REMOVED_HEXAGONS.includes(i)) continue;
        if (counter === currentSelectedHexagon) {
            gridIdOfCurrent = i;
            break;
        }
        counter++;
    }

    if (gridIdOfCurrent === -1) return;

    const currentQ = (gridIdOfCurrent - 1) % GRID_WIDTH_VAL;
    const currentR = Math.floor((gridIdOfCurrent - 1) / GRID_WIDTH_VAL);
    const isEvenCol = currentQ % 2 === 0;

    let dq = 0, dr = 0;

    switch (navName) {
        case '1N': // North
            dq = 0; dr = -1;
            break;
        case '6N': // South
            dq = 0; dr = 1;
            break;
        case '2N': // North-West
            dq = -1;
            dr = isEvenCol ? -1 : 0;
            break;
        case '5N': // South-West
            dq = -1;
            dr = isEvenCol ? 0 : 1;
            break;
        case '4N': // North-East
            dq = 1;
            dr = isEvenCol ? -1 : 0;
            break;
        case '7N': // South-East
            dq = 1;
            dr = isEvenCol ? 0 : 1;
            break;
    }

    const newQ = currentQ + dq;
    const newR = currentR + dr;

    // Check bounds
    if (newQ < 0 || newQ >= GRID_WIDTH_VAL || newR < 0 || newR >= GRID_WIDTH_VAL) {
        renderWeatherNavigation('3N');
        return;
    }

    const newGridId = newR * GRID_WIDTH_VAL + newQ + 1;

    if (REMOVED_HEXAGONS.includes(newGridId)) {
        renderWeatherNavigation('3N');
        return;
    }

    // 2. Map new GridID back to DisplayID
    let newDisplayId = 0;
    let validCount = 0;
    for (let i = 1; i <= 25; i++) {
        if (REMOVED_HEXAGONS.includes(i)) continue;
        validCount++;
        if (i === newGridId) {
            newDisplayId = validCount;
            break;
        }
    }

    // Move
    selectHexagon(newDisplayId, navName);
    autoSave();
}

function initializeDiceRoller(hexConfig) {
    let die1 = document.getElementById('die-1');
    let die2 = document.getElementById('die-2');
    const btnRoll = document.getElementById('btn-roll-nav');
    const resultDisplay = document.getElementById('dice-result-nav');

    if (!die1 || !die2 || !btnRoll) return;

    if (!die1.textContent) die1.textContent = '1';
    if (!die2.textContent) die2.textContent = '1';

    // Clone dice to avoid duplicate listeners
    const newDie1 = die1.cloneNode(true);
    die1.parentNode.replaceChild(newDie1, die1);
    die1 = newDie1;

    const newDie2 = die2.cloneNode(true);
    die2.parentNode.replaceChild(newDie2, die2);
    die2 = newDie2;

    const newBtn = btnRoll.cloneNode(true);
    btnRoll.parentNode.replaceChild(newBtn, btnRoll);

    // Click on dice triggers roll
    die1.addEventListener('click', () => newBtn.click());
    die2.addEventListener('click', () => newBtn.click());

    newBtn.addEventListener('click', () => {
        // Unlock modal on dice roll
        const modal = document.getElementById('hexagon-modal');
        if (modal) modal.dataset.preventClose = "false";

        // Remove highlight/border if present
        const weatherNav = document.getElementById('weather-navigation');
        if (weatherNav) weatherNav.classList.remove('awaiting-roll');

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
                finalRoll(die1, die2, hexConfig);
            }
        }, 50);
    });

    function finalRoll(d1, d2, config) {
        const array = new Uint32Array(2);
        crypto.getRandomValues(array);
        const r1 = (array[0] % 6) + 1;
        const r2 = (array[1] % 6) + 1;
        const sum = r1 + r2;

        d1.textContent = r1;
        d2.textContent = r2;

        if (resultDisplay) resultDisplay.textContent = `Resultado: ${sum}`;

        // Block logic (retaining checks for hex 2 and 19 edges if applicable)
        // These might need adaptation to DataID vs GridID but using currentSelectedHexagon (DisplayID) matches legacy logic.
        const blockedSums = [2, 3, 4, 5, 6, 12];
        if (currentSelectedHexagon === 2 && blockedSums.includes(sum)) {
            if (resultDisplay) resultDisplay.innerHTML = `Resultado: ${sum} <span style="color:var(--col-accent-warm)">BLOQUEADO</span>`;
            renderWeatherNavigation('3N');
            return;
        }
        if (currentSelectedHexagon === 19 && sum === 11) {
            if (resultDisplay) resultDisplay.innerHTML = `Resultado: ${sum} <span style="color:var(--col-accent-warm)">BLOQUEADO</span>`;
            renderWeatherNavigation('3N');
            return;
        }

        // Auto-navigate
        if (config) {
            const match = config.find(h => {
                const nums = h.label.split(',').map(s => s.trim());
                return nums.includes(sum.toString());
            });

            if (match) {
                // Block logic (Hex 4 -> 5N)
                if (currentSelectedHexagon === 4 && match.name === '5N') {
                    if (resultDisplay) resultDisplay.innerHTML = `Resultado: ${sum} <span style="color:var(--col-accent-warm)">BLOQUEADO</span>`;
                    renderWeatherNavigation('3N');
                    return;
                }
                // Block logic (Hex 8 -> 7N)
                if (currentSelectedHexagon === 8 && match.name === '7N') {
                    if (resultDisplay) resultDisplay.innerHTML = `Resultado: ${sum} <span style="color:var(--col-accent-warm)">BLOQUEADO</span>`;
                    renderWeatherNavigation('3N');
                    return;
                }

                // Immediate visual feedback on Nav
                renderWeatherNavigation(match.name);

                // Delayed navigation and focus shift
                setTimeout(() => {
                    const mapContainer = document.getElementById('modal-map-container');
                    if (mapContainer) {
                        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Hexagon change after scroll starts
                    setTimeout(() => {
                        handleNavigate(match.name);

                        // NEW STEP: Focus Temperature
                        setTimeout(() => {
                            const tempContainer = document.getElementById('temperature-container');
                            if (tempContainer) {
                                tempContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                tempContainer.classList.add('flash-highlight');
                                tempContainer.classList.add('awaiting-roll');

                                setTimeout(() => {
                                    tempContainer.classList.remove('flash-highlight');
                                }, 1500);
                            }
                        }, 2000); // 3rd delay increased
                    }, 500);
                }, 1500);

            } else {
                handleNavigate('3N');
            }
        }
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
    let die = document.getElementById('die-d12');
    const btnRoll = document.getElementById('btn-roll-temp');
    const resultDisplay = document.getElementById('dice-result-temp');

    if (!die || !btnRoll) return;

    // Clone die to refresh listeners
    const newDie = die.cloneNode(true);
    die.parentNode.replaceChild(newDie, die);
    die = newDie;

    const dieNumber = die.querySelector('.die-number');
    if (!dieNumber) return;

    // Reset content if empty
    if (!dieNumber.textContent) dieNumber.textContent = '1';

    // Remove old event listeners
    const newBtn = btnRoll.cloneNode(true);
    btnRoll.parentNode.replaceChild(newBtn, btnRoll);

    // Click on dice triggers roll
    die.addEventListener('click', () => {
        if (!newBtn.disabled && !newBtn.classList.contains('disabled')) {
            newBtn.click();
        }
    });

    newBtn.addEventListener('click', () => {
        // Remove awaiting-roll class
        const tempCtx = document.getElementById('temperature-container');
        if (tempCtx) tempCtx.classList.remove('awaiting-roll');

        // Reset selection on roll start
        const table = document.getElementById('temperature-table');
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(r => {
                r.classList.remove('selected-row');
                r.classList.remove('selected');
            });
        }
        selectedTemperatureRowIndex = null;

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
                selectedTemperatureRowIndex = rowIndex; // Update global state
                updateTextWithTemperature(rows[rowIndex]);

                const bTag = rows[rowIndex].querySelector('b');
                if (bTag && calendarData.length > 0) {
                    calendarData[gameState.currentDayIndex].temperature = bTag.textContent;
                    // Get full content from the second cell (index 1) which is where description is
                    const descCell = rows[rowIndex].cells[1];
                    if (descCell) {
                        calendarData[gameState.currentDayIndex].temperatureDesc = descCell.innerHTML;
                    }
                    showDayDetails(calendarData[gameState.currentDayIndex]);
                }

                // Auto-close modal after 3s and focus info-display
                setTimeout(() => {
                    if (typeof window.startDayWeatherModalClose === 'function') {
                        window.startDayWeatherModalClose();
                        // Focus info-display
                        const infoDisplay = document.getElementById('info-display');
                        if (infoDisplay) {
                            infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }, 3000);
            }
        }
    }
}

// --- PERSISTENCE ---


function getGameStateData() {
    return {
        calendarData,
        gameState,
        currentSelectedHexagon,
        selectedTemperatureRowIndex,
        selectedTerrainInfo,
        currentSelectedTerrainData,
        originalTextWindowContent,
        currentInfoMessage, // Save this
        timestamp: new Date().toISOString()
    };
}

let saveTimer;
function autoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveToLocalStorage();
    }, 500); // Debounce save for 500ms
}

function restoreGameState(data) {
    if (!data) return;

    try {
        calendarData = data.calendarData || [];
        gameState = data.gameState || gameState;
        currentSelectedHexagon = data.currentSelectedHexagon;
        selectedTemperatureRowIndex = data.selectedTemperatureRowIndex;
        selectedTerrainInfo = data.selectedTerrainInfo || '';
        currentSelectedTerrainData = data.currentSelectedTerrainData;
        originalTextWindowContent = data.originalTextWindowContent || '';
        if (data.currentInfoMessage) {
            currentInfoMessage = data.currentInfoMessage;
        }

        // Ensure hexagonData matches the saved month/season
        if (gameState && CALENDAR_CONFIG.months[gameState.currentMonthIndex]) {
            const monthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
            if (typeof updateActiveHexagonData === 'function') {
                updateActiveHexagonData(monthName);
            }
        }

        // Restore UI
        if (currentSelectedTerrainData) {
            renderSelectedTerrain(currentSelectedTerrainData);
        } else {
            // Reset terrain placeholder
            const solitaryTerrainSvg = document.getElementById('solitary-terrain-svg');
            if (solitaryTerrainSvg) solitaryTerrainSvg.innerHTML = '';

            const selectedTerrainTitle = document.getElementById('selected-terrain-title');
            if (selectedTerrainTitle) selectedTerrainTitle.textContent = 'Selecione o Terreno';
        }

        // --- UI VISIBILITY UPDATE FOR LOADED GAME ---
        const mainContent = document.getElementById('main-content');
        const startJourneyContainer = document.getElementById('start-journey-container');
        if (mainContent) mainContent.style.display = 'block';
        if (startJourneyContainer) startJourneyContainer.style.display = 'none';
        // ---------------------------------------------

        // Restore Temperature Table Selection
        // 1. Ensure table is updated for current month modifiers
        updateTemperatureTable();

        // 2. Recovery: If index is missing but day has temperature recorded, try to find it in the table
        if (selectedTemperatureRowIndex === null && calendarData.length > 0 && gameState.currentDayIndex > -1) {
            const currentDay = calendarData[gameState.currentDayIndex];
            if (currentDay && currentDay.temperature) {
                const table = document.getElementById('temperature-table');
                if (table) {
                    const rows = table.querySelectorAll('tr');
                    // Skip header (index 0)
                    for (let i = 1; i < rows.length; i++) {
                        // Check if row contains the temperature name (e.g. "Ameno", "Calor")
                        if (rows[i].innerHTML.includes(currentDay.temperature)) {
                            selectedTemperatureRowIndex = i;
                            break;
                        }
                    }
                }
            }
        }

        // 3. Apply Visual Selection to Table
        if (selectedTemperatureRowIndex !== null) {
            const table = document.getElementById('temperature-table');
            if (table) {
                const rows = table.querySelectorAll('tr');
                if (rows[selectedTemperatureRowIndex]) {
                    rows[selectedTemperatureRowIndex].classList.add('selected-row');
                }
            }
        }

        // 4. Restore Hexagon Visuals and Text
        if (currentSelectedHexagon) {
            // Ensure visual containers are enabled (similar to selectHexagon logic)
            const tempContainer = document.getElementById('temperature-container');
            const weatherNav = document.getElementById('weather-navigation');
            if (tempContainer) tempContainer.classList.remove('disabled-container');
            if (weatherNav) weatherNav.classList.remove('disabled-container');

            // Now highlight hex. Because table row is selected above (if applicable), updateTextWithTemperature will work correctly.
            highlightSelectedHexagon(currentSelectedHexagon, true);

            // Explicitly restore title from original text content if available, as highlightSelectedHexagon might do it but we want to be sure
            if (originalTextWindowContent) {
                const selectedHexagonTitle = document.getElementById('selected-hexagon-title');
                if (selectedHexagonTitle) {
                    const titleMatch = originalTextWindowContent.match(/<b>(.*?)<\/b>/);
                    if (titleMatch) {
                        selectedHexagonTitle.innerHTML = titleMatch[1];
                    }
                }
            }

            // Force visual persistence of sidebar
            renderSelectedHexagon(currentSelectedHexagon);
            renderWeatherNavigation();
        } else {
            const selectedHexagonTitle = document.getElementById('selected-hexagon-title');
            if (selectedHexagonTitle) selectedHexagonTitle.textContent = 'Selecione o Clima';
            const solitarySvg = document.getElementById('solitary-hexagon-svg');
            if (solitarySvg) solitarySvg.innerHTML = '';

            // Ensure containers are disabled if no hex
            const tempContainer = document.getElementById('temperature-container');
            const weatherNav = document.getElementById('weather-navigation');
            if (tempContainer) tempContainer.classList.add('disabled-container');
            if (weatherNav) weatherNav.classList.add('disabled-container');
        }

        renderCalendar();
        renderJournalEntries(); // Restore journal visibility

        // Restore info display content properly
        if (currentInfoMessage) {
            updateInfoDisplay(currentInfoMessage);
        }

        showToast("Jogo carregado com sucesso!");
        updateTravelButtonState();

        // Also update text window content directly if needed
        const textWindow = document.getElementById('text-window');
        if (textWindow && originalTextWindowContent) textWindow.innerHTML = originalTextWindowContent;


    } catch (e) {
        console.error("Erro ao carregar save:", e);
        alert("Erro ao carregar o jogo salvo.");
    }
}

function saveToLocalStorage() {
    const data = getGameStateData();
    localStorage.setItem('fbl_hexflower_save', JSON.stringify(data));
    console.log("Jogo salvo automaticamente.");
}

function loadFromLocalStorage() {
    const json = localStorage.getItem('fbl_hexflower_save');
    if (json) {
        const data = JSON.parse(json);
        restoreGameState(data);
        return true;
    }
    return false;
}

function exportSaveFile() {
    const data = getGameStateData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fbl_tracker_save_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importSaveFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            restoreGameState(data);
            saveToLocalStorage(); // Sync import to LS
        } catch (err) {
            console.error(err);
            alert("Arquivo de save inválido.");
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

function setupPersistence() {
    const btnSave = document.getElementById('btn-save-game');
    const btnLoad = document.getElementById('btn-load-game');
    const fileInput = document.getElementById('file-input-load');

    if (btnSave) {
        btnSave.addEventListener('click', () => {
            saveToLocalStorage(); // Also save to LS just in case
            exportSaveFile();
        });
    }

    if (btnLoad && fileInput) {
        btnLoad.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', importSaveFile);
    }

    const btnReset = document.getElementById('btn-reset-game');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm("Tem certeza que deseja resetar todo o jogo? Isso apagará o progresso salvo.")) {
                localStorage.removeItem('fbl_hexflower_save');
                location.reload();
            }
        });
    }

    // Auto-load if data exists and user hasn't started (optional, maybe prompting is better? 
    // Usually web apps auto-load. Let's auto-load silently if state is found.)
    // Check if we have data
    // Auto-load if data exists and user hasn't started (optional, maybe prompting is better? 
    // Usually web apps auto-load. Let's auto-load silently if state is found.)
    // Check if we have data
    // Auto-load if data exists
    if (localStorage.getItem('fbl_hexflower_save')) {
        loadFromLocalStorage();
    }
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Other inits are called in the original listener...
    // We can add a new listener or append. 
    // Since we are appending this code, we can just run setupPersistence() if we are sure DOM is ready? 
    // No, script is loaded usually in head or body end.
    // We should rely on the existing DOMContentLoaded or add another one.
    // Adding another one works fine.
    setupPersistence();
});

// --- SCROLL TO NOTE ---
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-note-btn');
    if (btn) {
        const entryId = btn.dataset.entryId;
        scrollToJournalEntry(entryId);
    }
});

function scrollToJournalEntry(entryId) {
    // Check if modal is open to prioritize finding the entry there
    const modal = document.getElementById('calendar-modal');
    let entryEl = null;

    if (modal && modal.style.display !== 'none') {
        entryEl = modal.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
    }

    // Fallback to searching globally if not found in modal (or modal closed)
    if (!entryEl) {
        entryEl = document.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
    }

    // If not found, it might be because the journal section isn't visible or rendered?
    // But the quarter detail IS visible (that's where the button is), so the journal SHOULD be rendered in the same context usually.
    // In "Day Details" modal, the journal is appended at the bottom.

    if (entryEl) {
        entryEl.setAttribute('tabindex', '-1');
        entryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        entryEl.focus({ preventScroll: true });

        // Flash highlight
        entryEl.classList.add('flash-highlight');
        setTimeout(() => {
            entryEl.classList.remove('flash-highlight');
        }, 2000);
    } else {
        console.warn("Journal entry element not found for ID:", entryId);
    }
}

function setupInfoModal() {
    const modal = document.getElementById('info-modal');
    const btn = document.getElementById('btn-info-game');
    const closeSpan = modal.querySelector('.close-button');

    if (btn) {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeSpan) {
        closeSpan.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

function setupGeneralInfoModal() {
    const modal = document.getElementById('general-info-modal');
    if (!modal) return;
    const closeBtn = modal.querySelector('.close-button');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showGeneralPopup(imagePath) {
    const title = getImageTitle(imagePath);
    if (!title) return;

    let content = weatherEffects[title];

    if (!content) content = "Sem efeitos adicionais.";

    const modalTitle = document.getElementById('general-info-title');
    const modalContent = document.getElementById('general-info-content');
    const modal = document.getElementById('general-info-modal');

    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = content;

    if (modal) {
        modal.style.display = 'block';
    }
}

function showSimplePopup(title, content) {
    const modalTitle = document.getElementById('general-info-title');
    const modalContent = document.getElementById('general-info-content');
    const modal = document.getElementById('general-info-modal');

    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = content || "Sem detalhes disponíveis.";

    if (modal) {
        modal.style.display = 'block';
    }
}