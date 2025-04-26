const fs = require('fs');
const { createCanvas } = require('canvas');

// Создаем директорию, если она не существует
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Функция для создания круглой иконки
function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Фон
  ctx.fillStyle = '#0E131A';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Внешнее кольцо
  const outerRadius = size * 0.4;
  ctx.strokeStyle = '#3772FF';
  ctx.lineWidth = size * 0.05;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Внутренний круг
  ctx.fillStyle = '#3772FF';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Сохранение в файл
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  
  console.log(`Создан файл: ${filename}`);
}

// Создаем иконки разных размеров
createIcon(192, 'public/logo192.png');
createIcon(512, 'public/logo512.png');
createIcon(32, 'public/favicon.ico'); 