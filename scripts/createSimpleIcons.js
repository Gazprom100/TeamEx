const fs = require('fs');
const path = require('path');

// Базовая SVG-иконка для TeamEx
const svgTemplate = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#0E131A"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" stroke="#3772FF" stroke-width="${size*0.05}" fill="none"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.2}" fill="#3772FF"/>
</svg>
`;

// Функция для создания PNG из SVG (для этого нужен будет конвертер онлайн)
function createSvgIcon(size, filename) {
  const svgContent = svgTemplate(size);
  fs.writeFileSync(path.join('public', `${filename}.svg`), svgContent);
  console.log(`Создан SVG файл: ${filename}.svg`);
}

// Проверяем наличие директории
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Создаем SVG иконки разных размеров
createSvgIcon(192, 'logo192');
createSvgIcon(512, 'logo512');
createSvgIcon(32, 'favicon');

console.log('\nВажно: SVG файлы созданы. Для преобразования в PNG выполните:');
console.log('1. Откройте SVG файлы в браузере');
console.log('2. Сохраните их как PNG');
console.log('3. Переименуйте favicon.png в favicon.ico'); 