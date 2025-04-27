# Деплой проекта TeamEx на Render

## Решение проблемы с зависимостями и билдом

Проект TeamEx может быть размещен на сервисе Render. При этом могут возникать некоторые проблемы с билдом, которые решаются следующим образом:

### 1. Проблема: Тип сервиса

**Важно!** Проект должен быть создан как тип "Web Service", а не "Static Site"! 

Static Site на Render только раздает статические файлы и не запускает Node.js сервер. Для нашего проекта, который включает Express сервер и Telegram-бота, необходимо использовать тип "Web Service".

### 2. Проблема: Ошибка "Module not found: Error: Can't resolve 'axios'"

**Решение**: Добавьте axios в зависимости проекта:

```bash
npm install axios --save
```

### 3. Проблема: Ошибка "Module not found: Error: Can't resolve 'react-icons/io5'"

**Решение**: Установите пакет react-icons:

```bash
npm install react-icons --save
```

### 4. Проблема: Ошибка с canvas при установке

**Решение**: Canvas требует системных зависимостей, которые могут отсутствовать в среде Render. Лучше использовать SVG-иконки вместо Canvas:

1. Отключите postinstall скрипт, который запускает build или измените его:
   ```json
   "postinstall": "echo 'Skip build in CI environment' || npm run build"
   ```

2. В Render создайте пустые файлы для иконок:
   ```bash
   touch public/logo192.png
   touch public/logo512.png
   touch public/favicon.ico
   ```

### 5. Настройка переменных окружения

В Render настройте следующие переменные окружения:
- `PORT` - можно оставить пустым, Render назначит свой порт
- `BOT_TOKEN` - токен вашего Telegram-бота

### 6. Команды для Render

- **Build Command**: `npm install && npm run build`
- **Start Command**: `node server.js`

## Другие рекомендации

1. Убедитесь, что в зависимостях указаны все используемые пакеты
2. Проверьте, что версия Node.js в package.json совместима с Render (лучше использовать `"node": ">=16.x"`)
3. После деплоя, проверьте логи на наличие ошибок

## После успешного деплоя

1. Откройте настройки бота в BotFather и обновите webhook на ваш URL в Render:
   ```
   https://yourapp.onrender.com/webhook
   ```

2. Проверьте, что API endpoints работают корректно:
   ```
   https://yourapp.onrender.com/api/rates
   ``` 