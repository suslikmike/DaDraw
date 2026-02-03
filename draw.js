
// Load pencil icon image
const pencilIcon = new Image();
pencilIcon.src = 'pencil.jpg';

// Load pen icon image
const penIcon = new Image();
penIcon.src = 'pen.jpg';

// Load marker icon image
const markerIcon = new Image();
markerIcon.src = 'marker.png';

//load brush icon image
const brushIcon = new Image();
brushIcon.src = 'paintbrush.png';

// Load eraser icon image
const eraserIcon = new Image();
eraserIcon.src = 'eraser.png';

let currentScreen = 1;

// Store button position for click detection
let buttonBounds = { x: 0, y: 0, width: 250, height: 60 };

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingPaths = []; // Store all drawn paths
let currentPath = []; // Current path being drawn

// Drawing tools
const tools = {
    pencil: { name: 'Pencil', lineWidth: 2, color: '#333333', lineCap: 'round' },
    pen: { name: 'Pen', lineWidth: 4, color: '#000000', lineCap: 'round' },
    marker: { name: 'Highlighter', lineWidth: 12, color: '#FF6B6B', lineCap: 'round', opacity: 0.4 },
    brush: { name: 'Brush', lineWidth: 20, color: '#4ECDC4', lineCap: 'round', opacity: 0.8 },
    eraser: { name: 'Eraser', lineWidth: 30, color: 'lightblue', lineCap: 'round' }
};

let currentTool = 'pencil';
let currentColor = '#333333';

// Tool button bounds for click detection
let toolButtons = [];
let colorButtons = [];

// Available colors - expanded palette
const colors = [
    // Row 1: Basic colors
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    // Row 2: Warm colors
    '#FF6B6B', '#FF8E53', '#FFA500', '#FFD93D', '#F9ED69', '#FDCB6E', '#E17055', '#D63031',
    // Row 3: Cool colors
    '#4ECDC4', '#48DBFB', '#0ABDE3', '#54A0FF', '#5F27CD', '#A29BFE', '#6C5CE7', '#74B9FF',
    // Row 4: Nature colors
    '#95E1D3', '#00B894', '#00CEC9', '#55A3FF', '#26DE81', '#20BF6B', '#0BE881', '#1DD1A1',
    // Row 5: Earth tones
    '#B33939', '#CD6133', '#84817A', '#CC8E35', '#A0522D', '#8B4513', '#DEB887', '#D2B48C',
    // Row 6: Pastels
    '#FFB8B8', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#E8D5B7', '#F0E6EF', '#DCE2F0'
];

// Color palette state
let colorPaletteExpanded = false;
let colorExpandButtonBounds = { x: 0, y: 0, width: 0, height: 0 };

// Zoom and pan state
let zoomLevel = 1;
let panX = 0;
let panY = 0;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5;

// Clear button bounds
let clearButtonBounds = { x: 0, y: 0, width: 0, height: 0 };

function draw(time, ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    if (currentScreen === 1) {
        drawScreen1(time, ctx, width, height);
    } else {
        drawScreen2(time, ctx, width, height);
    }
}

function drawScreen1(time, ctx, width, height) {
    // 2. Рисуем фон
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "black";
    ctx.font = "72px Arial";

    const text = "DaDraw";
    const textWidth = ctx.measureText(text).width;
    const x = (width - textWidth) / 2;
    const y = 100;
    ctx.fillText(text, x, y);

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";

    ctx.fillText("By Mikhail Suslov a beginner to programming", x + 10, 130);





    // Example: draw a circle
    // ctx.beginPath();
    // ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    // ctx.fillStyle = "red";
    // ctx.fill();

    // ========================================
    // end of custom objects
    // ========================================

    // Draw rectangle at bottom
    const rectHeight = 60;
    const rectY = height - rectHeight - 20;
    const rectX = (width - 250) / 2;

    // Update button bounds for click detection
    buttonBounds = { x: rectX, y: rectY, width: 250, height: rectHeight };

    ctx.fillStyle = "lightgreen";
    ctx.fillRect(rectX - 5 , rectY, 250, rectHeight);
    ctx.strokeStyle = "Black";
    ctx.lineWidth = 3;
    ctx.strokeRect(rectX - 5 , rectY, 250, rectHeight);

    // Add text on the rectangle
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    const buttonText = "Start Drawing";
    const buttonTextWidth = ctx.measureText(buttonText).width;
    ctx.fillText(buttonText, (width - buttonTextWidth) / 2, rectY + 38);
}

