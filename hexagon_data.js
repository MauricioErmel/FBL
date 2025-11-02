const hexagonData = {
    1: {
        redImage: 'img/diaQuenteDeSol.png',
        blueImage: null,
        text: ''
    },
    2: {
        redImage: 'img/diaQuenteDeSol.png',
        blueImage: null,
        text: ''
    },
    3: {
        redImage: 'img/temporal.png',
        blueImage: 'img/vento3.png',
        text: ''
    },
    4: {
        redImage: 'img/ceuLimpo.png',
        blueImage: 'img/vento0.png',
        text: ''
    },
    5: {
        redImage: 'img/ceuLimpo.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    6: {
        redImage: 'img/garoa.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    7: {
        redImage: 'img/nuvensPesadas.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    8: {
        redImage: 'img/chuvaForte.png',
        blueImage: 'img/vento3.png',
        text: ''
    },
    9: {
        redImage: 'img/ceuLimpo.png',
        blueImage: 'img/vento1.png',
        text: ''
    },
    10: {
        redImage: 'img/nuvensClaras.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    11: {
        redImage: 'img/garoa.png',
        blueImage: 'img/vento1.png',
        text: ''
    },
    12: {
        redImage: 'img/chuvaLeve.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    13: {
        redImage: 'img/chuvaForte.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    14: {
        redImage: 'img/chuvaLeve.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    15: {
        redImage: 'img/nuvensClaras.png',
        blueImage: 'img/vento1.png',
        text: ''
    },
    16: {
        redImage: 'img/nebuloso.png',
        blueImage: 'img/vento1.png',
        text: ''
    },
    17: {
        redImage: 'img/encoberto.png',
        blueImage: 'img/vento1.png',
        text: ''
    },
    18: {
        redImage: 'img/chuvaLeve.png',
        blueImage: 'img/vento2.png',
        text: ''
    },
    19: {
        redImage: 'img/garoa.png',
        blueImage: 'img/vento0.png',
        text: ''
    }
};

const weatherEffects = {
    'Dia Quente de Sol': '✥ +1 em rolagens de DESBRAVAR<br>✥ <b>Escaldante</b>. Água precisa ser consumida em cada Quarto de Dia para não ficar DESIDRATADO. Personagens usando armadura precisam fazer uma rolagem de Resiliência em cada Quarto de Dia, falha significa -1 de AGILIDADE.',
    'Céu Limpo': '✥ +1 em rolagens de DESBRAVAR',
    'Garoa': '✥ +1 para rolar na tabela de FRIO<br>✥ -1 para rolar na tabela de CALOR<br>✥ -1 em rolagens de DESBRAVAR',
    'Chuva Leve': '✥ +1 para rolar na tabela de FRIO<br>✥ -1 para rolar na tabela de CALOR<br>✥ -1 em rolagens de DESBRAVAR',
    'Chuva Forte': '✥ +2 para rolar na tabela de FRIO<br>✥ -2 para rolar na tabela de CALOR<br>✥ -2 em rolagens de DESBRAVAR<br>✥ CAMINHAR requer uma rolagem de Resiliência',
    'Temporal': '✥ +2 para rolar na tabela de FRIO<br>✥ -2 para rolar na tabela de CALOR<br>✥ -2 em rolagens de DESBRAVAR<br>✥ CAMINHAR requer uma rolagem de Resiliência',
    'Neve': '✥ +2 para rolar na tabela de FRIO<br>✥ -2 em rolagens de DESBRAVAR<br>✥ CAMINHAR requer uma rolagem de Resiliência',
    'Nevasca': '✥ +2 para rolar na tabela de FRIO<br>✥ -2 em rolagens de DESBRAVAR<br>✥ CAMINHAR requer uma rolagem de Resiliência',
    'Sem Vento': '✥ +1 em rolagens de MONTAR ACAMPAMENTO<br>✥ +1 para rolar na tabela de CALOR',
    'Ventando': '✥ +1 para rolar na tabela de FRIO<br>✥ -1 para rolar na tabela de CALOR<br>✥ -1 em rolagens de MONTAR ACAMPAMENTO',
    'Ventania Forte': '✥ +2 para rolar na tabela de FRIO<br>✥ -2 para rolar na tabela de CALOR<br>✥ -2 em rolagens de MONTAR ACAMPAMENTO<br>✥ CAMINHAR requer uma rolagem de Resiliência.'
};

