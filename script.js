// --- CONFIGURAÇÃO -- -
const HEX_SIZE = 40; // Tamanho do lado de cada hexágono
const GRID_WIDTH = 5;
const GRID_HEIGHT = 5;

// Dynamic function to get terrain data config with translations
function getTerrainDataConfig() {
    // Translation helper
    const tr = (key, fallback) => {
        if (typeof t === 'function') {
            const translated = t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback;
    };

    const config = {
        // Portuguese terrain names
        'Planície': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.open', 'ABERTO'),
            deslocamentoDescricao: tr('terrain.movement.open.desc', 'Terreno aberto, é possível trafegar 2 hexágonos por quarto de dia a pé ou 3 hexágonos montado.'),
            acampar: 0,
            coletar: { permitido: true, mod: -1 },
            cacar: { permitido: true, mod: +1 },
            outros: []
        },
        'Floresta': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.open', 'ABERTO'),
            deslocamentoDescricao: tr('terrain.movement.open.desc', 'Terreno aberto, é possível trafegar 2 hexágonos por quarto de dia a pé ou 3 hexágonos montado.'),
            acampar: 0,
            coletar: { permitido: true, mod: +1 },
            cacar: { permitido: true, mod: +1 },
            outros: []
        },
        'Floresta Sombria': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFICULTOSO'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Terreno dificultoso, é possível trafegar 1 hexágono por quarto de dia.'),
            acampar: 0,
            coletar: { permitido: true, mod: -1 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Colinas': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.open', 'ABERTO'),
            deslocamentoDescricao: tr('terrain.movement.open.desc', 'Terreno aberto, é possível trafegar 2 hexágonos por quarto de dia a pé ou 3 hexágonos montado.'),
            acampar: 0,
            coletar: { permitido: true, mod: 0 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Montanhas': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFICULTOSO'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Terreno dificultoso, é possível trafegar 1 hexágono por quarto de dia.'),
            acampar: 0,
            coletar: { permitido: true, mod: -2 },
            cacar: { permitido: true, mod: -1 },
            outros: []
        },
        'Montanhas Altas': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.blocked', 'BLOQUEADO'),
            deslocamentoDescricao: tr('terrain.movement.blocked.desc', 'Intransponível.'),
            acampar: 0,
            coletar: { permitido: false, mod: 0 },
            cacar: { permitido: false, mod: 0 },
            outros: []
        },
        'Lago ou Rio': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFICULTOSO'),
            deslocamentoDescricao: tr('terrain.movement.boat', 'Requer um barco ou balsa.'),
            acampar: 0,
            coletar: { permitido: false, mod: 0 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Pantano': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFICULTOSO'),
            deslocamentoDescricao: tr('terrain.movement.raft', 'Requer uma balsa.'),
            acampar: 0,
            coletar: { permitido: true, mod: +1 },
            cacar: { permitido: true, mod: -1 },
            outros: []
        },
        'Charco': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFICULTOSO'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Terreno dificultoso, é possível trafegar 1 hexágono por quarto de dia.'),
            acampar: 0,
            coletar: { permitido: true, mod: -1 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Ruínas': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFICULTOSO'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Terreno dificultoso, é possível trafegar 1 hexágono por quarto de dia.'),
            acampar: 0,
            coletar: { permitido: true, mod: -2 },
            cacar: { permitido: true, mod: -1 },
            outros: []
        },
        // English terrain names (map to same config as Portuguese equivalents)
        'Plains': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.open', 'OPEN'),
            deslocamentoDescricao: tr('terrain.movement.open.desc', 'Open terrain, you can travel 2 hexes per quarter day on foot or 3 hexes mounted.'),
            acampar: 0,
            coletar: { permitido: true, mod: -1 },
            cacar: { permitido: true, mod: +1 },
            outros: []
        },
        'Forest': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.open', 'OPEN'),
            deslocamentoDescricao: tr('terrain.movement.open.desc', 'Open terrain, you can travel 2 hexes per quarter day on foot or 3 hexes mounted.'),
            acampar: 0,
            coletar: { permitido: true, mod: +1 },
            cacar: { permitido: true, mod: +1 },
            outros: []
        },
        'Dark Forest': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFFICULT'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Difficult terrain, you can travel 1 hex per quarter day.'),
            acampar: 0,
            coletar: { permitido: true, mod: -1 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Hills': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.open', 'OPEN'),
            deslocamentoDescricao: tr('terrain.movement.open.desc', 'Open terrain, you can travel 2 hexes per quarter day on foot or 3 hexes mounted.'),
            acampar: 0,
            coletar: { permitido: true, mod: 0 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Mountains': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFFICULT'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Difficult terrain, you can travel 1 hex per quarter day.'),
            acampar: 0,
            coletar: { permitido: true, mod: -2 },
            cacar: { permitido: true, mod: -1 },
            outros: []
        },
        'High Mountains': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.blocked', 'BLOCKED'),
            deslocamentoDescricao: tr('terrain.movement.blocked.desc', 'Impassable.'),
            acampar: 0,
            coletar: { permitido: false, mod: 0 },
            cacar: { permitido: false, mod: 0 },
            outros: []
        },
        'Lake or River': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFFICULT'),
            deslocamentoDescricao: tr('terrain.movement.boat', 'Requires a boat or raft.'),
            acampar: 0,
            coletar: { permitido: false, mod: 0 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Swamp': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFFICULT'),
            deslocamentoDescricao: tr('terrain.movement.raft', 'Requires a raft.'),
            acampar: 0,
            coletar: { permitido: true, mod: +1 },
            cacar: { permitido: true, mod: -1 },
            outros: []
        },
        'Marsh': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFFICULT'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Difficult terrain, you can travel 1 hex per quarter day.'),
            acampar: 0,
            coletar: { permitido: true, mod: -1 },
            cacar: { permitido: true, mod: 0 },
            outros: []
        },
        'Ruins': {
            desbravar: 0,
            deslocamento: tr('terrain.movement.difficult', 'DIFFICULT'),
            deslocamentoDescricao: tr('terrain.movement.difficult.desc', 'Difficult terrain, you can travel 1 hex per quarter day.'),
            acampar: 0,
            coletar: { permitido: true, mod: -2 },
            cacar: { permitido: true, mod: -1 },
            outros: []
        }
    };

    return config;
}

// Keep terrainDataConfig as a variable that gets updated dynamically
let terrainDataConfig = getTerrainDataConfig();

// Função para gerar texto legível do terreno (retrocompatibilidade)
function getTerrainInfoText(terrainName) {
    const config = terrainDataConfig[terrainName];
    if (!config) return '';

    // Translation helper
    const tr = (key, fallback) => {
        if (typeof t === 'function') {
            const translated = t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback;
    };

    let lines = [];
    lines.push(`✥ ${config.deslocamentoDescricao}`);

    if (!config.coletar.permitido) {
        lines.push(`✥ ${tr('terrain.cannotCollect', 'Não é possível COLETAR')}`);
    } else if (config.coletar.mod !== 0) {
        const sign = config.coletar.mod > 0 ? '+' : '';
        lines.push(`✥ ${sign}${config.coletar.mod} ${tr('terrain.collectRoll', 'em rolagens de COLETAR')}`);
    }

    if (!config.cacar.permitido) {
        lines.push(`✥ ${tr('terrain.cannotHunt', 'Não é possível CAÇAR')}`);
    } else if (config.cacar.mod !== 0) {
        const sign = config.cacar.mod > 0 ? '+' : '';
        lines.push(`✥ ${sign}${config.cacar.mod} ${tr('terrain.huntRoll', 'em rolagens de CAÇAR')}`);
    }

    config.outros.forEach(o => lines.push(`✥ ${o}`));

    return lines.join('<br>');
}

// Função para obter terrainInfo dinamicamente usando terrainDataConfig
function getTerrainInfo() {
    const info = {};
    // Generate terrain info for all terrain names in terrainDataConfig
    Object.keys(terrainDataConfig).forEach(terrainName => {
        info[terrainName] = getTerrainInfoText(terrainName);
    });
    return info;
}

// Manter terrainInfo para retrocompatibilidade (atualizado dinamicamente)
let terrainInfo = getTerrainInfo();

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
        { name: 'Cresceprimavera', i18nKey: 'month.earlySpring', image: 'img/months/cresceprimavera.webp', days: 45, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguaprimavera', i18nKey: 'month.lateSpring', image: 'img/months/minguaprimavera.webp', days: 46, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceverão', i18nKey: 'month.earlySummer', image: 'img/months/cresceverao.webp', days: 45, lighting: ['Claro', 'Claro', 'Claro', 'Escuro'] },
        { name: 'Minguaverão', i18nKey: 'month.lateSummer', image: 'img/months/minguaverao.webp', days: 46, lighting: ['Claro', 'Claro', 'Claro', 'Escuro'] },
        { name: 'Cresceoutono', i18nKey: 'month.earlyAutumn', image: 'img/months/cresceoutono.webp', days: 45, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguaoutono', i18nKey: 'month.lateAutumn', image: 'img/months/minguaoutono.webp', days: 46, lighting: ['Claro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Cresceinverno', i18nKey: 'month.earlyWinter', image: 'img/months/cresceinverno.webp', days: 45, lighting: ['Escuro', 'Claro', 'Escuro', 'Escuro'] },
        { name: 'Minguainverno', i18nKey: 'month.lateWinter', image: 'img/months/minguainverno.webp', days: 46, lighting: ['Escuro', 'Claro', 'Escuro', 'Escuro'] }
    ]
};

const QUARTERS = ['Manhã', 'Tarde', 'Anoitecer', 'Noite'];

const HOT_MONTHS = ['Minguaprimavera', 'Cresceverão', 'Minguaverão', 'Cresceoutono'];

const COLD_MONTHS = ['Cresceprimavera', 'Minguaoutono', 'Cresceinverno', 'Minguainverno'];

const TEMP_ICONS = {
    'Ameno': 'img/icons/other/mild.svg',
    'Frio': 'img/icons/other/cold.svg',
    'Calor': 'img/icons/other/hot.svg',
    'Escaldante': 'img/icons/other/scorching.svg',
    'Cortante': 'img/icons/other/biting.svg'
};

const temperatureDataConfig = {
    hot: [
        { range: '1 - 8', name: 'Ameno', i18nKey: 'temp.mild.full', description: 'Sem alterações.', full: '<b>Ameno</b>. Sem alterações.' },
        { range: '9 - 11', name: 'Calor', i18nKey: 'temp.hot.full', description: 'Água precisa ser consumida em cada Quarto de Dia para ficar DESIDRATADO.', full: '<b>Calor</b>. Água precisa ser consumida em cada Quarto de Dia para ficar DESIDRATADO.' },
        { range: '12', name: 'Escaldante', i18nKey: 'temp.scorching.full', description: 'Água precisa ser consumida em cada Quarto de Dia para não ficar DESIDRATADO. Personagens usando armadura precisam fazer uma rolagem de Resiliência em cada Quarto de Dia, falha significa -1 de AGILIDADE.', full: '<b>Escaldante</b>. Água precisa ser consumida em cada Quarto de Dia para não ficar DESIDRATADO. Personagens usando armadura precisam fazer uma rolagem de Resiliência em cada Quarto de Dia, falha significa -1 de AGILIDADE.' }
    ],
    cold: [
        { range: '1 - 8', name: 'Ameno', i18nKey: 'temp.mild.full', description: 'Sem alterações.', full: '<b>Ameno</b>. Sem alterações.' },
        { range: '9 - 11', name: 'Frio', i18nKey: 'temp.cold.full', description: 'Se não tiver proteção adequada, role RESILIÊNCIA em cada Quarto de dia para não ficar HIPOTÉRMICO.', full: '<b>Frio</b>. Se não tiver proteção adequada, role RESILIÊNCIA em cada Quarto de dia para não ficar HIPOTÉRMICO.' },
        { range: '12', name: 'Cortante', i18nKey: 'temp.biting.full', description: 'Se não tiver proteção adequada, role RESILIÊNCIA em cada <u>hora</u> do dia para não ficar HIPOTÉRMICO.', full: '<b>Cortante</b>. Se não tiver proteção adequada, role RESILIÊNCIA em cada <u>hora</u> do dia para não ficar HIPOTÉRMICO.' }
    ]
};

