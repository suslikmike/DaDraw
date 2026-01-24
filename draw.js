function draw(time, ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    // 2. Рисуем фон
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, width, height);


    // Пример 1: Пульсирующий круг
    let radius = 50 + Math.sin(time / 200) * 20;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(200, 200, radius, 0, Math.PI * 2);
    ctx.fill();

    // Пример 2: Квадрат летит по кругу
    let x = width / 2 + Math.cos(time / 500) * 100;
    let y = height / 2 + Math.sin(time / 500) * 100;
    ctx.fillStyle = "blue";
    ctx.fillRect(x - 25, y - 25, 50, 50);

    // Пример 3: Радужный цвет меняется со временем
    let hue = (time / 10) % 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(width / 2, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    // Пример 4: Текст с временем
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Время: ${Math.floor(time / 1000)} сек`, 50, 50);

    // ----------------------------------------
    // 🖌️ КОНЕЦ РИСОВАНИЯ
    // ----------------------------------------
}