function drawScreen2(time, ctx, width, height) {
    // Drawing canvas background (white for drawing area)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Save context and apply zoom/pan transformations
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);

    // Draw all saved paths
    drawingPaths.forEach(path => {
        if (path.points.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = path.color;
            ctx.lineWidth = path.lineWidth;
            ctx.lineCap = path.lineCap;
            ctx.globalAlpha = path.opacity || 1;
            ctx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    });

    // Draw current path being drawn
    if (currentPath.length > 1) {
        const tool = tools[currentTool];
        ctx.beginPath();
        ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;
        ctx.lineWidth = tool.lineWidth;
        ctx.lineCap = tool.lineCap;
        ctx.globalAlpha = tool.opacity || 1;
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        for (let i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].x, currentPath[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // Restore context (remove zoom/pan for UI elements)
    ctx.restore();

    // Draw toolbar at top
    const toolbarHeight = 70;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, width, toolbarHeight);
    ctx.fillStyle = "rgb(41,217,254)";
    ctx.fillRect(0, 0, width, toolbarHeight);

    // Draw tool buttons
    toolButtons = [];
    let toolX = 20;
    const toolY = 10;
    const toolSize = 50;
    const toolGap = 10;

    Object.keys(tools).forEach((toolKey, index) => {
        const tool = tools[toolKey];
        const x = toolX + (toolSize + toolGap) * index;

        // Button background
        ctx.fillStyle = currentTool === toolKey ? '#4ECDC4' : '#666666';
        ctx.fillRect(x, toolY, toolSize, toolSize);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, toolY, toolSize, toolSize);

        // Tool name
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(tool.name, x + toolSize/2, toolY + toolSize - 5);

        // Draw tool icon - use image for pencil, px text for others
        if (toolKey === 'pencil' && pencilIcon.complete) {
            ctx.drawImage(pencilIcon, x + 10, toolY + 5, 30, 30);
        } else if (toolKey === 'pen' && penIcon.complete) {
            ctx.drawImage(penIcon, x + 10, toolY + 5, 30, 30);
        } else if (toolKey === 'marker' && markerIcon.complete) {
            ctx.drawImage(markerIcon, x + 10, toolY + 5, 30, 30);
        } else if (toolKey === 'eraser' && eraserIcon.complete) {
            ctx.drawImage(eraserIcon, x + 10, toolY + 5, 30, 30);
        } else if (toolKey === 'brush' && brushIcon.complete) {
            ctx.drawImage(brushIcon, x + 10, toolY + 5, 30, 30);
        } else {
            ctx.font = "bold 12px Arial";
            ctx.fillText(tool.lineWidth + 'px', x + toolSize/2, toolY + 22);
        }
        ctx.textAlign = "left";


        toolButtons.push({ key: toolKey, x, y: toolY, width: toolSize, height: toolSize });
    });

    // Draw color palette
    colorButtons = [];
    const colorX = toolX + (toolSize + toolGap) * 5 + 30;
    const colorSize = 20;
    const colorGap = 3;
    const colorsPerRow = 8;

    // Expand/Collapse button
    const expandBtnX = colorX - 25;
    const expandBtnY = toolY + 15;
    colorExpandButtonBounds = { x: expandBtnX, y: expandBtnY, width: 20, height: 20 };

    ctx.fillStyle = '#444';
    ctx.fillRect(expandBtnX, expandBtnY, 20, 20);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(colorPaletteExpanded ? '−' : '+', expandBtnX + 10, expandBtnY + 15);
    ctx.textAlign = 'left';

    // Determine how many colors to show
    const visibleColors = colorPaletteExpanded ? colors : colors.slice(0, 8);
    const rows = colorPaletteExpanded ? Math.ceil(colors.length / colorsPerRow) : 1;

    // Draw expanded palette background if expanded
    if (colorPaletteExpanded) {
        const paletteWidth = colorsPerRow * (colorSize + colorGap) + 10;
        const paletteHeight = rows * (colorSize + colorGap) + 10;
        ctx.fillStyle = 'rgba(50, 50, 50, 0.95)';
        ctx.fillRect(colorX - 5, toolY + 5, paletteWidth, paletteHeight);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(colorX - 5, toolY + 5, paletteWidth, paletteHeight);
    }

    visibleColors.forEach((color, index) => {
        const row = Math.floor(index / colorsPerRow);
        const col = index % colorsPerRow;
        const x = colorX + (colorSize + colorGap) * col;
        const y = toolY + 10 + (colorSize + colorGap) * row;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, colorSize, colorSize);

        // Border for visibility (especially for white)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, colorSize, colorSize);

        // Highlight selected color
        if (color === currentColor) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 2, y - 2, colorSize + 4, colorSize + 4);
        }

        colorButtons.push({ color, x, y, width: colorSize, height: colorSize });
    });

    // Clear button
    const clearX = width - 100;
    const clearY = toolY + 10;
    clearButtonBounds = { x: clearX, y: clearY, width: 80, height: 35 };

    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(clearX, clearY, 80, 35);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(clearX, clearY, 80, 35);

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Clear', clearX + 40, clearY + 23);
    ctx.textAlign = 'left';

    // Zoom indicator and reset button
    const zoomX = width - 200;
    const zoomY = toolY + 10;
    resetZoomButtonBounds = { x: zoomX, y: zoomY, width: 90, height: 35 };

    ctx.fillStyle = zoomLevel !== 1 ? '#FFD93D' : '#888';
    ctx.fillRect(zoomX, zoomY, 90, 35);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(zoomX, zoomY, 90, 35);

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(zoomLevel * 100) + '%', zoomX + 45, zoomY + 15);
    ctx.font = '10px Arial';
    ctx.fillText('Reset', zoomX + 45, zoomY + 28);
    ctx.textAlign = 'left';

    // Back button at bottom
    const rectHeight = 50;
    const rectY = height - rectHeight - 15;
    const rectX = 20;

    buttonBounds = { x: rectX, y: rectY, width: 120, height: rectHeight };

    ctx.fillStyle = "salmon";
    ctx.fillRect(rectX, rectY, 120, rectHeight);
    ctx.strokeStyle = "Black";
    ctx.lineWidth = 3;
    ctx.strokeRect(rectX, rectY, 120, rectHeight);

    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText("← Back", rectX + 25, rectY + 32);
}