// --- CALENDAR & TRAVEL STATE ---
let calendarData = [];
let gameState = {
    currentYear: CALENDAR_CONFIG.startYear,
    currentMonthIndex: 0,
    currentDayInMonth: 0, // Will be 1 on first day
    currentQuarterIndex: 0, // 0-3
    currentActionCount: 0, // Actions taken in current quarter
    waitingForTerrainSelection: false
};

// Dynamic function to get roll terms config with translations
function getCommonRollsConfig() {
    // Translation helper
    const tr = (key, fallback) => {
        if (typeof t === 'function') {
            const translated = t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback;
    };

    const config = {
        // Portuguese terms
        'DESBRAVAR': {
            description: tr('roll.pathfind.desc', 'Sempre que você adentra um novo hexágono do mapa, a desbravadora realiza uma rolagem de SOBREVIVÊNCIA. Em caso de sucesso, ela encontra uma rota segura pelo hexágono e segue adiante sem dificuldades. Em caso de falha, o grupo ainda entra no hexágono, mas enfrenta um infortúnio.'),
            modKey: 'desbravar'
        },
        'MONTAR ACAMPAMENTO': {
            description: tr('roll.camp.desc', 'Faça um teste de SOBREVIVÊNCIA. Se a rolagem for bem-sucedida, você encontra um local protegido e confortável para passar a noite, permitindo que todas possam DESCANSAR e DORMIR. Se a rolagem falhar, o acampamento será menos agradável: ainda será possível DESCANSAR e DORMIR, mas a MdJ fará uma rolagem oculta na tabela de infortúnios.'),
            modKey: 'acampar'
        },
        'COLETAR': {
            description: tr('roll.forage.desc', 'Para COLETAR, você deve escolher se está em busca de comida ou de água. Em seguida, realize uma rolagem de SOBREVIVÊNCIA, modificada pelo tipo de Terreno. A rolagem também sofre modificações de acordo com o mês.'),
            modKey: 'coletar'
        },
        'CAÇAR': {
            description: tr('roll.hunt.desc', 'Várias pessoas podem CAÇAR ao mesmo tempo. Caso optem por rolar separadamente, não será possível CAÇAR no mesmo local, o que significa que qualquer infortúnio afetará cada uma individualmente. Uma alternativa é que uma de vocês CACE enquanto as demais oferecem ajuda.<br>Para CAÇAR, é necessário algum tipo de equipamento, como uma arma à distância ou uma armadilha de caça. O primeiro passo é localizar a presa, o que é feito com uma rolagem de SOBREVIVÊNCIA. Um sucesso indica que você encontrou uma presa; então, role na tabela correspondente para determinar o tipo de animal. Se forem obtidos múltiplos x, você pode rolar novamente na tabela de caça, uma vez para cada x, sem poder retornar a resultados anteriores após decidir rolar de novo.<br>Para abater a presa, faça uma nova rolagem: PONTARIA, se estiver usando uma arma, ou SOBREVIVÊNCIA, se estiver utilizando uma armadilha. Modifique a rolagem conforme a dificuldade do animal, de acordo com a tabela CAÇAR.'),
            modKey: 'cacar'
        },
        'PATRULHA': {
            description: tr('roll.scout.desc', 'Perícia ligada a ASTUCIA rolada para descobrir alguém tentando passar furtivamente. Também pode usar essa perícia quando vê algo ou alguém à distância e quer saber mais.'),
            modKey: null
        },
        'RESILIÊNCIA': {
            description: tr('roll.endurance.desc', 'Perícia ligada a FORÇA Utilizada esta perícia quando viajar em climas extremos ou quando for forçada a ir além dos seus limites.'),
            modKey: null
        },
        'SOBREVIVÊNCIA': {
            description: tr('roll.survival.desc', 'Perícia ligada a ASTUCIA rolada SOBREVIVÊNCIA em um número de situações diferentes quando viaja através da área selvagem.'),
            modKey: null
        },
        // English terms (map to same modKey as Portuguese equivalents)
        'LEAD THE WAY': {
            description: tr('roll.pathfind.desc', 'Whenever you enter a new hexagon on the map, the lead the way character makes a SURVIVAL roll. On success, they find a safe route through the hexagon and proceed without difficulty. On failure, the group still enters the hexagon but faces a mishap.'),
            modKey: 'desbravar'
        },
        'MAKE CAMP': {
            description: tr('roll.camp.desc', 'Make a SURVIVAL test. If the roll succeeds, you find a protected and comfortable place to spend the night, allowing everyone to REST and SLEEP. If the roll fails, the camp will be less pleasant: you can still REST and SLEEP, but the GM makes a hidden roll on the mishap table.'),
            modKey: 'acampar'
        },
        'FORAGE': {
            description: tr('roll.forage.desc', 'To FORAGE, you must choose whether you are looking for food or water. Then make a SURVIVAL roll, modified by terrain type. The roll is also modified by the month.'),
            modKey: 'coletar'
        },
        'HUNT': {
            description: tr('roll.hunt.desc', 'Multiple people can HUNT at the same time. If they choose to roll separately, they cannot HUNT in the same location, meaning any mishap will affect each individually. Alternatively, one can HUNT while the others provide assistance.<br>To HUNT, you need some kind of equipment, like a ranged weapon or a hunting trap. The first step is to locate the prey, which is done with a SURVIVAL roll. A success indicates you found prey; then roll on the corresponding table to determine the type of animal.<br>To take down the prey, make another roll: MARKSMANSHIP if using a weapon, or SURVIVAL if using a trap. Modify the roll according to the animal\'s difficulty, as per the HUNT table.'),
            modKey: 'cacar'
        },
        'SCOUT': {
            description: tr('roll.scout.desc', 'A skill linked to WITS rolled to discover someone trying to sneak past. Can also use this skill when you see something or someone at a distance and want to learn more.'),
            modKey: null
        },
        'ENDURANCE': {
            description: tr('roll.endurance.desc', 'A skill linked to STRENGTH. Use this skill when traveling in extreme climates or when forced to go beyond your limits.'),
            modKey: null
        },
        'SURVIVAL': {
            description: tr('roll.survival.desc', 'A skill linked to WITS. Roll SURVIVAL in various situations when traveling through the wilderness.'),
            modKey: null
        }
    };

    return config;
}

// Keep COMMON_ROLLS_CONFIG as a variable that gets updated dynamically
let COMMON_ROLLS_CONFIG = getCommonRollsConfig();

let isOnboarding = false; // Flag to track onboarding state
let onboardingStep = 0; // 0: None, 1: Date Selected (Weather Next), 2: Weather Selected (Terrain Next)

// --- SISTEMA DE MODIFICADORES ACUMULADOS ---
let currentModifiers = {
    desbravar: { total: 0, sources: [] },
    acampar: { total: 0, sources: [] },
    coletar: { permitido: true, total: 0, sources: [] },
    cacar: { permitido: true, total: 0, sources: [] },
    deslocamento: { tipo: null, descricao: '', source: null },
    iluminacao: { tipo: null, descricao: '', source: null },
    outros: []  // Array de { text: string, source: string, icon: string }
};

function recalculateModifiers() {
    // Reset
    currentModifiers = {
        desbravar: { total: 0, sources: [] },
        acampar: { total: 0, sources: [] },
        coletar: { permitido: true, total: 0, sources: [] },
        cacar: { permitido: true, total: 0, sources: [] },
        deslocamento: { tipo: null, descricao: '', source: null },
        iluminacao: { tipo: null, descricao: '', source: null },
        temperatura: { name: '', description: '', source: null }, // Added temperature field
        outros: []
    };

    // 1. Aplicar modificadores de TERRENO
    if (currentSelectedTerrainData && terrainDataConfig[currentSelectedTerrainData.name]) {
        const terrain = terrainDataConfig[currentSelectedTerrainData.name];
        const icon = currentSelectedTerrainData.image;
        const name = currentSelectedTerrainData.name;

        // Deslocamento
        currentModifiers.deslocamento = {
            tipo: terrain.deslocamento,
            descricao: terrain.deslocamentoDescricao,
            source: { name, icon }
        };

        // Desbravar do terreno
        if (terrain.desbravar !== 0) {
            currentModifiers.desbravar.total += terrain.desbravar;
            currentModifiers.desbravar.sources.push({ name, icon, value: terrain.desbravar });
        }

        // Acampar do terreno
        if (terrain.acampar !== 0) {
            currentModifiers.acampar.total += terrain.acampar;
            currentModifiers.acampar.sources.push({ name, icon, value: terrain.acampar });
        }

        // Coletar
        if (!terrain.coletar.permitido) {
            currentModifiers.coletar.permitido = false;
            currentModifiers.coletar.sources.push({ name, icon, value: null, forbidden: true });
        } else if (terrain.coletar.mod !== 0) {
            currentModifiers.coletar.total += terrain.coletar.mod;
            currentModifiers.coletar.sources.push({ name, icon, value: terrain.coletar.mod });
        }

        // Caçar
        if (!terrain.cacar.permitido) {
            currentModifiers.cacar.permitido = false;
            currentModifiers.cacar.sources.push({ name, icon, value: null, forbidden: true });
        } else if (terrain.cacar.mod !== 0) {
            currentModifiers.cacar.total += terrain.cacar.mod;
            currentModifiers.cacar.sources.push({ name, icon, value: terrain.cacar.mod });
        }

        // Outros do terreno
        terrain.outros.forEach(text => {
            currentModifiers.outros.push({ text, source: name, icon });
        });
    }

    // 2. Aplicar modificadores de CLIMA (hexágono selecionado)
    if (currentSelectedHexagon && hexagonData[currentSelectedHexagon]?.modifiers) {
        const hex = hexagonData[currentSelectedHexagon];
        const mods = hex.modifiers;

        // Usar ícones separados para clima e vento
        const redIcon = mods.sources?.red?.image;
        const redName = mods.sources?.red?.title || 'Clima';
        const blueIcon = mods.sources?.blue?.image;
        const blueName = mods.sources?.blue?.title || 'Vento';

        if (mods.desbravar !== 0) {
            currentModifiers.desbravar.total += mods.desbravar;
            currentModifiers.desbravar.sources.push({ name: redName, icon: redIcon, value: mods.desbravar });
        }

        if (mods.acampar !== 0) {
            currentModifiers.acampar.total += mods.acampar;
            // Acampar geralmente vem do vento
            currentModifiers.acampar.sources.push({ name: blueName, icon: blueIcon, value: mods.acampar });
        }

        if (mods.coletar !== 0 && currentModifiers.coletar.permitido) {
            currentModifiers.coletar.total += mods.coletar;
            currentModifiers.coletar.sources.push({ name: redName, icon: redIcon, value: mods.coletar });
        }

        if (mods.cacar !== 0 && currentModifiers.cacar.permitido) {
            currentModifiers.cacar.total += mods.cacar;
            currentModifiers.cacar.sources.push({ name: redName, icon: redIcon, value: mods.cacar });
        }

        mods.outros.forEach(text => {
            currentModifiers.outros.push({ text, source: redName, icon: redIcon });
        });
    }

    // 3. Aplicar modificadores SAZONAIS (mês)
    if (calendarData.length > 0) {
        const monthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
        const monthIcon = CALENDAR_CONFIG.months[gameState.currentMonthIndex].image;
        let seasonalColetar = 0;
        let seasonalCacar = 0;

        if (['Cresceprimavera', 'Minguaprimavera'].includes(monthName)) {
            seasonalColetar = -1;
            seasonalCacar = -1;
        } else if (['Cresceoutono', 'Minguaoutono'].includes(monthName)) {
            seasonalColetar = +1;
            seasonalCacar = +1;
        } else if (['Cresceinverno', 'Minguainverno'].includes(monthName)) {
            seasonalColetar = -2;
            seasonalCacar = -2;
        }

        if (seasonalColetar !== 0 && currentModifiers.coletar.permitido) {
            currentModifiers.coletar.total += seasonalColetar;
            currentModifiers.coletar.sources.push({ name: monthName, icon: monthIcon, value: seasonalColetar });
        }

        if (seasonalCacar !== 0 && currentModifiers.cacar.permitido) {
            currentModifiers.cacar.total += seasonalCacar;
            currentModifiers.cacar.sources.push({ name: monthName, icon: monthIcon, value: seasonalCacar });
        }
    }

    // 4. Aplicar modificadores de ILUMINAÇÃO
    if (calendarData.length > 0) {
        const month = CALENDAR_CONFIG.months[gameState.currentMonthIndex];
        const lighting = month.lighting[gameState.currentQuarterIndex];
        // lighting is 'Claro' or 'Escuro' (internal Portuguese names)
        const lightingIcon = lighting === 'Claro' ? 'img/icons/other/day.svg' : 'img/icons/other/night.svg';

        // Translation helper
        const trl = (key, fallback) => {
            if (typeof t === 'function') {
                const translated = t(key);
                if (translated && translated !== key) return translated;
            }
            return fallback;
        };

        // Translate lighting name for display
        const lightingName = lighting === 'Claro'
            ? trl('info.light', 'Claro')
            : trl('info.dark', 'Escuro');

        currentModifiers.iluminacao = {
            tipo: lightingName,
            descricao: `${trl('info.lighting', 'Iluminação')}: ${lightingName}`,
            source: { name: month.name, icon: lightingIcon }
        };

        if (lighting === 'Escuro') {
            currentModifiers.desbravar.total += -2;
            currentModifiers.desbravar.sources.push({ name: lightingName, icon: lightingIcon, value: -2 });
            currentModifiers.outros.push({
                text: trl('lighting.darkWarning', 'Caso não enxergue no escuro, todas no grupo precisam fazer uma rolagem de PATRULHA — falhar significa que caíram e receberam 1 ponto de dano em Força.'),
                source: lightingName,
                icon: lightingIcon
            });
        }
    }

    // 5. Aplicar modificadores de TEMPERATURA
    if (selectedTemperatureRowIndex !== null) {
        const currentMonthName = CALENDAR_CONFIG.months[gameState.currentMonthIndex].name;
        const isHot = HOT_MONTHS.includes(currentMonthName);
        const configKey = isHot ? 'hot' : 'cold';
        // selectedTemperatureRowIndex is 1-based (header is 0), data is 0-based
        const dataIndex = selectedTemperatureRowIndex - 1;

        if (temperatureDataConfig[configKey][dataIndex]) {
            const tempInfo = temperatureDataConfig[configKey][dataIndex];
            // Translation helper
            const trt = (key, fallback) => {
                if (typeof t === 'function') {
                    const translated = t(key);
                    if (translated && translated !== key) return translated;
                }
                return fallback;
            };

            // Map Portuguese temperature names to i18n keys
            const tempNameToKey = {
                'Ameno': 'temp.mild',
                'Calor': 'temp.hot',
                'Frio': 'temp.cold',
                'Escaldante': 'temp.scorching',
                'Cortante': 'temp.biting'
            };

            // Get translated temperature name and description
            const tempNameKey = tempNameToKey[tempInfo.name] || `temp.${tempInfo.name.toLowerCase()}`;
            const translatedName = trt(tempNameKey, tempInfo.name);
            const translatedFull = trt(tempInfo.i18nKey, tempInfo.full);

            // Use the correct icon if available, otherwise fallback to masthead
            // Need to check both Portuguese and English temperature names for icon lookup
            const iconPath = TEMP_ICONS[tempInfo.name] || TEMP_ICONS[translatedName] || 'img/icons/mastheads/temperature-container.svg';

            currentModifiers.temperatura = {
                name: translatedName,
                description: translatedFull, // Use translated full text
                source: { name: trt('label.temperature', 'Temperatura'), icon: iconPath }
            };
        }
    }

    return currentModifiers;
}

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
        // Get translated quarter and lighting names
        const quarterKeys = ['quarter.morning', 'quarter.afternoon', 'quarter.dusk', 'quarter.night'];
        const quarterTranslated = typeof t === 'function' ? t(quarterKeys[gameState.currentQuarterIndex]) : quarterName;
        const lightingKey = lighting === 'Claro' ? 'lighting.light' : 'lighting.dark';
        const lightingTranslated = typeof t === 'function' ? t(lightingKey) : lighting;

        // Get translated month name
        const monthConfig = CALENDAR_CONFIG.months.find(m => m.name === day.month);
        const monthTranslated = (typeof t === 'function' && monthConfig && monthConfig.i18nKey)
            ? t(monthConfig.i18nKey)
            : day.month;

        currentDayDisplay.innerHTML = `${day.dayInMonth} - ${monthTranslated} - ${day.year} - ${quarterTranslated} (${lightingTranslated})`;
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
    document.getElementById('btn-caminhar').addEventListener('click', handleDesbravar);
    const btnPermanecer = document.getElementById('btn-permanecer');
    btnPermanecer.addEventListener('click', handlePermanecer);
    document.getElementById('btn-advance-day').addEventListener('click', handleAdvanceDay);
}

