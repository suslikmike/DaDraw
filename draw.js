
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

// Responsive scaling - base design is 1200px width
function getScale(width) {
    const baseWidth = 1200;
    const minScale = 0.5;
    const maxScale = 1.5;
    return Math.min(maxScale, Math.max(minScale, width / baseWidth));
}

// Check if device is mobile
function isMobile(width) {
    return width < 768;
}

let currentScreen = 1;

// Get current screen (for external access)
function getCurrentScreen() {
    return currentScreen;
}

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

// Current toolbar height (updates based on screen size)
let currentToolbarHeight = 70;

// Grid dots visibility
let showGridDots = true;
let gridDotsButtonBounds = { x: 0, y: 0, width: 0, height: 0 };

// Tool size slider
let toolSizeMultiplier = 1; // 0.5 to 3
let sliderBounds = { x: 0, y: 0, width: 0, height: 0 };
let isDraggingSlider = false;

function draw(time, ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    if (currentScreen === 1) {
        drawScreen1(time, ctx, width, height);
    } else {
        drawScreen2(time, ctx, width, height);
    }
}

function drawScreen1(time, ctx, width, height) {
    const scale = getScale(width);
    const mobile = isMobile(width);

    // Animated gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const hue1 = (time / 50) % 360;
    const hue2 = (hue1 + 60) % 360;
    gradient.addColorStop(0, `hsl(${hue1}, 70%, 85%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 60%, 90%)`);
    gradient.addColorStop(1, `hsl(${(hue1 + 120) % 360}, 70%, 85%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Floating circles animation
    for (let i = 0; i < 8; i++) {
        const circleX = (width / 8) * i + Math.sin(time / 1000 + i) * 30;
        const circleY = height / 2 + Math.cos(time / 800 + i * 2) * 100;
        const radius = 20 + Math.sin(time / 500 + i) * 10;

        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(hue1 + i * 45) % 360}, 60%, 70%, 0.3)`;
        ctx.fill();
    }

    // Title with shadow and glow effect
    const titleSize = Math.max(48, Math.floor(80 * scale));
    const text = "DaDraw";
    const textWidth = ctx.measureText(text).width;
    const x = (width - textWidth) / 2;
    const y = Math.max(120, 150 * scale);

    // Glow effect
    ctx.shadowColor = `hsl(${hue1}, 80%, 50%)`;
    ctx.shadowBlur = 20 + Math.sin(time / 300) * 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Title gradient
    const titleGradient = ctx.createLinearGradient(x, y - titleSize, x + ctx.measureText(text).width, y);
    titleGradient.addColorStop(0, '#FF6B6B');
    titleGradient.addColorStop(0.5, '#4ECDC4');
    titleGradient.addColorStop(1, '#45B7D1');

    ctx.font = `bold ${titleSize}px Arial`;
    ctx.fillStyle = titleGradient;
    ctx.fillText(text, (width - ctx.measureText(text).width) / 2, y);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Subtitle with fade effect
    const subtitleSize = Math.max(12, Math.floor(16 * scale));
    ctx.font = `${subtitleSize}px Arial`;
    ctx.fillStyle = `rgba(80, 80, 80, ${0.7 + Math.sin(time / 500) * 0.3})`;
    const subtitle = "By Mikhail Suslov • Creative Drawing App";
    const subtitleWidth = ctx.measureText(subtitle).width;
    ctx.fillText(subtitle, (width - subtitleWidth) / 2, y + 40 * scale);

    // Draw button with gradient and hover-like effect
    const rectHeight = Math.max(60, 70 * scale);
    const rectWidth = Math.max(220, 280 * scale);
    const rectY = mobile ? height - rectHeight - 120 : height - rectHeight - 50;
    const rectX = (width - rectWidth) / 2;

    // Update button bounds for click detection
    buttonBounds = { x: rectX, y: rectY, width: rectWidth, height: rectHeight };

    // Button shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    // Button gradient with pulsing effect
    const pulse = Math.sin(time / 400) * 0.1 + 0.9;
    const btnGradient = ctx.createLinearGradient(rectX, rectY, rectX, rectY + rectHeight);
    btnGradient.addColorStop(0, `rgba(78, 205, 196, ${pulse})`);
    btnGradient.addColorStop(1, `rgba(69, 183, 209, ${pulse})`);

    // Rounded rectangle
    const radius = 15;
    ctx.beginPath();
    ctx.roundRect(rectX, rectY, rectWidth, rectHeight, radius);
    ctx.fillStyle = btnGradient;
    ctx.fill();

    // Button border
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Button text with icon
    const buttonFontSize = Math.max(20, Math.floor(26 * scale));
    ctx.fillStyle = "white";
    ctx.font = `bold ${buttonFontSize}px Arial`;
    ctx.textAlign = 'center';
    const buttonText = "✨ Start Drawing";
    ctx.fillText(buttonText, width / 2, rectY + rectHeight / 2 + buttonFontSize / 3);
    ctx.textAlign = 'left';

    // Version badge
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
    ctx.fillText('v0.2', width - 40, height - 20);
}