function handleClick(x, y) {
    if (currentScreen === 2) {
        // Check expand/collapse button for color palette
        if (x >= colorExpandButtonBounds.x && x <= colorExpandButtonBounds.x + colorExpandButtonBounds.width &&
            y >= colorExpandButtonBounds.y && y <= colorExpandButtonBounds.y + colorExpandButtonBounds.height) {
            colorPaletteExpanded = !colorPaletteExpanded;
            return;
        }

        // Check tool buttons
        for (const btn of toolButtons) {
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                currentTool = btn.key;
                return;
            }
        }

        // Check color buttons
        for (const btn of colorButtons) {
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                currentColor = btn.color;
                return;
            }
        }

        // Check clear button
        if (x >= clearButtonBounds.x && x <= clearButtonBounds.x + clearButtonBounds.width &&
            y >= clearButtonBounds.y && y <= clearButtonBounds.y + clearButtonBounds.height) {
            drawingPaths = [];
            currentPath = [];
            return;
        }

        // Check reset zoom button
        if (x >= resetZoomButtonBounds.x && x <= resetZoomButtonBounds.x + resetZoomButtonBounds.width &&
            y >= resetZoomButtonBounds.y && y <= resetZoomButtonBounds.y + resetZoomButtonBounds.height) {
            resetZoom();
            return;
        }
    }

    // Check main button (start drawing / go back)
    if (x >= buttonBounds.x && x <= buttonBounds.x + buttonBounds.width &&
        y >= buttonBounds.y && y <= buttonBounds.y + buttonBounds.height) {
        currentScreen = currentScreen === 1 ? 2 : 1;
    }
}

// Drawing functions for mouse events
function startDrawing(x, y) {
    if (currentScreen !== 2) return;
    if (y < 70) return; // Don't draw on toolbar

    // Convert screen coordinates to canvas coordinates
    const canvasCoords = screenToCanvas(x, y);

    isDrawing = true;
    lastX = canvasCoords.x;
    lastY = canvasCoords.y;
    currentPath = [{ x: canvasCoords.x, y: canvasCoords.y }];
}

function continueDrawing(x, y) {
    if (!isDrawing || currentScreen !== 2) return;

    // Convert screen coordinates to canvas coordinates
    const canvasCoords = screenToCanvas(x, y);

    currentPath.push({ x: canvasCoords.x, y: canvasCoords.y });
    lastX = canvasCoords.x;
    lastY = canvasCoords.y;
}

function stopDrawing() {
    if (!isDrawing) return;

    if (currentPath.length > 1) {
        const tool = tools[currentTool];
        drawingPaths.push({
            points: [...currentPath],
            color: currentTool === 'eraser' ? 'white' : currentColor,
            lineWidth: tool.lineWidth,
            lineCap: tool.lineCap,
            opacity: tool.opacity || 1
        });
    }

    isDrawing = false;
    currentPath = [];
}

// Zoom function for scroll wheel
function handleZoom(deltaY, mouseX, mouseY) {
    if (currentScreen !== 2) return;
    if (mouseY < 70) return; // Don't zoom when over toolbar

    const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * zoomFactor));

    // Zoom towards mouse position
    const zoomChange = newZoom / zoomLevel;
    panX = mouseX - (mouseX - panX) * zoomChange;
    panY = mouseY - (mouseY - panY) * zoomChange;

    zoomLevel = newZoom;
}

// Reset zoom
function resetZoom() {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
}

// Convert screen coordinates to canvas coordinates (accounting for zoom/pan)
function screenToCanvas(x, y) {
    return {
        x: (x - panX) / zoomLevel,
        y: (y - panY) / zoomLevel
    };
}

// Reset zoom button bounds
let resetZoomButtonBounds = { x: 0, y: 0, width: 0, height: 0 };