function showAdvanceDayButton() {
    document.querySelector('.caminhar-container').style.display = 'none';
    document.getElementById('btn-permanecer').style.display = 'none';

    const btnAdvance = document.getElementById('btn-advance-day');
    btnAdvance.classList.remove('hidden');
    btnAdvance.classList.add('visible');
}

// Updates travel button visibility based on game state (called on restore/load)
function updateTravelButtonState() {
    const btnDesbravar = document.getElementById('btn-caminhar');
    const btnPermanecer = document.getElementById('btn-permanecer');
    const btnAdvance = document.getElementById('btn-advance-day');
    const journalSection = document.getElementById('journal-section');

    const isWeatherSelected = currentSelectedHexagon !== null;
    const isTerrainSelected = !!currentSelectedTerrainData;
    const isGameStarted = calendarData.length > 0;

    if (!isGameStarted) {
        // No game started - disable everything
        if (btnDesbravar) {
            btnDesbravar.classList.add('disabled');
            btnDesbravar.disabled = true;
        }
        if (btnPermanecer) {
            btnPermanecer.classList.add('disabled');
            btnPermanecer.disabled = true;
        }
        if (journalSection) journalSection.classList.add('disabled');
        return;
    }

    // Game started - check day state
    if (gameState.currentQuarterIndex >= QUARTERS.length) {
        // Day is over, show advance day button
        showAdvanceDayButton();
    } else {
        // Day is in progress, show travel buttons
        document.querySelector('.caminhar-container').style.removeProperty('display');
        if (btnPermanecer) btnPermanecer.style.removeProperty('display');
        if (btnAdvance) {
            btnAdvance.classList.remove('visible');
            btnAdvance.classList.add('hidden');
        }
    }

    // Enable/disable based on selections
    const canTravel = isWeatherSelected && isTerrainSelected;
    if (btnDesbravar) {
        if (canTravel) {
            btnDesbravar.classList.remove('disabled');
            btnDesbravar.disabled = false;
        } else {
            btnDesbravar.classList.add('disabled');
            btnDesbravar.disabled = true;
        }
    }
    if (btnPermanecer) {
        if (canTravel) {
            btnPermanecer.classList.remove('disabled');
            btnPermanecer.disabled = false;
        } else {
            btnPermanecer.classList.add('disabled');
            btnPermanecer.disabled = true;
        }
    }

    // Journal section state
    if (journalSection) journalSection.classList.remove('disabled');
}