function drawScreen2(time, ctx, width, height) {
    const scale = getScale(width);
    const mobile = isMobile(width);

    // Drawing canvas background (white for drawing area)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Draw grid dots (before zoom transform so they scale with zoom)
    if (showGridDots) {
        ctx.save();
        ctx.translate(panX, panY);
        ctx.scale(zoomLevel, zoomLevel);

        const dotSpacing = 50; // Space between dots
        const dotRadius = 3;
        const canvasWidth = width / zoomLevel + Math.abs(panX / zoomLevel);
        const canvasHeight = height / zoomLevel + Math.abs(panY / zoomLevel);
        const startX = Math.floor(-panX / zoomLevel / dotSpacing) * dotSpacing;
        const startY = Math.floor(-panY / zoomLevel / dotSpacing) * dotSpacing;

        ctx.fillStyle = 'rgba(200, 200, 220, 0.5)';

        for (let x = startX; x < canvasWidth + dotSpacing; x += dotSpacing) {
            for (let y = startY; y < canvasHeight + dotSpacing; y += dotSpacing) {
                ctx.beginPath();
                ctx.arc(x, y, dotRadius / zoomLevel, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // Save context and apply zoom/pan transformations
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);

    // Reset shadows for drawing (prevent UI shadows from affecting strokes)
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

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
        ctx.lineWidth = tool.lineWidth * toolSizeMultiplier;
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

    // Responsive toolbar dimensions
    const toolbarHeight = Math.max(65, Math.floor(75 * scale));
    currentToolbarHeight = toolbarHeight; // Update global for other functions
    const toolSize = mobile ? 42 : Math.max(38, Math.floor(52 * scale));
    const toolGap = mobile ? 6 : Math.max(6, Math.floor(10 * scale));
    const toolY = Math.max(8, Math.floor(12 * scale));

    // Draw toolbar with gradient background
    const toolbarGradient = ctx.createLinearGradient(0, 0, 0, toolbarHeight);
    toolbarGradient.addColorStop(0, '#667eea');
    toolbarGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = toolbarGradient;
    ctx.fillRect(0, 0, width, toolbarHeight);

    // Toolbar bottom border with glow
    ctx.shadowColor = 'rgba(102, 126, 234, 0.5)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, toolbarHeight);
    ctx.lineTo(width, toolbarHeight);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw tool buttons
    toolButtons = [];
    let toolX = Math.max(10, Math.floor(20 * scale));

    Object.keys(tools).forEach((toolKey, index) => {
        const tool = tools[toolKey];
        const x = toolX + (toolSize + toolGap) * index;
        const isSelected = currentTool === toolKey;

        // Button shadow for depth
        if (isSelected) {
            ctx.shadowColor = 'rgba(78, 205, 196, 0.6)';
            ctx.shadowBlur = 12;
        }

        // Button background with gradient
        const btnGradient = ctx.createLinearGradient(x, toolY, x, toolY + toolSize);
        if (isSelected) {
            btnGradient.addColorStop(0, '#4ECDC4');
            btnGradient.addColorStop(1, '#44A08D');
        } else {
            btnGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            btnGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        }

        // Rounded button
        ctx.beginPath();
        ctx.roundRect(x, toolY, toolSize, toolSize, 8);
        ctx.fillStyle = btnGradient;
        ctx.fill();

        // Button border
        ctx.strokeStyle = isSelected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tool name - responsive font
        const toolFontSize = mobile ? 8 : Math.max(8, Math.floor(10 * scale));
        ctx.fillStyle = "white";
        ctx.font = `${isSelected ? 'bold ' : ''}${toolFontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(tool.name, x + toolSize/2, toolY + toolSize - 4);

        // Draw tool icon - responsive sizing
        const iconSize = Math.floor(toolSize * 0.55);
        const iconOffset = (toolSize - iconSize) / 2;

        if (toolKey === 'pencil' && pencilIcon.complete) {
            ctx.drawImage(pencilIcon, x + iconOffset, toolY + 4, iconSize, iconSize);
        } else if (toolKey === 'pen' && penIcon.complete) {
            ctx.drawImage(penIcon, x + iconOffset, toolY + 4, iconSize, iconSize);
        } else if (toolKey === 'marker' && markerIcon.complete) {
            ctx.drawImage(markerIcon, x + iconOffset, toolY + 4, iconSize, iconSize);
        } else if (toolKey === 'eraser' && eraserIcon.complete) {
            ctx.drawImage(eraserIcon, x + iconOffset, toolY + 4, iconSize, iconSize);
        } else if (toolKey === 'brush' && brushIcon.complete) {
            ctx.drawImage(brushIcon, x + iconOffset, toolY + 4, iconSize, iconSize);
        } else {
            ctx.font = `bold ${Math.floor(12 * scale)}px Arial`;
            ctx.fillText(tool.lineWidth + 'px', x + toolSize/2, toolY + toolSize/2);
        }
        ctx.textAlign = "left";

        toolButtons.push({ key: toolKey, x, y: toolY, width: toolSize, height: toolSize });
    });

    // Draw color palette - responsive
    colorButtons = [];
    const colorX = toolX + (toolSize + toolGap) * 5 + Math.floor(25 * scale);
    const colorSize = mobile ? 18 : Math.max(16, Math.floor(22 * scale));
    const colorGap = mobile ? 3 : 4;
    const colorsPerRow = mobile ? 6 : 8;

    // Expand/Collapse button with better styling
    const expandBtnSize = mobile ? 18 : 22;
    const expandBtnX = colorX - expandBtnSize - 8;
    const expandBtnY = toolY + (toolSize - expandBtnSize) / 2;
    colorExpandButtonBounds = { x: expandBtnX, y: expandBtnY, width: expandBtnSize, height: expandBtnSize };

    // Rounded expand button
    ctx.beginPath();
    ctx.roundRect(expandBtnX, expandBtnY, expandBtnSize, expandBtnSize, 5);
    const expandGradient = ctx.createLinearGradient(expandBtnX, expandBtnY, expandBtnX, expandBtnY + expandBtnSize);
    expandGradient.addColorStop(0, colorPaletteExpanded ? '#FF6B6B' : '#4ECDC4');
    expandGradient.addColorStop(1, colorPaletteExpanded ? '#ee5a5a' : '#44A08D');
    ctx.fillStyle = expandGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = `bold ${mobile ? 14 : 16}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(colorPaletteExpanded ? '−' : '+', expandBtnX + expandBtnSize/2, expandBtnY + expandBtnSize * 0.72);
    ctx.textAlign = 'left';

    // Determine how many colors to show
    const visibleColors = colorPaletteExpanded ? colors : colors.slice(0, colorsPerRow);
    const rows = colorPaletteExpanded ? Math.ceil(colors.length / colorsPerRow) : 1;

    // Draw expanded palette background if expanded
    if (colorPaletteExpanded) {
        const paletteWidth = colorsPerRow * (colorSize + colorGap) + 16;
        const paletteHeight = rows * (colorSize + colorGap) + 16;

        // Shadow for palette
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;

        ctx.beginPath();
        ctx.roundRect(colorX - 8, toolY - 4, paletteWidth, paletteHeight, 10);
        ctx.fillStyle = 'rgba(30, 30, 40, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    visibleColors.forEach((color, index) => {
        const row = Math.floor(index / colorsPerRow);
        const col = index % colorsPerRow;
        const x = colorX + (colorSize + colorGap) * col;
        const y = toolY + 6 + (colorSize + colorGap) * row;
        const isSelected = color === currentColor;

        // Draw color with rounded corners
        ctx.beginPath();
        ctx.roundRect(x, y, colorSize, colorSize, 4);
        ctx.fillStyle = color;
        ctx.fill();

        // Border for visibility
        ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();

        // Selection indicator
        if (isSelected) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.roundRect(x - 2, y - 2, colorSize + 4, colorSize + 4, 6);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        colorButtons.push({ color, x, y, width: colorSize, height: colorSize });
    });

    // Clear button - responsive with modern styling
    const clearBtnWidth = mobile ? 65 : Math.max(65, Math.floor(85 * scale));
    const clearBtnHeight = mobile ? 32 : Math.max(32, Math.floor(38 * scale));
    const clearX = width - clearBtnWidth - 12;
    const clearY = toolY + (toolSize - clearBtnHeight) / 2;
    clearButtonBounds = { x: clearX, y: clearY, width: clearBtnWidth, height: clearBtnHeight };

    // Clear button gradient
    const clearGradient = ctx.createLinearGradient(clearX, clearY, clearX, clearY + clearBtnHeight);
    clearGradient.addColorStop(0, '#FF6B6B');
    clearGradient.addColorStop(1, '#ee5253');

    ctx.beginPath();
    ctx.roundRect(clearX, clearY, clearBtnWidth, clearBtnHeight, 8);
    ctx.fillStyle = clearGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = `bold ${mobile ? 12 : 14}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🗑 Clear', clearX + clearBtnWidth/2, clearY + clearBtnHeight/2 + 5);
    ctx.textAlign = 'left';

    // Zoom indicator and reset button - responsive with modern styling
    const zoomBtnWidth = mobile ? 65 : Math.max(75, Math.floor(95 * scale));
    const zoomBtnHeight = clearBtnHeight;
    const zoomX = clearX - zoomBtnWidth - 10;
    const zoomY = clearY;
    resetZoomButtonBounds = { x: zoomX, y: zoomY, width: zoomBtnWidth, height: zoomBtnHeight };

    // Zoom button gradient
    const zoomGradient = ctx.createLinearGradient(zoomX, zoomY, zoomX, zoomY + zoomBtnHeight);
    if (zoomLevel !== 1) {
        zoomGradient.addColorStop(0, '#FFD93D');
        zoomGradient.addColorStop(1, '#f0c929');
    } else {
        zoomGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        zoomGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    }

    ctx.beginPath();
    ctx.roundRect(zoomX, zoomY, zoomBtnWidth, zoomBtnHeight, 8);
    ctx.fillStyle = zoomGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = zoomLevel !== 1 ? '#333' : 'white';
    ctx.font = `bold ${mobile ? 11 : 13}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🔍 ' + Math.round(zoomLevel * 100) + '%', zoomX + zoomBtnWidth/2, zoomY + zoomBtnHeight/2 + 5);
    ctx.textAlign = 'left';

    // Grid dots toggle button
    const gridBtnWidth = mobile ? 40 : Math.max(45, Math.floor(55 * scale));
    const gridBtnHeight = clearBtnHeight;
    const gridX = zoomX - gridBtnWidth - 10;
    const gridY = clearY;
    gridDotsButtonBounds = { x: gridX, y: gridY, width: gridBtnWidth, height: gridBtnHeight };

    // Grid button gradient
    const gridGradient = ctx.createLinearGradient(gridX, gridY, gridX, gridY + gridBtnHeight);
    if (showGridDots) {
        gridGradient.addColorStop(0, '#4ECDC4');
        gridGradient.addColorStop(1, '#44A08D');
    } else {
        gridGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gridGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    }

    ctx.beginPath();
    ctx.roundRect(gridX, gridY, gridBtnWidth, gridBtnHeight, 8);
    ctx.fillStyle = gridGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = `bold ${mobile ? 14 : 16}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(showGridDots ? '⊡' : '⊠', gridX + gridBtnWidth/2, gridY + gridBtnHeight/2 + 6);
    ctx.textAlign = 'left';

    // Tool size slider
    const sliderWidth = mobile ? 80 : Math.max(100, Math.floor(120 * scale));
    const sliderHeight = clearBtnHeight;
    const sliderX = gridX - sliderWidth - 15;
    const sliderY = clearY;
    sliderBounds = { x: sliderX, y: sliderY, width: sliderWidth, height: sliderHeight };

    // Slider background
    ctx.beginPath();
    ctx.roundRect(sliderX, sliderY, sliderWidth, sliderHeight, 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Slider track
    const trackY = sliderY + sliderHeight / 2;
    const trackPadding = 12;
    const trackWidth = sliderWidth - trackPadding * 2;

    ctx.beginPath();
    ctx.moveTo(sliderX + trackPadding, trackY);
    ctx.lineTo(sliderX + sliderWidth - trackPadding, trackY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Slider handle position (0.5 to 3 mapped to track)
    const handleProgress = (toolSizeMultiplier - 0.5) / 2.5; // 0 to 1
    const handleX = sliderX + trackPadding + handleProgress * trackWidth;

    // Slider handle
    ctx.beginPath();
    ctx.arc(handleX, trackY, 8, 0, Math.PI * 2);
    const handleGradient = ctx.createRadialGradient(handleX, trackY, 0, handleX, trackY, 8);
    handleGradient.addColorStop(0, '#FFFFFF');
    handleGradient.addColorStop(1, '#4ECDC4');
    ctx.fillStyle = handleGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Size label
    ctx.fillStyle = 'white';
    ctx.font = `${mobile ? 8 : 9}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Size: ' + toolSizeMultiplier.toFixed(1) + 'x', sliderX + sliderWidth / 2, sliderY + sliderHeight - 3);
    ctx.textAlign = 'left';

    // Back button at bottom - responsive with modern styling
    const backBtnWidth = mobile ? 90 : Math.max(110, Math.floor(130 * scale));
    const backBtnHeight = mobile ? 42 : Math.max(44, Math.floor(52 * scale));
    const rectY = height - backBtnHeight - 15;
    const rectX = 15;

    buttonBounds = { x: rectX, y: rectY, width: backBtnWidth, height: backBtnHeight };

    // Back button shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    // Back button gradient
    const backGradient = ctx.createLinearGradient(rectX, rectY, rectX, rectY + backBtnHeight);
    backGradient.addColorStop(0, '#fa8072');
    backGradient.addColorStop(1, '#e66b5b');

    ctx.beginPath();
    ctx.roundRect(rectX, rectY, backBtnWidth, backBtnHeight, 12);
    ctx.fillStyle = backGradient;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = `bold ${mobile ? 15 : 18}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText("← Back", rectX + backBtnWidth/2, rectY + backBtnHeight/2 + 6);
    ctx.textAlign = 'left';
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

        // Check grid dots toggle button
        if (x >= gridDotsButtonBounds.x && x <= gridDotsButtonBounds.x + gridDotsButtonBounds.width &&
            y >= gridDotsButtonBounds.y && y <= gridDotsButtonBounds.y + gridDotsButtonBounds.height) {
            showGridDots = !showGridDots;
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
    if (y < currentToolbarHeight) return; // Don't draw on toolbar

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
            lineWidth: tool.lineWidth * toolSizeMultiplier,
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
    if (mouseY < currentToolbarHeight) return; // Don't zoom when over toolbar

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

// Slider interaction functions
function handleSliderStart(x, y) {
    if (currentScreen !== 2) return false;

    // Check if click is on slider
    if (x >= sliderBounds.x && x <= sliderBounds.x + sliderBounds.width &&
        y >= sliderBounds.y && y <= sliderBounds.y + sliderBounds.height) {
        isDraggingSlider = true;
        updateSliderValue(x);
        return true;
    }
    return false;
}

function handleSliderMove(x) {
    if (!isDraggingSlider) return false;
    updateSliderValue(x);
    return true;
}

function handleSliderEnd() {
    if (isDraggingSlider) {
        isDraggingSlider = false;
        return true;
    }
    return false;
}

function updateSliderValue(x) {
    const trackPadding = 12;
    const trackWidth = sliderBounds.width - trackPadding * 2;
    const trackStart = sliderBounds.x + trackPadding;

    // Calculate progress (0 to 1)
    let progress = (x - trackStart) / trackWidth;
    progress = Math.max(0, Math.min(1, progress));

    // Map to 0.5 to 3
    toolSizeMultiplier = 0.5 + progress * 2.5;
    toolSizeMultiplier = Math.round(toolSizeMultiplier * 10) / 10; // Round to 1 decimal
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

