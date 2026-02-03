
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
    marker: { name: 'Marker', lineWidth: 12, color: '#FF6B6B', lineCap: 'round', opacity: 0.6 },
    brush: { name: 'Brush', lineWidth: 20, color: '#4ECDC4', lineCap: 'round', opacity: 0.4 },
    eraser: { name: 'Eraser', lineWidth: 30, color: 'lightblue', lineCap: 'round' }
};

let currentTool = 'pencil';
let currentColor = '#333333';

// Tool button bounds for click detection
let toolButtons = [];
let colorButtons = [];

// Available colors
const colors = ['#000000', '#FF0000', '#00AA00', '#0000FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];

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
    const colorSize = 25;
    const colorGap = 5;

    colors.forEach((color, index) => {
        const x = colorX + (colorSize + colorGap) * index;
        const y = toolY + 12;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, colorSize, colorSize);

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

    isDrawing = true;
    lastX = x;
    lastY = y;
    currentPath = [{ x, y }];
}

function continueDrawing(x, y) {
    if (!isDrawing || currentScreen !== 2) return;

    currentPath.push({ x, y });
    lastX = x;
    lastY = y;
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

