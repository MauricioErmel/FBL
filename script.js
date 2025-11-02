// --- CONFIGURAÇÃO -- -
        const HEX_SIZE = 40; // Tamanho do lado de cada hexágono
        const GRID_WIDTH = 5;
        const GRID_HEIGHT = 5;

        // --- INICIALIZAÇÃO ---
        const svg = document.getElementById('grid-svg');
        const toggleNumbers = document.getElementById('toggle-numbers');
        let originalTextWindowContent = '';

        // --- LÓGICA DE RENDERIZAÇÃO ---
        function getHexCorner(x, y, size, i) {
            const angle_deg = 60 * i;
            const angle_rad = Math.PI / 180 * angle_deg;
            return {
                x: x + size * Math.cos(angle_rad),
                y: y + size * Math.sin(angle_rad)
            };
        }

        function createHexagon(q, r, hexWidth, hexHeight, offsetX, offsetY, defs, textContent = null, hasBorder = true, fillImage = null) {
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
        const patternId = `pattern-${q}-${r}`; // Unique ID for the pattern
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
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
        hex.setAttribute('fill', `url(#${patternId})`);
    } else {
        hex.setAttribute('fill', 'url(#hexGradient)');
    }

    svg.appendChild(hex);

    if (textContent !== null) {
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
        text.textContent = textContent;
        svg.appendChild(text);
    }
}

function renderGrid() {
            svg.innerHTML = ''; // Limpa a grade antiga

            const hexWidth = 2 * HEX_SIZE;
            const hexHeight = Math.sqrt(3) * HEX_SIZE;
            const gridTotalWidth = GRID_WIDTH * hexWidth * 0.75 + hexWidth * 0.25;
            const gridTotalHeight = GRID_HEIGHT * hexHeight + hexHeight / 2;

            const offsetX = (500 - gridTotalWidth) / 2;
            const offsetY = (600 - gridTotalHeight) / 2;

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
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
            svg.appendChild(defs);

            createHexagon(1, -1, hexWidth, hexHeight, offsetX, offsetY, defs, '1A', false, 'img/bloqueioEsquerdo.png');
            createHexagon(2, -1, hexWidth, hexHeight, offsetX, offsetY, defs, '0', false, 'img/bloqueioSuperior.png');
            createHexagon(3, -1, hexWidth, hexHeight, offsetX, offsetY, defs, '3A', false, 'img/bloqueioDireito.png');
            createHexagon(2, 5, hexWidth, hexHeight, offsetX, offsetY, defs, '19A', false, 'img/bloqueioInferior.png');

            const removedHexagons = [1, 5, 21, 22, 24, 25];
            let displayNumber = 1;
            for (let hexNumber = 1; hexNumber <= GRID_WIDTH * GRID_HEIGHT; hexNumber++) {
                if (removedHexagons.includes(hexNumber)) {
                    continue;
                }

                const q = (hexNumber - 1) % GRID_WIDTH;
                const r = Math.floor((hexNumber - 1) / GRID_WIDTH);

                const hexWidth = 2 * HEX_SIZE;
                const hexHeight = Math.sqrt(3) * HEX_SIZE;

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
                        hexRed.setAttribute('class', 'droppable-hexagon');
                        hexRed.setAttribute('fill', `url(#${patternRedId})`);
                        hexRed.dataset.q = q;
                        hexRed.dataset.r = r;
                        hexRed.dataset.displayNumber = displayNumber;
                        svg.appendChild(hexRed);

                        // Draw blue polygon
                        const hexBlue = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        hexBlue.setAttribute('points', polyBlue_points);
                        hexBlue.setAttribute('class', 'droppable-hexagon');
                        hexBlue.setAttribute('fill', `url(#${patternBlueId})`);
                        hexBlue.dataset.q = q;
                        hexBlue.dataset.r = r;
                        hexBlue.dataset.displayNumber = displayNumber;
                        svg.appendChild(hexBlue);

                        const hexOutline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        hexOutline.setAttribute('points', points);
                        hexOutline.setAttribute('class', 'hexagon droppable-hexagon');
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
                        hex.setAttribute('class', 'hexagon droppable-hexagon');
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
        }


        function placeMarker(targetDisplayNumber) {
            const marker = document.getElementById('marker');
            const textWindow = document.getElementById('text-window');
            const removedHexagons = [1, 5, 21, 22, 24, 25];
            let displayNumber = 1;

            const hexWidth = 2 * HEX_SIZE;
            const hexHeight = Math.sqrt(3) * HEX_SIZE;
            const gridTotalWidth = GRID_WIDTH * hexWidth * 0.75 + hexWidth * 0.25;
            const gridTotalHeight = GRID_HEIGHT * hexHeight + hexHeight / 2;

            const offsetX = (500 - gridTotalWidth) / 2;
            const offsetY = (600 - gridTotalHeight) / 2;
            for (let hexNumber = 1; hexNumber <= GRID_WIDTH * GRID_HEIGHT; hexNumber++) {
                if (removedHexagons.includes(hexNumber)) {
                    continue;
                }

                if (displayNumber === targetDisplayNumber) {
                    const q = (hexNumber - 1) % GRID_WIDTH;
                    const r = Math.floor((hexNumber - 1) / GRID_WIDTH);

                    const hexWidth = 2 * HEX_SIZE;
                    const hexHeight = Math.sqrt(3) * HEX_SIZE;

                    const x = hexWidth * q * 0.75 + hexWidth / 2 + offsetX;
                    const y = hexHeight * r + (q % 2) * (hexHeight / 2) + hexHeight / 2 + offsetY;

                    marker.style.left = `${x}px`;
                    marker.style.top = `${y}px`;

                    const infoTable = document.getElementById('info-table');
                    const selectedRow = infoTable.querySelector('tr.selected');
                    if (selectedRow) {
                        selectedRow.classList.remove('selected');
                    }

                    originalTextWindowContent = (hexagonData[targetDisplayNumber] && hexagonData[targetDisplayNumber].text) || "";
                    textWindow.innerHTML = originalTextWindowContent;
                    return;
                }
                displayNumber++;
            }
        }

        // --- LÓGICA DE CLIQUE ---
        const marker = document.getElementById('marker');
        svg.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('droppable-hexagon')) {
                const displayNumber = parseInt(target.dataset.displayNumber);
                if (!isNaN(displayNumber)) {
                    placeMarker(displayNumber);
                }
            }
        });

        toggleNumbers.addEventListener('change', () => {
            const texts = document.querySelectorAll('.hex-text');
            texts.forEach(text => {
                text.classList.toggle('hidden', !toggleNumbers.checked);
            });
        });

        // --- EXECUÇÃO INICIAL ---
        renderGrid();
        placeMarker(11);

        const infoTable = document.getElementById('info-table');
        infoTable.addEventListener('click', (e) => {
            const targetRow = e.target.closest('tr');
            // Prevent the first row from being clickable
            if (targetRow && targetRow.rowIndex !== 0) {
                const selectedRow = infoTable.querySelector('tr.selected');
                if (selectedRow) {
                    selectedRow.classList.remove('selected');
                }
                targetRow.classList.add('selected');

                const textWindow = document.getElementById('text-window');
                const lines = originalTextWindowContent.split('<br>');
                const newLines = lines.filter(line => !line.includes('para rolar na tabela de'));
                const newEffect = targetRow.cells[1].innerHTML;
                newLines.push(`✥ ${newEffect}`);
                textWindow.innerHTML = newLines.join('<br>');
            }
        });