function getImageTitle(imagePath) {
    if (!imagePath) return '';
    const imageName = imagePath.split('/').pop();
    if (imageName === 'ceuLimpo.png') return 'Céu Limpo';
    if (imageName === 'chuvaForte.png') return 'Chuva Forte';
    if (imageName === 'chuvaLeve.png') return 'Chuva Leve';
    if (imageName === 'diaQuenteDeSol.png') return 'Dia Quente de Sol';
    if (imageName === 'encoberto.png') return 'Encoberto';
    if (imageName === 'garoa.png') return 'Garoa';
    if (imageName === 'nebuloso.png') return 'Nebuloso';
    if (imageName === 'nevasca.png') return 'Nevasca';
    if (imageName === 'neve.png') return 'Neve';
    if (imageName === 'nuvensClaras.png') return 'Nuvens Claras';
    if (imageName === 'nuvensPesadas.png') return 'Nuvens Pesadas';
    if (imageName === 'rajadaDeNeve.png') return 'Rajada de Neve';
    if (imageName === 'temporal.png') return 'Temporal';
    if (imageName === 'vento0.png') return 'Sem Vento';
    if (imageName === 'vento1.png') return 'Brisa';
    if (imageName === 'vento2.png') return 'Ventando';
    if (imageName === 'vento3.png') return 'Ventania Forte';
    return '';
}

function parseEffect(effectString) {
    const effectRegex = /✥\s*([+-]\d+)?\s*(.*)/;
    const match = effectString.match(effectRegex);
    if (match) {
        const value = match[1] ? parseInt(match[1]) : null;
        let description = match[2].trim();
        if (description.endsWith('.')) {
            description = description.slice(0, -1);
        }
        return { value, description };
    }
    return null;
}

for (const key in hexagonData) {
    const hexagon = hexagonData[key];
    const redTitle = getImageTitle(hexagon.redImage);
    const blueTitle = getImageTitle(hexagon.blueImage);
    
    let title = '';
    if (redTitle && blueTitle) {
        title = `${redTitle} e ${blueTitle}`;
    } else if (redTitle) {
        title = redTitle;
    } else if (blueTitle) {
        title = blueTitle;
    }

    const redEffectStrings = (redTitle && weatherEffects[redTitle]) ? weatherEffects[redTitle].split('<br>') : [];
    const blueEffectStrings = (blueTitle && weatherEffects[blueTitle]) ? weatherEffects[blueTitle].split('<br>') : [];
    const allEffectStrings = [...redEffectStrings, ...blueEffectStrings];

    const effectsMap = new Map();

    for (const effectString of allEffectStrings) {
        const parsed = parseEffect(effectString);
        if (parsed) {
            const { value, description } = parsed;
            if (effectsMap.has(description)) {
                const existing = effectsMap.get(description);
                if (existing.value !== null && value !== null) {
                    existing.value += value;
                }
            } else {
                effectsMap.set(description, { value });
            }
        }
    }

    const redImageName = hexagon.redImage ? hexagon.redImage.split('/').pop() : null;
    const blueImageName = hexagon.blueImage ? hexagon.blueImage.split('/').pop() : null;

    const conditionRed = ['chuvaForte.png', 'temporal.png', 'neve.png', 'nevasca.png'].includes(redImageName);
    const conditionBlue = blueImageName === 'vento3.png';

    if (conditionRed && conditionBlue) {
        if (effectsMap.has('CAMINHAR requer uma rolagem de Resiliência')) {
            effectsMap.delete('CAMINHAR requer uma rolagem de Resiliência');
            effectsMap.set('CAMINHAR requer uma rolagem de Resiliência com um redutor de -2', { value: null });
        }
    }

    let effectsString = '';
    for (const [description, { value }] of effectsMap.entries()) {
        if (effectsString) effectsString += '<br>';
        
        if (value !== null && value !== 0) {
            const sign = value > 0 ? '+' : '';
            effectsString += `✥ ${sign}${value} ${description}`;
        } else if (value === null) {
            effectsString += `✥ ${description}`;
        }
    }

    if (title) {
        hexagon.text = `<b>${title}</b>`;
        if (effectsString) {
            hexagon.text += `<br>${effectsString}`;
        }
    }
}