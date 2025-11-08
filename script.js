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
        const selectedHexagonContainer = document.getElementById('selected-hexagon-container');
        let originalTextWindowContent = '';
        let currentSelectedHexagon = 11; // Default selected hexagon
        let selectedTemperatureRowIndex = null;
        let selectedTerrainInfo = '';

        function updateInfoDisplay(content) {
            const infoDisplay = document.getElementById('info-display');
            if (infoDisplay) {
                let newContent = content;
                if (selectedTerrainInfo) {
                    if (newContent) {
                        newContent += '<br><br>' + selectedTerrainInfo;
                    } else {
                        newContent = selectedTerrainInfo;
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

        function createHexagon(targetSvg, q, r, hexWidth, hexHeight, offsetX, offsetY, defs, textContent = null, hasBorder = true, fillImage = null) {
    const x = hexWidth * q * 0.75 + hexWidth / 2 + offsetX;
    const y = hexHeight * r + (q % 2) * (hexHeight / 2) + hexHeight / 2 + offsetY;

    let points = "";
    for (let i = 0; i < 6; i++) {
        const corner = getHexCorner(x, y, HEX_SIZE, i);
        points += `${corner.x},${corner.y} `;
    }

    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hex.setAttribute('points', points);
    hex.setAttribute('class', 'hexagon');
    if (hasBorder) {
        hex.setAttribute('stroke', '#333');
        hex.setAttribute('stroke-width', '2');
    }

    if (fillImage) {
        const patternId = `pattern-${q}-${r}-${Date.now()}`; // Unique ID for the pattern
        let pattern = defs.querySelector(`#${patternId}`);
        if (!pattern) {
            pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            pattern.setAttribute('id', patternId);
            pattern.setAttribute('patternContentUnits', 'objectBoundingBox');
            pattern.setAttribute('width', '1');
            pattern.setAttribute('height', '1');
            pattern.setAttribute('viewBox', '0 0 1 1');
            pattern.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('href', fillImage);
            image.setAttribute('x', '0');
            image.setAttribute('y', '0');
            image.setAttribute('width', '1');
            image.setAttribute('height', '1');
            pattern.appendChild(image);
            defs.appendChild(pattern);
        }
        hex.setAttribute('fill', `url(#${patternId})`);
    } else {
        hex.setAttribute('fill', 'url(#hexGradient)');
    }

    targetSvg.appendChild(hex);

    if (textContent !== null) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '20');
        text.setAttribute('class', 'hex-text');

        text.textContent = textContent;
        targetSvg.appendChild(text);
    }
    return hex;
}

        function renderSelectedHexagon(displayNumber) {
            solitarySvg.innerHTML = ''; // Limpa o SVG
            const hexData = hexagonData[displayNumber];
            if (!hexData) return;

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
                    hexRed.setAttribute('class', 'hexagon');
                    hexRed.setAttribute('fill', `url(#${patternRedId})`);
                    solitarySvg.appendChild(hexRed);

                    // Draw blue polygon
                    const hexBlue = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    hexBlue.setAttribute('points', polyBlue_points);
                    hexBlue.setAttribute('class', 'hexagon');
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

        function renderGrid() {
            const modalMapContainer = document.getElementById('modal-map-container');
            modalMapContainer.innerHTML = `
                <div id="map-container">
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" id="toggle-numbers">
                            <span class="slider round"></span>
                        </label>
                        <label for="toggle-numbers">Mostrar/Ocultar Números</label>
                    </div>
                    <svg id="grid-svg" viewBox="0 0 800 600"></svg>
                    <svg id="marker" width="80" height="70" viewBox="-40 -35 80 70">
                        <polygon points="40,0 20,34.64 -20,34.64 -40,0 -20,-34.64 20,-34.64" fill="transparent" stroke="#00FFFF" stroke-width="1.8" pointer-events="all"/>
                    </svg>
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

            // ... (o resto da lógica de renderGrid, adaptada para usar o 'svg' local)
            // This part is complex, I will copy it from the original file and adapt it.
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

                if (hexagonData[displayNumber] && hexagonData[displayNumber].redImage) {
                    const redImageSrc = hexagonData[displayNumber].redImage;
                    const blueImageSrc = hexagonData[displayNumber].blueImage;


                    const patternRedId = `patternRed${displayNumber}`;
                    const patternBlueId = `patternBlue${displayNumber}`;

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
                        imageBlue.setAttribute('x', '0');
                        imageBlue.setAttribute('y', '0');
                        imageBlue.setAttribute('width', '1');
                        imageBlue.setAttribute('height', '1');
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
                        hexRed.setAttribute('class', 'hexagon');
                        hexRed.setAttribute('fill', `url(#${patternRedId})`);
                        hexRed.dataset.q = q;
                        hexRed.dataset.r = r;
                        hexRed.dataset.displayNumber = displayNumber;
                        svg.appendChild(hexRed);

                        // Draw blue polygon
                        const hexBlue = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        hexBlue.setAttribute('points', polyBlue_points);
                        hexBlue.setAttribute('class', 'hexagon');
                        hexBlue.setAttribute('fill', `url(#${patternBlueId})`);
                        hexBlue.dataset.q = q;
                        hexBlue.dataset.r = r;
                        hexBlue.dataset.displayNumber = displayNumber;
                        svg.appendChild(hexBlue);

                        const hexOutline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        hexOutline.setAttribute('points', points);
                        hexOutline.setAttribute('class', 'hexagon');
                        hexOutline.setAttribute('fill', 'transparent');
                        hexOutline.setAttribute('stroke', '#333');
                        hexOutline.setAttribute('stroke-width', '2');
                        hexOutline.dataset.q = q;
                        hexOutline.dataset.r = r;
                        hexOutline.dataset.displayNumber = displayNumber;
                        svg.appendChild(hexOutline);
                    } else {
                        const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        hex.setAttribute('points', points);
                        hex.setAttribute('class', 'hexagon');
                        hex.dataset.displayNumber = displayNumber;
                        hex.setAttribute('fill', `url(#${patternRedId})`);
                        hex.setAttribute('stroke', '#333');
                        hex.setAttribute('stroke-width', '2');
                        hex.dataset.q = q;
                        hex.dataset.r = r;
                        hex.dataset.displayNumber = displayNumber;
                        svg.appendChild(hex);
                    }
                } else {
                    const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    hex.setAttribute('points', points);
                    hex.setAttribute('class', 'hexagon droppable-hexagon');
                    hex.setAttribute('stroke', '#333');
                    hex.setAttribute('stroke-width', '2');
                    hex.dataset.q = q;
                    hex.dataset.r = r;
                    hex.dataset.displayNumber = displayNumber;

                    if (displayNumber === 1 || displayNumber === 2) {
                        hex.setAttribute('fill', 'red');
                    } else {
                        hex.setAttribute('fill', 'url(#hexGradient)');
                    }
                    svg.appendChild(hex);
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
                
                svg.appendChild(text);
            }

            toggleNumbers.addEventListener('change', () => {
                const texts = svg.querySelectorAll('.hex-text');
                texts.forEach(text => {
                    text.classList.toggle('hidden', !toggleNumbers.checked);
                });
            });
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

        function selectHexagon(displayNumber) {
            currentSelectedHexagon = displayNumber;
            renderSelectedHexagon(displayNumber);

            const temperatureTable = document.getElementById('temperature-table');
            
            // Reset temperature selection
            selectedTemperatureRowIndex = null;
            if (temperatureTable) {
                const selectedRow = temperatureTable.querySelector('tr.selected');
                if (selectedRow) {
                    selectedRow.classList.remove('selected');
                }
                temperatureTable.classList.remove('locked');
            }

            if (displayNumber === 1 || displayNumber === 2) {
                if (temperatureTable) {
                    const fourthRow = temperatureTable.getElementsByTagName('tr')[3];
                    if (fourthRow) {
                        fourthRow.classList.add('selected');
                        selectedTemperatureRowIndex = 3;
                        updateTextWithTemperature(fourthRow);
                        temperatureTable.classList.add('locked');
                    }
                }
            }
            
            const textWindow = document.getElementById('text-window');
            if (textWindow) {
                textWindow.classList.add('fade-out');
                setTimeout(() => {
                    placeMarker(displayNumber);
                    textWindow.classList.remove('fade-out');
                }, 300);
            } else {
                placeMarker(displayNumber);
            }
        }


        function placeMarker(targetDisplayNumber) {
            const marker = document.getElementById('marker');
            const textWindow = document.getElementById('text-window');
            const selectedHexagonTitle = document.getElementById('selected-hexagon-title');
            
            originalTextWindowContent = (hexagonData[targetDisplayNumber] && hexagonData[targetDisplayNumber].text) || "";
            if (textWindow) {
                textWindow.innerHTML = originalTextWindowContent;
            }

            if(selectedHexagonTitle) {
                const titleMatch = originalTextWindowContent.match(/<b>(.*?)<\/b>/);
                selectedHexagonTitle.innerHTML = titleMatch ? titleMatch[1] : '';
            }

            if (marker) {
                const removedHexagons = [1, 5, 21, 22, 24, 25];
                let displayNumber = 1;

                const hexWidth = 2 * HEX_SIZE;
                const hexHeight = Math.sqrt(3) * HEX_SIZE;
                const gridTotalWidth = GRID_WIDTH * hexWidth * 0.75 + hexWidth * 0.25;
                const gridTotalHeight = GRID_HEIGHT * hexHeight + hexHeight / 2;

                const offsetX = (800 - gridTotalWidth) / 2;
                const offsetY = (600 - gridTotalHeight) / 2;
                for (let hexNumber = 1; hexNumber <= GRID_WIDTH * GRID_HEIGHT; hexNumber++) {
                    if (removedHexagons.includes(hexNumber)) {
                        continue;
                    }

                    if (displayNumber === targetDisplayNumber) {
                        const q = (hexNumber - 1) % GRID_WIDTH;
                        const r = Math.floor((hexNumber - 1) / GRID_WIDTH);

                        const x = hexWidth * q * 0.75 + hexWidth / 2 + offsetX;
                        const y = hexHeight * r + (q % 2) * (hexHeight / 2) + hexHeight / 2 + offsetY;

                        marker.style.left = `${(x / 800) * 100}%`;
                        marker.style.top = `${(y / 600) * 100}%`;
                        
                        const allHexagons = document.querySelectorAll('.hexagon');
                        allHexagons.forEach(hex => {
                            hex.classList.remove('selected-hex');
                        });

                        const targetHexagons = document.querySelectorAll(`.hexagon[data-display-number="${targetDisplayNumber}"]`);
                        targetHexagons.forEach(hex => {
                            hex.classList.add('selected-hex');
                        });

                        break;
                    }
                    displayNumber++;
                }
            }

            const temperatureTable = document.getElementById('temperature-table');
            if (temperatureTable) {
                const selectedRow = temperatureTable.querySelector('tr.selected');
                if (selectedRow) {
                    updateTextWithTemperature(selectedRow);
                }
            }
        }

        // --- EXECUÇÃO INICIAL ---

        function initializeModal() {
            const modal = document.getElementById('hexagon-modal');
            const closeButton = document.querySelector('.close-button');

            function openModal() {
                modal.style.display = 'block';
                renderGrid();
                placeMarker(currentSelectedHexagon);

                if (selectedTemperatureRowIndex !== null) {
                    const temperatureTable = document.getElementById('temperature-table');
                    const rowToSelect = temperatureTable.getElementsByTagName('tr')[selectedTemperatureRowIndex];
                    if (rowToSelect) {
                        rowToSelect.classList.add('selected');
                        updateTextWithTemperature(rowToSelect);
                    }
                } else if (currentSelectedHexagon === 1 || currentSelectedHexagon === 2) {
                    const temperatureTable = document.getElementById('temperature-table');
                    const fourthRow = temperatureTable.getElementsByTagName('tr')[3];
                    if (fourthRow) {
                        fourthRow.classList.add('selected');
                        updateTextWithTemperature(fourthRow);
                        temperatureTable.classList.add('locked');
                    }
                }

                const gridSvg = document.getElementById('grid-svg');
                if (gridSvg) {
                    gridSvg.addEventListener('click', (e) => {
                        const target = e.target;
                        if (target.classList.contains('hexagon')) {
                            const displayNumber = parseInt(target.dataset.displayNumber);
                            if (!isNaN(displayNumber)) {
                                selectHexagon(displayNumber);
                            }                        }
                    });
                }
            }

            function closeModal() {
                selectedTemperatureRowIndex = null;
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

            // Dice roller and temperature table logic
            const roll2d6Button = document.getElementById('roll-2d6');
            const roll1d12Button = document.getElementById('roll-1d12');
            const result2d6 = document.getElementById('2d6-result');
            const result1d12 = document.getElementById('1d12-result');

            roll2d6Button.addEventListener('click', () => {
                const die1 = getRandomInt(1, 6);
                const die2 = getRandomInt(1, 6);
                result2d6.textContent = `${die1} + ${die2} = ${die1 + die2}`;
            });

            roll1d12Button.addEventListener('click', () => {
                result1d12.textContent = getRandomInt(1, 12);
            });

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            const temperatureTable = document.getElementById('temperature-table');
            temperatureTable.addEventListener('click', (e) => {
                if (temperatureTable.classList.contains('locked')) {
                    return;
                }
                const targetRow = e.target.closest('tr');
                if (targetRow && targetRow.rowIndex !== 0) {
                    const selectedRow = temperatureTable.querySelector('tr.selected');
                    if (selectedRow) {
                        selectedRow.classList.remove('selected');
                    }
                    targetRow.classList.add('selected');
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
                    mainTerrainImage.src = img.src;
                    mainTerrainImage.alt = img.alt;
                    const terrainTitle = document.getElementById('selected-terrain-title');
                    if(terrainTitle) {
                        terrainTitle.textContent = img.alt;
                    }

                    const terrainName = getTerrainName(imageName);
                    selectedTerrainInfo = terrainInfo[terrainName] || '';

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

        document.addEventListener('DOMContentLoaded', () => {
            fetch('modal_weather.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('modal-placeholder').innerHTML = data;
                    initializeModal();
                    selectHexagon(currentSelectedHexagon);
                    initializeTerrainModal();
                });
        });





