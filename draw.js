

let currentScreen = 1;

// Store button position for click detection
let buttonBounds = { x: 0, y: 0, width: 250, height: 60 };

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
    // Different background for screen 2
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "black";
    ctx.font = "48px Arial";

    const text = "Draw Here!";
    const textWidth = ctx.measureText(text).width;
    const x = (width - textWidth) / 2;
    const y = (height / 2) - 320;
    ctx.fillText(text, x, y);

    // ========================================
    // draw here - add your Screen 2 objects below
    // ========================================

    // Example: draw a rectangle
    // ctx.fillStyle = "purple";
    // ctx.fillRect(100, 200, 150, 100);

    // ========================================
    // end of custom objects
    // ========================================

    // Back button
    const rectHeight = 60;
    const rectY = height - rectHeight - 20;
    const rectX = (width - 250) / 2;

    buttonBounds = { x: rectX, y: rectY, width: 250, height: rectHeight };

    ctx.fillStyle = "salmon";
    ctx.fillRect(rectX, rectY, 250, rectHeight);
    ctx.strokeStyle = "Black";
    ctx.lineWidth = 3;
    ctx.strokeRect(rectX, rectY, 250, rectHeight);

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    const buttonText = "Go Back";
    const buttonTextWidth = ctx.measureText(buttonText).width;
    ctx.fillText(buttonText, (width - buttonTextWidth) / 2, rectY + 38);
}

function handleClick(x, y) {
    if (x >= buttonBounds.x && x <= buttonBounds.x + buttonBounds.width &&
        y >= buttonBounds.y && y <= buttonBounds.y + buttonBounds.height) {
        currentScreen = currentScreen === 1 ? 2 : 1;
    }
}