function handleAdvanceDay() {
    startNewDay();

    // Shuffle the oracle deck automatically when advancing day
    if (typeof resetDeck === 'function') {
        resetDeck();
    }

    // Reset UI visibility
    document.querySelector('.caminhar-container').style.display = 'flex';
    document.getElementById('btn-permanecer').style.removeProperty('display');

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
    if (!day) return; // Guard: no day data

    const quarter = day.quarters[gameState.currentQuarterIndex];
    if (!quarter) return; // Guard: quarter index out of bounds (day ended)

    quarter.actions.push({ ...terrainData, action: actionType });

    // Also record weather if not set for the day
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


let currentInfoMessage = '';

function highlightRollTerms(text) {
    if (!text) return text;
    // Split by tags to only modify text content
    const parts = text.split(/(<[^>]+>)/g);

    return parts.map(part => {
        if (part.startsWith('<')) return part; // Return tags as-is

        let modifiedPart = part;
        Object.keys(COMMON_ROLLS_CONFIG).forEach(key => {
            // Regex to match whole word/phrase, ensuring we don't match inside other words if possible
            // Using a simple replace for exact match as keys are quite specific
            // Escaping special characters in key just in case
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?<![\\wÀ-ÿ])(${escapedKey})(?![\\wÀ-ÿ])`, 'g');
            modifiedPart = modifiedPart.replace(regex, `<span class="roll-term" onclick="showRollModal('$1')">$1</span>`);
        });
        return modifiedPart;
    }).join('');
}

function showRollModal(rollName) {
    const config = COMMON_ROLLS_CONFIG[rollName];
    if (!config) return;

    const modalTitle = document.getElementById('general-info-title');
    const modalContent = document.getElementById('general-info-content');
    const modal = document.getElementById('general-info-modal');
    const mastheadIcon = modal.querySelector('.masthead-icon img');

    if (modalTitle) {
        // Try to translate the roll name
        // Common roll names are DESBRAVAR, MONTAR ACAMPAMENTO, COLETAR, CAÇAR
        // We can map these to translation keys
        let translatedTitle = rollName;
        if (typeof t === 'function') {
            const keyMap = {
                'DESBRAVAR': 'roll.pathfind',
                'MONTAR ACAMPAMENTO': 'roll.camp',
                'COLETAR': 'roll.forage',
                'CAÇAR': 'roll.hunt'
            };
            // Also check if the config has a specific title key (optional, future proofing)
            if (config.titleKey) {
                translatedTitle = t(config.titleKey);
            } else if (keyMap[rollName]) {
                translatedTitle = t(keyMap[rollName]);
            }
        }
        modalTitle.textContent = translatedTitle;
    }
    if (mastheadIcon) mastheadIcon.src = 'img/icons/mastheads/hexagons.svg';

    let contentHTML = `<p>${config.description}</p>`;

    // Add Modifiers if applicable
    if (config.modKey && currentModifiers[config.modKey]) {
        const modData = currentModifiers[config.modKey];
        if (modData.sources.length > 0) {
            contentHTML += `<hr class="modal-divider">`;
            contentHTML += `<h4>Modificadores Atuais:</h4>`;
            contentHTML += `<div class="modifiers-list">`;

            // Re-use logic to show sources similar to updateInfoDisplay or create custom list
            modData.sources.forEach(s => {
                const sign = s.value > 0 ? '+' : '';
                const valueText = s.value !== null ? `<b>${sign}${s.value}</b>` : '';

                // Use existing helper icon creation (needs to be accessible or duplicated)
                // For simplicity, we create specific HTML here
                const bgStyle = s.icon && s.icon.includes('terrain/') ? `style="background-color: ${currentSelectedTerrainData?.color || 'var(--col-bg-main)'};"` : '';
                const iconHTML = s.icon ? `<img src="${s.icon}" class="source-tag" ${bgStyle} style="vertical-align: middle; margin-right: 5px;">` : '✥';

                contentHTML += `<div style="margin-bottom: 5px; display: flex; align-items: center;">
                    ${iconHTML} <span>${s.name}: ${valueText}</span>
                 </div>`;
            });
            contentHTML += `<p><strong>Total: ${modData.total > 0 ? '+' : ''}${modData.total}</strong></p>`;
            contentHTML += `</div>`;
        }
    }

    if (modalContent) modalContent.innerHTML = contentHTML;

    if (modal) {
        modal.style.display = 'block';
    }
}

function updateInfoDisplay(content) {
    const infoDisplay = document.getElementById('info-display-text');
    if (infoDisplay) {
        currentInfoMessage = content; // Store the base message

        // Recalcular todos os modificadores
        recalculateModifiers();

        // Função para obter conteúdo do popup baseado no nome da fonte
        const getSourcePopupContent = (sourceName, sourceIcon) => {
            // Translation helper
            const tr = (key, fallback) => {
                if (typeof t === 'function') {
                    const translated = t(key);
                    if (translated && translated !== key) return translated;
                }
                return fallback;
            };

            // Verificar se é um terreno
            if (terrainDataConfig[sourceName]) {
                const terrain = terrainDataConfig[sourceName];
                let lines = [];
                lines.push(`<b>${tr('info.movement', 'Deslocamento')}:</b> ${terrain.deslocamento}`);
                lines.push(`${terrain.deslocamentoDescricao}`);
                if (terrain.coletar.permitido) {
                    if (terrain.coletar.mod !== 0) {
                        const sign = terrain.coletar.mod > 0 ? '+' : '';
                        lines.push(`<b>${tr('info.forage', 'Coletar')}:</b> ${sign}${terrain.coletar.mod}`);
                    }
                } else {
                    lines.push(`<b>${tr('info.forage', 'Coletar')}:</b> ${tr('info.notAllowed', 'Não permitido')}`);
                }
                if (terrain.cacar.permitido) {
                    if (terrain.cacar.mod !== 0) {
                        const sign = terrain.cacar.mod > 0 ? '+' : '';
                        lines.push(`<b>${tr('info.hunt', 'Caçar')}:</b> ${sign}${terrain.cacar.mod}`);
                    }
                } else {
                    lines.push(`<b>${tr('info.hunt', 'Caçar')}:</b> ${tr('info.notAllowed', 'Não permitido')}`);
                }
                return lines.join('<br>');
            }

            // Verificar se é um mês
            // Map English month names to Portuguese for comparisons
            const monthNameToPortuguese = {
                'Springrise': 'Cresceprimavera',
                'Springwane': 'Minguaprimavera',
                'Summerrise': 'Cresceverão',
                'Summerwane': 'Minguaverão',
                'Fallrise': 'Cresceoutono',
                'Fallwane': 'Minguaoutono',
                'Winterrise': 'Cresceinverno',
                'Winterwane': 'Minguainverno'
            };
            const lookupMonthName = monthNameToPortuguese[sourceName] || sourceName;

            const month = CALENDAR_CONFIG.months.find(m => m.name === sourceName || m.name === lookupMonthName);
            if (month) {
                let lines = [];
                lines.push(`<b>${tr('info.days', 'Dias')}:</b> ${month.days}`);

                // Translate lighting values
                const translatedLighting = month.lighting.map(l => {
                    if (l === 'Claro') return tr('info.light', 'Claro');
                    if (l === 'Escuro') return tr('info.dark', 'Escuro');
                    return l;
                });
                lines.push(`<b>${tr('info.lighting', 'Iluminação')}:</b> ${translatedLighting.join(', ')}`);

                // Adicionar modificadores sazonais - use Portuguese name for comparison
                let seasonalColetar = 0;
                let seasonalCacar = 0;
                const ptMonthName = monthNameToPortuguese[sourceName] || month.name;
                if (['Cresceprimavera', 'Minguaprimavera'].includes(ptMonthName)) {
                    seasonalColetar = -1;
                    seasonalCacar = -1;
                } else if (['Cresceoutono', 'Minguaoutono'].includes(ptMonthName)) {
                    seasonalColetar = +1;
                    seasonalCacar = +1;
                } else if (['Cresceinverno', 'Minguainverno'].includes(ptMonthName)) {
                    seasonalColetar = -2;
                    seasonalCacar = -2;
                }

                if (seasonalColetar !== 0) {
                    const sign = seasonalColetar > 0 ? '+' : '';
                    lines.push(`<b>${tr('info.forage', 'Coletar')}:</b> ${sign}${seasonalColetar}`);
                }
                if (seasonalCacar !== 0) {
                    const sign = seasonalCacar > 0 ? '+' : '';
                    lines.push(`<b>${tr('info.hunt', 'Caçar')}:</b> ${sign}${seasonalCacar}`);
                }

                return lines.join('<br>');
            }

            // Verificar se é clima/vento (usar weatherModifiers)
            // Map English weather names to Portuguese for weatherModifiers lookup
            const weatherNameToPortuguese = {
                'Hot Sunny Day': 'Dia Quente de Sol',
                'Cold Biting Day': 'Dia de Frio Cortante',
                'Clear Sky': 'Céu Limpo',
                'Drizzle': 'Garoa',
                'Light Rain': 'Chuva Leve',
                'Heavy Rain': 'Chuva Forte',
                'Storm': 'Temporal',
                'Snow Flurry': 'Rajada de Neve',
                'Snow': 'Neve',
                'Blizzard': 'Nevasca',
                'No Wind': 'Sem Vento',
                'Breeze': 'Brisa',
                'Windy': 'Ventando',
                'Strong Wind': 'Ventania Forte',
                'Foggy': 'Nebuloso',
                'Overcast': 'Encoberto',
                'Light Clouds': 'Nuvens Claras',
                'Heavy Clouds': 'Nuvens Pesadas'
            };
            const lookupName = weatherNameToPortuguese[sourceName] || sourceName;

            if (typeof weatherModifiers !== 'undefined' && weatherModifiers[lookupName]) {
                const mods = weatherModifiers[lookupName];
                let lines = [];
                if (mods.desbravar !== 0) {
                    const sign = mods.desbravar > 0 ? '+' : '';
                    lines.push(`<b>${tr('info.pathfind', 'Desbravar')}:</b> ${sign}${mods.desbravar}`);
                }
                if (mods.acampar !== 0) {
                    const sign = mods.acampar > 0 ? '+' : '';
                    lines.push(`<b>${tr('info.camp', 'Acampar')}:</b> ${sign}${mods.acampar}`);
                }
                if (mods.temperaturaMod) {
                    if (mods.temperaturaMod.hot !== 0) {
                        const sign = mods.temperaturaMod.hot > 0 ? '+' : '';
                        lines.push(`<b>${tr('info.heatTable', 'Tabela de Calor')}:</b> ${sign}${mods.temperaturaMod.hot}`);
                    }
                    if (mods.temperaturaMod.cold !== 0) {
                        const sign = mods.temperaturaMod.cold > 0 ? '+' : '';
                        lines.push(`<b>${tr('info.coldTable', 'Tabela de Frio')}:</b> ${sign}${mods.temperaturaMod.cold}`);
                    }
                }
                if (mods.outros && mods.outros.length > 0) {
                    lines.push(`<b>${tr('info.effects', 'Efeitos')}:</b> ${mods.outros.join(', ')}`);
                }
                return lines.length > 0 ? lines.join('<br>') : sourceName;
            }

            // Iluminação
            if (sourceName === 'Escuro' || sourceName === tr('info.dark', 'Escuro')) {
                return `<b>${tr('info.dark', 'Escuro')}:</b> ${tr('info.dark.desc', '-2 em rolagens de Desbravar. Rolagem de PATRULHA necessária para evitar quedas.')}`;
            }
            if (sourceName === 'Claro' || sourceName === tr('info.light', 'Claro')) {
                return `<b>${tr('info.light', 'Claro')}:</b> ${tr('info.light.desc', 'Sem penalidades de iluminação.')}`;
            }

            return sourceName;
        };

        // Função auxiliar para criar ícone clicável
        const createSourceIcon = (source) => {
            if (!source || !source.icon) return '';
            const bgStyle = source.icon.includes('terrain/') ? `style="background-color: ${currentSelectedTerrainData?.color || 'var(--col-bg-main)'};"` : '';
            const popupContent = getSourcePopupContent(source.name, source.icon)
                .replace(/'/g, "\\'")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const mastheadIcon = source.icon.includes('terrain/') ? 'img/icons/mastheads/terrain.svg' : source.icon.includes('months/') ? 'img/icons/mastheads/journal.svg' : 'img/icons/mastheads/weather.svg';
            return `<img src="${source.icon}" class="source-tag" ${bgStyle} onclick="showSimplePopup('${source.name}', '${popupContent}', '${mastheadIcon}')">`;
        };

        // Função para criar linha de modificador com ícones
        const createModifierLine = (label, modData, suffix = '') => {
            if (modData.sources.length === 0) return '';

            let icons = '';
            modData.sources.forEach(s => {
                if (s.icon) {
                    const bgStyle = s.icon.includes('terrain/') ? `style="background-color: ${currentSelectedTerrainData?.color || 'var(--col-bg-main)'};"` : '';
                    const popupContent = getSourcePopupContent(s.name, s.icon)
                        .replace(/'/g, "\\'")
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                    const mastheadIcon = s.icon.includes('terrain/') ? 'img/icons/mastheads/terrain.svg' :
                        s.icon.includes('months/') ? 'img/icons/mastheads/journal.svg' : 'img/icons/mastheads/weather.svg';
                    icons += `<img src="${s.icon}" class="source-tag" ${bgStyle} onclick="showSimplePopup('${s.name}', '${popupContent}', '${mastheadIcon}')">`;
                }
            });

            if (!icons) icons = '✥';

            const sign = modData.total > 0 ? '+' : '';
            return `${icons} ${sign}${modData.total} ${label}${suffix}`;
        };

        let outputLines = [];

        // Translation helper for output lines
        const tr = (key, fallback) => {
            if (typeof t === 'function') {
                const translated = t(key);
                if (translated && translated !== key) return translated;
            }
            return fallback;
        };

        // --- DESLOCAMENTO ---
        if (currentModifiers.deslocamento.tipo) {
            const icon = createSourceIcon(currentModifiers.deslocamento.source);
            outputLines.push(`${icon} ${currentModifiers.deslocamento.descricao}`);
        }

        // --- DESBRAVAR ---
        if (currentModifiers.desbravar.sources.length > 0 && currentModifiers.desbravar.total !== 0) {
            outputLines.push(createModifierLine(tr('terrain.pathfindRoll', 'em rolagens de DESBRAVAR'), currentModifiers.desbravar, '.'));
        }

        // --- ACAMPAR ---
        if (currentModifiers.acampar.sources.length > 0 && currentModifiers.acampar.total !== 0) {
            outputLines.push(createModifierLine(tr('terrain.campRoll', 'em rolagens de MONTAR ACAMPAMENTO'), currentModifiers.acampar, '.'));
        }

        // --- COLETAR ---
        if (!currentModifiers.coletar.permitido) {
            const forbiddenSource = currentModifiers.coletar.sources.find(s => s.forbidden);
            const icon = forbiddenSource ? createSourceIcon(forbiddenSource) : '✥';
            outputLines.push(`${icon} ${tr('terrain.cannotCollect', 'Não é possível COLETAR')}.`);
        } else if (currentModifiers.coletar.sources.length > 0 && currentModifiers.coletar.total !== 0) {
            outputLines.push(createModifierLine(tr('terrain.collectRoll', 'em rolagens de COLETAR'), currentModifiers.coletar, '.'));
        }

        // --- CAÇAR ---
        if (!currentModifiers.cacar.permitido) {
            const forbiddenSource = currentModifiers.cacar.sources.find(s => s.forbidden);
            const icon = forbiddenSource ? createSourceIcon(forbiddenSource) : '✥';
            outputLines.push(`${icon} ${tr('terrain.cannotHunt', 'Não é possível CAÇAR')}.`);
        } else if (currentModifiers.cacar.sources.length > 0 && currentModifiers.cacar.total !== 0) {
            outputLines.push(createModifierLine(tr('terrain.huntRoll', 'em rolagens de CAÇAR'), currentModifiers.cacar, '.'));
        }

        // --- OUTROS ---
        currentModifiers.outros.forEach(item => {
            const bgStyle = item.icon && item.icon.includes('terrain/') ? `style="background-color: ${currentSelectedTerrainData?.color || 'var(--col-bg-main)'};"` : '';
            const popupContent = getSourcePopupContent(item.source, item.icon)
                .replace(/'/g, "\\'")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const mastheadIcon = (item.icon && item.icon.includes('terrain/')) ? 'img/icons/mastheads/terrain.svg' :
                (item.icon && item.icon.includes('months/')) ? 'img/icons/mastheads/journal.svg' : 'img/icons/mastheads/weather.svg';
            const icon = item.icon ? `<img src="${item.icon}" class="source-tag" ${bgStyle} onclick="showSimplePopup('${item.source}', '${popupContent}', '${mastheadIcon}')">` : '✥';
            outputLines.push(`${icon} ${item.text}`);
        });

        // Nota: A linha "Iluminação: Claro/Escuro" foi removida.
        // A mensagem sobre PATRULHA quando Escuro já está incluída em currentModifiers.outros.

        // --- TEMPERATURA ---
        // --- TEMPERATURA ---
        if (currentModifiers.temperatura && currentModifiers.temperatura.name &&
            currentModifiers.temperatura.name !== 'Ameno' && currentModifiers.temperatura.name !== tr('temp.mild', 'Ameno')) {
            // Create clickable icon
            const popupContent = currentModifiers.temperatura.description
                .replace(/'/g, "\\'")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const icon = `<img src="${currentModifiers.temperatura.source.icon}" class="source-tag" onclick="showSimplePopup('${currentModifiers.temperatura.name}', '${popupContent}')">`;

            // Only show description if it's not just "Ameno. Sem alterações." or similar safe state if desired,
            // but user wants detailed info.
            outputLines.push(`${icon} ${currentModifiers.temperatura.description}`);
        }

        // --- MENSAGENS DE SELEÇÃO ---
        const isWeatherSelected = currentSelectedHexagon !== null;
        const isTerrainSelected = !!currentSelectedTerrainData;
        const isGameStarted = calendarData.length > 0;

        if (isGameStarted) {
            if (!isTerrainSelected) {
                outputLines.push(`✥ ${tr('info.selectTerrain', 'Selecione um terreno primeiro.')}`);
            }
            if (!isWeatherSelected) {
                outputLines.push(`✥ ${tr('info.selectWeather', 'Selecione um hexágono de clima no hexflower de clima, mas não esqueça de selecionar a temperatura.')}`);
            }
        } else {
            if (isWeatherSelected && !isTerrainSelected) {
                outputLines.push(`✥ ${tr('info.selectTerrain', 'Selecione um terreno primeiro.')}`);
            } else if (isTerrainSelected && !isWeatherSelected) {
                outputLines.push(`✥ ${tr('info.selectWeather', 'Selecione um hexágono de clima no hexflower de clima, mas não esqueça de selecionar a temperatura.')}`);
            }
        }

        // Se não há linhas e há conteúdo original, usar ele
        let finalText = '';
        if (outputLines.length === 0 && content) {
            finalText = content;
        } else {
            finalText = outputLines.join('<br>');
        }

        infoDisplay.innerHTML = highlightRollTerms(finalText);
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
        const terrainIcon = `<img src="${currentSelectedTerrainData.image}" class="source-tag" style="background-color: ${bgColor};" onclick="showSimplePopup('${currentSelectedTerrainData.name}', \`${selectedTerrainInfo.replace(/`/g, '\\`').replace(/'/g, "\\'")}\`, 'img/icons/mastheads/terrain.svg')">`;
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

        const lightingIcon = `<img src="${lightingIconSrc}" class="source-tag" onclick="showSimplePopup('${currentMonth.name}', 'Dias: ${currentMonth.days}<br>Iluminação: ${currentMonth.lighting.join(', ')}', 'img/icons/mastheads/journal.svg')">`;

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
    // Get translated month name
    const monthName = (typeof t === 'function' && currentMonth.i18nKey)
        ? t(currentMonth.i18nKey)
        : currentMonth.name;
    modalMapContainer.innerHTML = `
                <h3 style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <img src="${currentMonth.image}" alt="${monthName}" style="height: 1.5em;">
                    ${monthName}
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
            const allRows = temperatureTable.querySelectorAll('tr');
            allRows.forEach(r => {
                r.classList.remove('selected-row');
                r.classList.remove('selected');
            });
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
    // Translation helper
    const tr = (key, fallback) => {
        if (typeof t === 'function') {
            const translated = t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback;
    };

    const terrainMap = {
        'montanhasAltas.webp': tr('terrain.highMountains', 'Montanhas Altas'),
        'planicie.webp': tr('terrain.plains', 'Planície'),
        'charco.webp': tr('terrain.marsh', 'Charco'),
        'montanhas.webp': tr('terrain.mountains', 'Montanhas'),
        'colinas.webp': tr('terrain.hills', 'Colinas'),
        'pantano.webp': tr('terrain.swamp', 'Pantano'),
        'floresta.webp': tr('terrain.forest', 'Floresta'),
        'florestaSombria.webp': tr('terrain.darkForest', 'Floresta Sombria'),
        'ruinas.webp': tr('terrain.ruins', 'Ruínas'),
        'lagoRio.webp': tr('terrain.lakeOrRiver', 'Lago ou Rio')
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

    // Use image filename as keys for colors (language-independent)
    const terrainColorsByImage = {
        'charco.webp': '#879253',
        'pantano.webp': '#84ce94',
        'lagoRio.webp': '#378cc3',
        'montanhasAltas.webp': '#c07c00',
        'montanhas.webp': '#c68f00',
        'colinas.webp': '#c3d263',
        'florestaSombria.webp': '#07760f',
        'planicie.webp': '#a0d76b',
        'ruinas.webp': '#6f6f6f',
        'floresta.webp': '#0a8e21'
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
        const bgColor = terrainColorsByImage[imageName] || '#444';
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
                color: terrainColorsByImage[imageName] || '#444' // Included color
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
                document.body.classList.remove('onboarding-active');

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
}

// Global function to render calendar grid (accessible from other parts of the code)
// Global variable to track which day index is being viewed (for preserving on refresh)
let viewingDayIndex = null;

function renderCalendarGrid(preserveViewingDay = false) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    // If not preserving, reset to current day
    if (!preserveViewingDay) {
        viewingDayIndex = gameState.currentDayIndex;
    }

    grid.innerHTML = '';

    // Group by Month Year
    const grouped = {};
    calendarData.forEach((day, index) => {
        const key = `${day.month} ${day.year}`;
        if (!grouped[key]) {
            grouped[key] = {
                monthName: day.month,
                year: day.year,
                items: []
            };
        }
        grouped[key].items.push({ day, index });
    });

    // Get month config from CALENDAR_CONFIG
    function getMonthConfig(monthName) {
        return CALENDAR_CONFIG.months.find(m => m.name === monthName);
    }

    // Get month image from CALENDAR_CONFIG
    function getMonthImage(monthName) {
        const monthConfig = getMonthConfig(monthName);
        return monthConfig ? monthConfig.image : null;
    }

    // Create lookup for explored days: key = "monthName_year_dayInMonth" -> { day, index }
    const exploredDaysMap = {};
    calendarData.forEach((day, index) => {
        const key = `${day.month}_${day.year}_${day.dayInMonth}`;
        exploredDaysMap[key] = { day, index };
    });

    // Determine which months to render (all months that have at least one explored day)
    const monthsToRender = [];
    const seenMonths = new Set();
    calendarData.forEach(day => {
        const key = `${day.month}_${day.year}`;
        if (!seenMonths.has(key)) {
            seenMonths.add(key);
            monthsToRender.push({ monthName: day.month, year: day.year });
        }
    });

    // Render each month
    monthsToRender.forEach(({ monthName, year }) => {
        const monthConfig = getMonthConfig(monthName);
        if (!monthConfig) return;

        const totalDays = monthConfig.days; // 45 or 46
        const section = document.createElement('div');
        section.className = 'calendar-month-section';

        // Month Title with optional image
        const title = document.createElement('div');
        title.className = 'calendar-month-title';

        const monthImage = getMonthImage(monthName);
        if (monthImage) {
            const img = document.createElement('img');
            img.src = monthImage;
            img.alt = monthName;
            title.appendChild(img);
        }

        const titleText = document.createElement('span');

        // Translation helper for month names
        const tr = (key, fallback) => {
            if (typeof t === 'function') {
                const translated = t(key);
                if (translated && translated !== key) return translated;
            }
            return fallback;
        };

        // Map Portuguese month names to translation keys
        const monthNameToKey = {
            'Cresceprimavera': 'month.springrise',
            'Minguaprimavera': 'month.springwane',
            'Cresceverão': 'month.summerrise',
            'Minguaverão': 'month.summerwane',
            'Cresceoutono': 'month.fallrise',
            'Minguaoutono': 'month.fallwane',
            'Cresceinverno': 'month.winterrise',
            'Minguainverno': 'month.winterwane'
        };
        const monthKey = monthNameToKey[monthName];
        const translatedMonthName = monthKey ? tr(monthKey, monthName) : monthName;

        titleText.textContent = `${translatedMonthName} ${year}`;
        title.appendChild(titleText);
        section.appendChild(title);

        // Days Grid Container
        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar-days-grid';

        // Render ALL days of the month
        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const lookupKey = `${monthName}_${year}_${dayNum}`;
            const exploredData = exploredDaysMap[lookupKey];

            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day-item';
            dayEl.textContent = dayNum;

            if (exploredData) {
                // This day has been explored
                const { day, index } = exploredData;

                if (index < gameState.currentDayIndex) {
                    dayEl.classList.add('past-day');
                } else if (index === gameState.currentDayIndex) {
                    dayEl.classList.add('current-day');
                } else {
                    dayEl.classList.add('future-day');
                }

                // Apply viewing-day class based on viewingDayIndex
                if (index === viewingDayIndex) {
                    dayEl.classList.add('viewing-day');
                }

                // Add highlight indicator for days with journal entries
                if (day.journal && day.journal.length > 0) {
                    dayEl.classList.add('has-journal');
                }

                dayEl.title = `${dayNum} de ${monthName}, ${year}`;

                // Click handler (only for past and current days)
                if (index <= gameState.currentDayIndex) {
                    dayEl.onclick = () => {
                        viewingDayIndex = index; // Update viewing day index
                        document.querySelectorAll('.calendar-day-item').forEach(el => el.classList.remove('viewing-day'));
                        dayEl.classList.add('viewing-day');
                        showDayDetails(day);
                    };
                }
            } else {
                // This day has NOT been explored - show faded
                dayEl.classList.add('unexplored-day');
                dayEl.title = `${dayNum} de ${monthName}, ${year} (não explorado)`;
            }

            daysContainer.appendChild(dayEl);
        }

        section.appendChild(daysContainer);
        grid.appendChild(section);
    });

    // Show current day details by default (unless preserving current view)
    if (calendarData.length > 0 && !preserveViewingDay) {
        showDayDetails(calendarData[gameState.currentDayIndex]);
    }
}

function showDayDetails(day) {
    const detailsModal = document.getElementById('day-details');
    const detailsMain = document.getElementById('day-details-main');

    // Translation helper
    const tr = (key, fallback) => {
        if (typeof t === 'function') {
            const translated = t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback;
    };

    let html = ``;
    if (day.weather) {
        const redTitle = getImageTitle(day.weather.redImage);
        const blueTitle = getImageTitle(day.weather.blueImage);
        let weatherName = redTitle;
        if (blueTitle) weatherName += ` ${tr('weather.and', 'e')} ${blueTitle}`;

        if (day.temperature) {
            weatherName += ` (${day.temperature})`;
        }

        const tempIcons = {
            // Portuguese temperature names
            'Ameno': 'img/icons/other/mild.svg',
            'Frio': 'img/icons/other/cold.svg',
            'Calor': 'img/icons/other/hot.svg',
            'Escaldante': 'img/icons/other/scorching.svg',
            'Cortante': 'img/icons/other/biting.svg',
            // English temperature names
            'Mild': 'img/icons/other/mild.svg',
            'Cold': 'img/icons/other/cold.svg',
            'Hot': 'img/icons/other/hot.svg',
            'Scorching': 'img/icons/other/scorching.svg',
            'Biting': 'img/icons/other/biting.svg'
        };

        const tempIconSrc = tempIcons[day.temperature];
        const tempBadgeContent = tempIconSrc
            ? `<img src="${tempIconSrc}" alt="${day.temperature}" style="max-height: 100%; max-width: 100%;">`
            : day.temperature;

        html += `<div class="weather-detail">
            <p><strong>${tr('label.weather', 'Clima')}:</strong> ${weatherName}</p>
            <div class="weather-images">
                ${day.weather.redImage ? `<img src="${day.weather.redImage}" alt="${redTitle}" style="cursor: pointer;" onclick="showGeneralPopup('${day.weather.redImage}')">` : ''}
                ${day.weather.blueImage ? `<img src="${day.weather.blueImage}" alt="${blueTitle}" style="cursor: pointer;" onclick="showGeneralPopup('${day.weather.blueImage}')">` : ''}
                ${day.temperature ? `<div class="temp-badge" style="cursor: pointer;" onclick="showSimplePopup('${day.temperature}', \`${day.temperatureDesc ? day.temperatureDesc.replace(/<b>.*?<\/b>\.?\s*/, '').replace(/`/g, '\\`').replace(/'/g, "\\'") : ''}\`)"> ${tempBadgeContent}</div>` : ''}
            </div>
        </div>`;
    } else {
        html += `<p><strong>${tr('label.weather', 'Clima')}:</strong> ${tr('label.notSelected', 'Não selecionado')}</p>`;
    }

    day.quarters.forEach((q, qIdx) => {
        const lighting = day.lighting[qIdx];
        const isCurrent = qIdx === gameState.currentQuarterIndex;

        const quarterEntries = (Array.isArray(day.journal)) ? day.journal.filter(e => e.quarterIndex === qIdx) : [];

        // Translate quarter name
        const quarterNameToKey = {
            'Manhã': 'quarter.morning',
            'Tarde': 'quarter.afternoon',
            'Anoitecer': 'quarter.dusk',
            'Noite': 'quarter.night'
        };
        const quarterKey = quarterNameToKey[q.name];
        const displayQuarterName = quarterKey ? tr(quarterKey, q.name) : q.name;

        // Translate lighting
        const displayLighting = lighting === 'Claro' ? tr('info.light', 'Claro') :
            lighting === 'Escuro' ? tr('info.dark', 'Escuro') : lighting;

        html += `<div class="quarter-detail${isCurrent ? ' current-quarter' : ''}">
                    <div class="quarter-title">
                        ${displayQuarterName} (${displayLighting})`;

        quarterEntries.forEach(entry => {
            html += `<button class="quarter-note-btn view-note-btn" data-day-id="${day.id}" data-entry-id="${entry.id}" title="${tr('label.viewNote', 'Ver nota')}">
                        <img src="img/icons/buttons/note.svg">
                      </button>`;
        });

        html += `   </div>`;

        if (q.actions.length === 0) {
            html += `<div class="slot-detail"><span>-</span></div>`;
        } else {
            q.actions.forEach((action, idx) => {
                // Translate action verbs
                let verb;
                if (action.action === 'Desbravar' || action.action === 'Lead the Way') {
                    verb = tr('action.explored', 'Desbravou');
                } else if (action.action === 'Permanecer' || action.action === 'Stay') {
                    verb = tr('action.stayed', 'Permaneceu');
                } else {
                    verb = action.action;
                }

                const actionClass = (action.action === 'Desbravar' || action.action === 'Lead the Way') ? 'text-desbravou' : 'text-permanecer';
                const bgColor = action.color || 'transparent';

                // Translate terrain name if needed
                const terrainNameToKey = {
                    'Planície': 'terrain.plains',
                    'Floresta': 'terrain.forest',
                    'Floresta Sombria': 'terrain.darkForest',
                    'Colinas': 'terrain.hills',
                    'Montanhas': 'terrain.mountains',
                    'Montanhas Altas': 'terrain.highMountains',
                    'Lago ou Rio': 'terrain.lakeOrRiver',
                    'Pantano': 'terrain.swamp',
                    'Charco': 'terrain.marsh',
                    'Ruínas': 'terrain.ruins'
                };
                const terrainKey = terrainNameToKey[action.name];
                const displayTerrainName = terrainKey ? tr(terrainKey, action.name) : action.name;

                html += `<div class="slot-detail">
                            <span class="${actionClass}">${verb}:</span>
                            <img src="${action.image}" alt="${displayTerrainName}" style="background-color: ${bgColor}">
                            <span>${displayTerrainName}</span>
                        </div>`;
            });
        }
        html += `</div>`;
    });

    // Generate HTML for Journal Section separate from the main HTML so we can exclude it from main view
    let journalHtml = '';

    // Always show header and add button in modal


    if (Array.isArray(day.journal) && day.journal.length > 0) {
        journalHtml += `<div class="journal-entries-list">`;
        // Sort by quarter
        const entries = [...day.journal].sort((a, b) => a.quarterIndex - b.quarterIndex);

        entries.forEach(entry => {
            // Translate quarter name
            const quarterNameToKey = {
                'Manhã': 'quarter.morning',
                'Tarde': 'quarter.afternoon',
                'Anoitecer': 'quarter.dusk',
                'Noite': 'quarter.night'
            };
            const rawQuarterName = QUARTERS[entry.quarterIndex] || 'Desconhecido';
            const quarterKey = quarterNameToKey[rawQuarterName];
            const quarterName = quarterKey ? tr(quarterKey, rawQuarterName) : tr('label.unknown', rawQuarterName);

            journalHtml += `<div class="journal-entry" data-entry-id="${entry.id}">
                        <div class="journal-entry-header">
                            <span class="journal-entry-quarter">${quarterName}</span>
                            <button class="btn-edit-entry-modal std-btn" data-day-index="${day.id - 1}" data-entry-id="${entry.id}"><img src="img/icons/buttons/quill.svg" class="btn-icon"> ${tr('button.edit', 'EDITAR')}</button>
                        </div>
                        <div class="journal-entry-content">${entry.content}</div>
                    </div>`;
        });
        journalHtml += `</div>`;
    }

    journalHtml += `<div class="journal-toggle-container">
                        <button id="btn-add-entry-modal" class="std-btn journal-toggle-btn" data-day-index="${day.id - 1}" >
                            <img src="img/icons/buttons/addentry.svg" class="btn-icon"> ${tr('button.addNote', 'ADICIONAR ANOTAÇÃO')}
                        </button>
                    </div>`;

    // Update containers
    // detailsMain gets only the base HTML (without journal)
    if (detailsMain) detailsMain.innerHTML = html;

    // detailsModal gets base HTML + Journal
    if (detailsModal) detailsModal.innerHTML = html + journalHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    // Check for Save State
    const hasSave = !!localStorage.getItem('fbl_hexflower_save');

    if (hasSave) {
        // If save exists, show main content immediately (will be populated by auto-load)
        document.body.classList.remove('onboarding-active');
    } else {
        // No save, show onboarding screen
        document.body.classList.add('onboarding-active');
    }

    // Initial Start Button - opens date selection modal
    const initialStartBtn = document.getElementById('btn-initial-start');
    if (initialStartBtn) {
        initialStartBtn.addEventListener('click', () => {
            const startModal = document.getElementById('start-game-modal');
            if (startModal) startModal.style.display = 'block';
        });
    }

    // Load Button in Onboarding - triggers file input
    const loadBtnOnboarding = document.getElementById('btn-load-game-onboarding');
    const fileInputLoad = document.getElementById('file-input-load');
    if (loadBtnOnboarding && fileInputLoad) {
        loadBtnOnboarding.addEventListener('click', () => {
            fileInputLoad.click();
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
            // Translation helper
            const tr = (key, fallback) => {
                if (typeof t === 'function') {
                    const translated = t(key);
                    if (translated && translated !== key) return translated;
                }
                return fallback;
            };

            if (toggleMounted.checked) {
                labelMounted.textContent = tr('label.allMountedYes', 'Todos Montados!');
            } else {
                labelMounted.textContent = tr('label.allMounted', 'Todos Montados?');
            }
        });
    }
    initializeJournal();
    initializeModalJournal();
});


let editingEntryId = null;

let editingDayIndex = null;

function initializeJournal() {
    const editor = document.getElementById('journal-editor');
    const toolbar = document.querySelector('.editor-toolbar');
    const colorPicker = document.getElementById('editor-color');
    const btnSave = document.getElementById('btn-save-entry');
    const btnUpdate = document.getElementById('btn-update-entry');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const selectQuarter = document.getElementById('journal-quarter-select');

    // Journal section toggle
    const journalSection = document.getElementById('journal-section');
    const btnToggleJournal = document.getElementById('btn-toggle-journal');
    const btnCloseJournal = document.getElementById('btn-close-journal');

    if (btnToggleJournal && journalSection) {
        btnToggleJournal.addEventListener('click', () => {
            journalSection.classList.remove('hidden');
            btnToggleJournal.classList.add('hidden');
        });
    }

    if (btnCloseJournal && journalSection) {
        btnCloseJournal.addEventListener('click', () => {
            journalSection.classList.add('hidden');
            if (btnToggleJournal) {
                btnToggleJournal.classList.remove('hidden');
            }
        });
    }

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

    // Save button (new entries only)
    btnSave.addEventListener('click', () => {
        const content = editor.innerHTML;
        if (!content.trim()) return;

        const dayIndex = editingDayIndex !== null ? editingDayIndex : gameState.currentDayIndex;
        const currentDay = calendarData[dayIndex];
        const quarterVal = parseInt(selectQuarter.value);

        // Ensure journal is array
        if (!Array.isArray(currentDay.journal)) {
            currentDay.journal = [];
        }

        // New Entry
        const newEntry = {
            id: Date.now(),
            quarterIndex: quarterVal,
            content: content,
            timestamp: Date.now()
        };
        currentDay.journal.push(newEntry);

        // Create a copy of the index we used for potential refresh
        const savedDayIndex = dayIndex;

        editor.innerHTML = '';
        renderJournalEntries();
        showDayDetails(calendarData[savedDayIndex]);

        editingEntryId = null;
        editingDayIndex = null;
        saveToLocalStorage();
        autoSave();
    });

    // Update button (editing existing entries)
    if (btnUpdate) {
        btnUpdate.addEventListener('click', () => {
            const content = editor.innerHTML;
            if (!content.trim() || editingEntryId === null) return;

            const dayIndex = editingDayIndex !== null ? editingDayIndex : gameState.currentDayIndex;
            const currentDay = calendarData[dayIndex];
            const quarterVal = parseInt(selectQuarter.value);

            // Update existing entry
            const entryIndex = currentDay.journal.findIndex(e => e.id === editingEntryId);
            if (entryIndex > -1) {
                currentDay.journal[entryIndex].content = content;
                currentDay.journal[entryIndex].quarterIndex = quarterVal;
            }

            // Reset button visibility (show save, hide update and cancel)
            if (btnSave) btnSave.style.display = 'inline-flex';
            btnUpdate.style.display = 'none';
            if (btnCancel) btnCancel.style.display = 'none';

            const savedDayIndex = dayIndex;
            editor.innerHTML = '';
            renderJournalEntries();
            showDayDetails(calendarData[savedDayIndex]);

            editingEntryId = null;
            editingDayIndex = null;
            saveToLocalStorage();
            autoSave();
        });
    }

    // Cancel button
    btnCancel.addEventListener('click', () => {
        editingEntryId = null;
        editingDayIndex = null;
        editor.innerHTML = '';

        // Reset button visibility (show save, hide update and cancel)
        if (btnSave) btnSave.style.display = 'inline-flex';
        if (btnUpdate) btnUpdate.style.display = 'none';
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

        // Translation helper
        const tr = (key, fallback) => {
            if (typeof t === 'function') {
                const translated = t(key);
                if (translated && translated !== key) return translated;
            }
            return fallback;
        };

        // Translate quarter name
        const quarterNameToKey = {
            'Manhã': 'quarter.morning',
            'Tarde': 'quarter.afternoon',
            'Anoitecer': 'quarter.dusk',
            'Noite': 'quarter.night'
        };
        const rawQuarterName = QUARTERS[entry.quarterIndex] || 'Desconhecido';
        const quarterKey = quarterNameToKey[rawQuarterName];
        const quarterName = quarterKey ? tr(quarterKey, rawQuarterName) : tr('label.unknown', rawQuarterName);

        entryEl.innerHTML = `
            <div class="journal-entry-header">
                <span class="journal-entry-quarter">${quarterName}</span>
                <div class="journal-entry-actions">
                    <button class="btn-edit-entry std-btn" data-id="${entry.id}"><img src="img/icons/buttons/quill.svg" class="btn-icon"> ${tr('button.edit', 'EDITAR')}</button>
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
    const btnUpdate = document.getElementById('btn-update-entry');
    const btnCancel = document.getElementById('btn-cancel-edit');

    // Make sure journal section is visible
    const journalSection = document.getElementById('journal-section');
    const btnToggleJournal = document.getElementById('btn-toggle-journal');
    if (journalSection) journalSection.classList.remove('hidden');
    if (btnToggleJournal) btnToggleJournal.classList.add('hidden');

    editingEntryId = entry.id;

    // Load entry content
    editor.innerHTML = entry.content;
    selectQuarter.value = entry.quarterIndex;

    // Show update and cancel buttons, hide save button when editing
    if (btnSave) btnSave.style.display = 'none';
    if (btnUpdate) btnUpdate.style.display = 'inline-flex';
    if (btnCancel) btnCancel.style.display = 'flex'; // Flex for std-btn

    // Scroll to editor
    editor.scrollIntoView({ behavior: 'smooth' });
}

function initializeModalJournal() {
    // --- Elements ---
    const modalEditorContainer = document.getElementById('modal-journal-section');
    const modalEditor = document.getElementById('modal-journal-editor');
    const modalToolbar = document.querySelector('.modal-editor-toolbar');
    const modalColorPicker = document.getElementById('modal-editor-color'); // Optional if separate
    const modalBtnSave = document.getElementById('modal-btn-save-entry');
    const modalBtnUpdate = document.getElementById('modal-btn-update-entry');
    const modalBtnClose = document.getElementById('modal-btn-close-journal');
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
    // Note: If using the same color picker ID, this might conflict, but usually IDs are unique.
    // Assuming 'modal-editor-color' exists.
    const modalColorInput = document.getElementById('modal-editor-color');
    if (modalColorInput) {
        modalColorInput.addEventListener('input', (e) => {
            document.execCommand('foreColor', false, e.target.value);
            modalEditor.focus();
        });
    }

    // --- Global Click Listener for Dynamic Buttons in Modal ---
    document.body.addEventListener('click', (e) => {
        // "Adicionar Entrada" Button
        const btnAdd = e.target.closest('#btn-add-entry-modal');
        if (btnAdd) {
            const dayIndex = parseInt(btnAdd.dataset.dayIndex);
            if (!isNaN(dayIndex)) {
                editingDayIndex = dayIndex; // Set context
                editingEntryId = null; // New entry

                modalEditor.innerHTML = ''; // Clear editor
                if (modalSelectQuarter) modalSelectQuarter.value = 0; // Default

                if (btnAdd) btnAdd.style.display = 'none'; // Hide add button
                modalBtnSave.innerHTML = `<img src="img/icons/buttons/addentry.svg" class="btn-icon"> <span data-i18n="button.saveEntryModal">${typeof t === 'function' ? t('button.saveEntryModal') : 'SALVAR ENTRADA'}</span>`;
                modalEditorContainer.classList.remove('hidden');
                modalEditorContainer.style.display = 'block'; // Show editor
                // Scroll to editor
                modalEditorContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // "Editar" Button (inside journal entry list in modal)
        const btnEdit = e.target.closest('.btn-edit-entry-modal');
        if (btnEdit) {
            const dayIndex = parseInt(btnEdit.dataset.dayIndex);
            const entryId = parseInt(btnEdit.dataset.entryId);

            if (!isNaN(dayIndex) && !isNaN(entryId)) {
                editingDayIndex = dayIndex;
                editingEntryId = entryId;

                const day = calendarData[dayIndex];
                const entry = day.journal.find(en => en.id === entryId);

                if (entry) {
                    const btnAdd = document.getElementById('btn-add-entry-modal');
                    if (btnAdd) btnAdd.style.display = 'none'; // Hide add button

                    modalEditor.innerHTML = entry.content;
                    if (modalSelectQuarter) modalSelectQuarter.value = entry.quarterIndex;

                    // Show update and cancel buttons, hide save button when editing
                    if (modalBtnSave) modalBtnSave.style.display = 'none';
                    if (modalBtnUpdate) modalBtnUpdate.style.display = 'inline-flex';
                    if (modalBtnCancel) modalBtnCancel.style.display = 'inline-flex';

                    modalEditorContainer.classList.remove('hidden');
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
            modalEditorContainer.classList.add('hidden');
            modalEditorContainer.style.display = 'none'; // Hide editor after save

            // Reset button visibility (show save, hide update and cancel)
            if (modalBtnSave) modalBtnSave.style.display = 'inline-flex';
            if (modalBtnUpdate) modalBtnUpdate.style.display = 'none';
            if (modalBtnCancel) modalBtnCancel.style.display = 'none';

            const btnAdd = document.getElementById('btn-add-entry-modal');
            if (btnAdd) btnAdd.style.display = 'inline-flex'; // Show add button again

            // Refresh Modal View
            showDayDetails(currentDay);

            // Refresh calendar grid to update has-journal highlighting (preserve current viewing day)
            renderCalendarGrid(true);

            // If we modified the current day, also refresh main page journal list
            if (editingDayIndex === gameState.currentDayIndex) {
                renderJournalEntries();
            }
            editingDayIndex = null;
            saveToLocalStorage(); // Auto-save
            autoSave();
        });
    }

    // --- Update Action (for editing existing entries) ---
    if (modalBtnUpdate) {
        modalBtnUpdate.addEventListener('click', () => {
            const content = modalEditor.innerHTML;
            if (!content.trim() || editingDayIndex === null || editingEntryId === null) return;

            const currentDay = calendarData[editingDayIndex];

            // Update existing entry
            const entryIndex = currentDay.journal.findIndex(e => e.id === editingEntryId);
            if (entryIndex !== -1) {
                const quarterVal = parseInt(modalSelectQuarter.value);
                currentDay.journal[entryIndex].content = content;
                currentDay.journal[entryIndex].quarterIndex = quarterVal;
                currentDay.journal[entryIndex].timestamp = Date.now();
            }

            // Reset and Refresh
            editingEntryId = null;
            modalEditor.innerHTML = '';
            modalEditorContainer.classList.add('hidden');
            modalEditorContainer.style.display = 'none';

            // Reset button visibility (show save, hide update and cancel)
            if (modalBtnSave) modalBtnSave.style.display = 'inline-flex';
            modalBtnUpdate.style.display = 'none';
            if (modalBtnCancel) modalBtnCancel.style.display = 'none';

            const btnAdd = document.getElementById('btn-add-entry-modal');
            if (btnAdd) btnAdd.style.display = 'inline-flex';

            // Refresh Modal View
            showDayDetails(currentDay);
            renderCalendarGrid(true);

            if (editingDayIndex === gameState.currentDayIndex) {
                renderJournalEntries();
            }
            editingDayIndex = null;
            saveToLocalStorage();
            autoSave();
        });
    }

    // --- Cancel Action ---
    if (modalBtnCancel) {
        modalBtnCancel.addEventListener('click', () => {
            editingEntryId = null;
            editingDayIndex = null;
            modalEditor.innerHTML = '';
            modalEditorContainer.classList.add('hidden');
            modalEditorContainer.style.display = 'none';

            // Reset button visibility (show save, hide update and cancel)
            if (modalBtnSave) modalBtnSave.style.display = 'inline-flex';
            if (modalBtnUpdate) modalBtnUpdate.style.display = 'none';
            modalBtnCancel.style.display = 'none';

            const btnAdd = document.getElementById('btn-add-entry-modal');
            if (btnAdd) btnAdd.style.display = 'inline-flex';
        });
    }

    // --- Close Action ---
    if (modalBtnClose) {
        modalBtnClose.addEventListener('click', () => {
            editingEntryId = null;
            editingDayIndex = null;
            modalEditor.innerHTML = '';
            modalEditorContainer.classList.add('hidden');
            modalEditorContainer.style.display = 'none';

            const btnAdd = document.getElementById('btn-add-entry-modal');
            if (btnAdd) btnAdd.style.display = 'inline-flex';
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
        currentDayDisplay.innerHTML = typeof t === 'function' ? t('masthead.selectMonthDay') : 'Selecione o mês e dia para iniciar';
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
    function populateMonthSelect() {
        const currentValue = selectMonth.value;
        selectMonth.innerHTML = '';
        CALENDAR_CONFIG.months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            // Use translation if available and valid, otherwise fallback to Portuguese name
            if (typeof t === 'function' && month.i18nKey) {
                const translated = t(month.i18nKey);
                // Check if translation is valid (not returning the key itself)
                option.textContent = (translated && translated !== month.i18nKey) ? translated : month.name;
            } else {
                option.textContent = month.name;
            }
            selectMonth.appendChild(option);
        });
        // Restore selection if it was set
        if (currentValue) selectMonth.value = currentValue;
    }

    populateMonthSelect();

    // Update month names when language changes
    window.addEventListener('languageChanged', populateMonthSelect);

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

    // Translated label for the center hexagon (3N)
    const currentLabel = (typeof t === 'function') ? t('nav.current') : 'Atual';

    if (currentMonthName === 'Minguaprimavera') {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '6, 11', q: 0, r: 1 },
            { name: '3N', label: currentLabel, q: 1, r: 1 },
            { name: '4N', label: '2, 7', q: 2, r: 1 },
            { name: '5N', label: '5, 10', q: 0, r: 2 },
            { name: '6N', label: '4, 9', q: 1, r: 2 },
            { name: '7N', label: '3, 8', q: 2, r: 2 }
        ];
    } else if (['Cresceverão', 'Minguaverão'].includes(currentMonthName)) {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '10, 11', q: 0, r: 1 },
            { name: '3N', label: currentLabel, q: 1, r: 1 },
            { name: '4N', label: '2, 3', q: 2, r: 1 },
            { name: '5N', label: '8, 9', q: 0, r: 2 },
            { name: '6N', label: '6, 7', q: 1, r: 2 },
            { name: '7N', label: '4, 5', q: 2, r: 2 }
        ];
    } else if (currentMonthName === 'Cresceoutono') {
        hexConfig = [
            { name: '1N', label: '2, 12', q: 1, r: 0 },
            { name: '2N', label: '3, 4', q: 0, r: 1 },
            { name: '3N', label: currentLabel, q: 1, r: 1 },
            { name: '4N', label: '5, 6', q: 2, r: 1 },
            { name: '5N', label: '9, 10', q: 0, r: 2 },
            { name: '6N', label: '11', q: 1, r: 2 },
            { name: '7N', label: '7, 8', q: 2, r: 2 }
        ];
    } else if (['Cresceprimavera', 'Cresceinverno', 'Minguainverno'].includes(currentMonthName)) {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '10, 11', q: 0, r: 1 },
            { name: '3N', label: currentLabel, q: 1, r: 1 },
            { name: '4N', label: '2, 3', q: 2, r: 1 },
            { name: '5N', label: '8, 9', q: 0, r: 2 },
            { name: '6N', label: '6, 7', q: 1, r: 2 },
            { name: '7N', label: '4, 5', q: 2, r: 2 }
        ];
    } else if (currentMonthName === 'Minguaoutono') {
        hexConfig = [
            { name: '1N', label: '12', q: 1, r: 0 },
            { name: '2N', label: '2, 3', q: 0, r: 1 },
            { name: '3N', label: currentLabel, q: 1, r: 1 },
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
            { name: '3N', label: currentLabel, q: 1, r: 1 },
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

        // Translation helper
        const tr = (key, fallback) => {
            if (typeof t === 'function') {
                const translated = t(key);
                if (translated && translated !== key) return translated;
            }
            return fallback;
        };

        if (resultDisplay) resultDisplay.textContent = `${tr('dice.result', 'Resultado')}: ${sum}`;

        // Block logic (retaining checks for hex 2 and 19 edges if applicable)
        // These might need adaptation to DataID vs GridID but using currentSelectedHexagon (DisplayID) matches legacy logic.
        const blockedSums = [2, 3, 4, 5, 6, 12];
        if (currentSelectedHexagon === 2 && blockedSums.includes(sum)) {
            if (resultDisplay) resultDisplay.innerHTML = `${tr('dice.result', 'Resultado')}: ${sum} <span style="color:var(--col-accent-warm)">${tr('dice.blocked', 'BLOQUEADO')}</span>`;
            renderWeatherNavigation('3N');
            return;
        }
        if (currentSelectedHexagon === 19 && sum === 11) {
            if (resultDisplay) resultDisplay.innerHTML = `${tr('dice.result', 'Resultado')}: ${sum} <span style="color:var(--col-accent-warm)">${tr('dice.blocked', 'BLOQUEADO')}</span>`;
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

    const isHot = HOT_MONTHS.includes(currentMonthName);
    const configKey = isHot ? 'hot' : 'cold';

    // Use translations for month label - check if translation is valid (not the key)
    const monthLabelKey = isHot ? 'temp.table.hot' : 'temp.table.cold';
    const monthLabelDefault = isHot ? 'Calor (MESES QUENTES)' : 'Frio (MESES FRIOS)';
    let monthLabel = monthLabelDefault;
    if (typeof t === 'function') {
        const translated = t(monthLabelKey);
        if (translated && translated !== monthLabelKey) {
            monthLabel = translated;
        }
    }

    let d12Label = 'd12';
    if (typeof t === 'function') {
        const translated = t('temp.table.d12');
        if (translated && translated !== 'temp.table.d12') {
            d12Label = translated;
        }
    }

    html = `
        <tr>
            <td>${d12Label}${modString}</td>
            <td>${monthLabel}</td>
        </tr>
    `;

    temperatureDataConfig[configKey].forEach(item => {
        // Use translation if available and valid (not the key itself)
        let fullText = item.full;
        if (typeof t === 'function' && item.i18nKey) {
            const translated = t(item.i18nKey);
            if (translated && translated !== item.i18nKey) {
                fullText = translated;
            }
        }
        html += `
            <tr>
                <td>${item.range}</td>
                <td>${fullText}</td>
            </tr>
        `;
    });

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
            // Translation helper
            const tr = (key, fallback) => {
                if (typeof t === 'function') {
                    const translated = t(key);
                    if (translated && translated !== key) return translated;
                }
                return fallback;
            };
            resultDisplay.innerHTML = `${tr('dice.result', 'Resultado')}: ${total} <span style="color:var(--col-accent-deep)">(${r} ${sign}${mod})</span>`;
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
        deckState: typeof getDeckState === 'function' ? getDeckState() : null,
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

        // Restore Oracle Deck state
        if (data.deckState && typeof restoreDeckState === 'function') {
            restoreDeckState(data.deckState);
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
        document.body.classList.remove('onboarding-active');
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
    a.download = `fbl_tracker_save_${new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-')}.json`;
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
        scrollToJournalEntry(entryId, btn);
    }
});

function scrollToJournalEntry(entryId, triggerBtn = null) {
    let entryEl = null;

    // Determine context (Modal vs Main)
    const isModalClick = triggerBtn && triggerBtn.closest('#calendar-modal');

    if (isModalClick) {
        // Priority: Context is Modal
        const modal = document.getElementById('calendar-modal');
        if (modal) {
            entryEl = modal.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
        }

        // Fallback to main list if not found in modal (should shouldn't happen if logic is sound)
        if (!entryEl) {
            const mainList = document.getElementById('journal-entries-list');
            if (mainList) entryEl = mainList.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
        }

    } else {
        // Priority: Context is Main Page (or unknown)
        const mainList = document.getElementById('journal-entries-list');
        if (mainList) {

            // Self-healing: If main list exists but entry not found, it might be due to a sync issue.
            // Attempt to re-render the journal entries for the current day and look again.
            // We do this BEFORE querying to ensure it's there.
            if (typeof renderJournalEntries === 'function') {
                // Check if we need to render? Actually, just querying is faster.
                entryEl = mainList.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);

                if (!entryEl) {
                    const currentDay = calendarData[gameState.currentDayIndex];
                    // Only re-render if we are looking for an entry that belongs to the current day
                    if (currentDay && Array.isArray(currentDay.journal) && currentDay.journal.some(e => String(e.id) === String(entryId))) {
                        renderJournalEntries();
                        entryEl = mainList.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
                    }
                }
            } else {
                entryEl = mainList.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
            }
        }

        // Fallback to modal if open
        if (!entryEl) {
            const modal = document.getElementById('calendar-modal');
            if (modal && modal.style.display !== 'none') {
                entryEl = modal.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
            }
        }
    }

    // 3. Last Result Fallback: Query globally
    if (!entryEl) {
        // Prefer specific selectors to avoid unintended matches
        entryEl = document.querySelector(`.journal-entry[data-entry-id="${entryId}"]`);
    }

    if (entryEl) {
        entryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Handle both standard focus and tabindex for divs
        if (entryEl.tabIndex === -1) {
            entryEl.setAttribute('tabindex', '-1');
        }
        entryEl.focus({ preventScroll: true });

        // Force highlight animation replay
        entryEl.classList.remove('flash-highlight');
        void entryEl.offsetWidth; // Trigger reflow
        entryEl.classList.add('flash-highlight');

        setTimeout(() => {
            entryEl.classList.remove('flash-highlight');
        }, 3000); // Increased duration for better visibility
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

    // Use original Portuguese name for weatherEffects lookup
    const originalTitle = typeof getOriginalImageTitle === 'function'
        ? getOriginalImageTitle(imagePath)
        : title;

    let content = weatherEffects[originalTitle];

    // Translation helper for fallback message
    const tr = (key, fallback) => {
        if (typeof t === 'function') {
            const translated = t(key);
            if (translated && translated !== key) return translated;
        }
        return fallback;
    };

    if (!content) content = tr('weather.noEffects', 'Sem efeitos adicionais.');

    const modalTitle = document.getElementById('general-info-title');
    const modalContent = document.getElementById('general-info-content');
    const modal = document.getElementById('general-info-modal');
    const mastheadIcon = modal ? modal.querySelector('.masthead-icon img') : null;

    if (modalTitle) modalTitle.textContent = title;
    if (mastheadIcon) mastheadIcon.src = 'img/icons/mastheads/weather.svg';
    if (modalContent) modalContent.innerHTML = content;

    if (modal) {
        modal.style.display = 'block';
    }
}

function showSimplePopup(title, content, iconPath = 'img/icons/mastheads/weather.svg') {
    const modalTitle = document.getElementById('general-info-title');
    const modalContent = document.getElementById('general-info-content');
    const modal = document.getElementById('general-info-modal');
    const mastheadIcon = modal ? modal.querySelector('.masthead-icon img') : null;

    if (modalTitle) modalTitle.textContent = title;
    // Default to weather or info icon for generic popups
    if (mastheadIcon) mastheadIcon.src = iconPath;
    if (modalContent) modalContent.innerHTML = content || "Sem detalhes disponíveis.";

    if (modal) {
        modal.style.display = 'block';
    }
}

// --- Language Change Handler ---
// Update dynamic content when language changes
window.addEventListener('languageChanged', function () {
    // Update temperature table with translated content
    if (typeof updateTemperatureTable === 'function') {
        updateTemperatureTable();
    }
    // Update calendar display with translated content
    if (typeof renderCalendar === 'function' && calendarData.length > 0) {
        renderCalendar();
    }
    // Update hexflower grid with translated month name
    if (typeof renderGrid === 'function' && gameState.currentMonthIndex !== undefined) {
        renderGrid();
    }
    // Update weather navigation with translated 3N label
    if (typeof renderWeatherNavigation === 'function') {
        renderWeatherNavigation();
    }
    // Update terrainDataConfig with new translations
    if (typeof getTerrainDataConfig === 'function') {
        terrainDataConfig = getTerrainDataConfig();
    }
    // Update terrainInfo with new translations
    if (typeof getTerrainInfo === 'function') {
        terrainInfo = getTerrainInfo();
    }
    // Re-initialize terrain modal with translated terrain names
    if (typeof initializeTerrainModal === 'function') {
        initializeTerrainModal();
    }
    // Update COMMON_ROLLS_CONFIG with new translations for roll terms
    if (typeof getCommonRollsConfig === 'function') {
        COMMON_ROLLS_CONFIG = getCommonRollsConfig();
    }
    // Refresh info display to update roll terms
    if (typeof updateInfoDisplay === 'function' && currentInfoMessage) {
        updateInfoDisplay(currentInfoMessage);
    }
    // Refresh journal entries list with translated content
    if (typeof renderJournalEntries === 'function') {
        renderJournalEntries();
    }
});