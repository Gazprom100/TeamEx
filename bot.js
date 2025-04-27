const { Telegraf, Markup, session } = require('telegraf');
require('dotenv').config();
const path = require('path');

let botInstance = null;

// Функция для инициализации бота
function initBot(token, exchangeRates) {
  // Создаем экземпляр бота
  const bot = new Telegraf(token);
  
  // Middleware для логирования
  bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`[BOT] ${ctx.from?.username || ctx.from?.id}: ${ctx.updateType} ${ctx.updateSubType} (${ms}ms)`);
  });
  
  // Настраиваем сессии пользователей
  bot.use(session());
  
  // Инициализация сессии пользователя
  bot.use((ctx, next) => {
    if (!ctx.session) {
      ctx.session = {};
    }
    if (!ctx.session.user) {
      ctx.session.user = {
        username: ctx.from?.username || 'Anonymous',
        transactions: []
      };
    }
    return next();
  });
  
  // Обработка команды /start
  bot.start((ctx) => {
    console.log(`[BOT] Новый пользователь ${ctx.from.username || ctx.from.id}`);
    
    return ctx.reply(
      `<b>Добро пожаловать в TeamEx Exchange, ${ctx.from.first_name}!</b> 🚀\n\n` +
      `Я помогу вам быстро и безопасно обменять USDT и RUB.\n\n` +
      `Используйте /help для просмотра доступных команд.`,
      {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['💰 Купить USDT', '💸 Продать USDT'],
          ['📊 Курсы', '👤 Профиль'],
          ['❓ Помощь']
        ]).resize()
      }
    );
  });
  
  // Обработка команды /help
  bot.help((ctx) => {
    return ctx.reply(
      '<b>🤖 Команды TeamEx Exchange</b>\n\n' +
      '• /start - Перезапустить бота\n' +
      '• /rates - Текущие курсы обмена\n' +
      '• /profile - Ваш профиль\n' +
      '• /help - Показать это сообщение\n\n' +
      'Вы также можете использовать кнопки внизу 👇',
      { parse_mode: 'HTML' }
    );
  });
  
  // Обработчики для просмотра курсов
  bot.command('rates', (ctx) => showRates(ctx, exchangeRates));
  bot.hears('📊 Курсы', (ctx) => showRates(ctx, exchangeRates));
  
  // Функция для отображения курсов
  function showRates(ctx, rates) {
    return ctx.reply(
      '<b>Текущие курсы обмена</b>\n\n' +
      `Покупка USDT: ${rates.buy} RUB\n` +
      `Продажа USDT: ${rates.sell} RUB\n\n` +
      `Обновлено: ${new Date().toLocaleString('ru-RU')}`,
      { parse_mode: 'HTML' }
    );
  }
  
  // Обработчики для профиля
  bot.command('profile', (ctx) => showProfile(ctx));
  bot.hears('👤 Профиль', (ctx) => showProfile(ctx));
  
  // Функция для отображения профиля
  function showProfile(ctx) {
    const user = ctx.session.user;
    const transactionHistory = user.transactions.length > 0 
      ? user.transactions.map((t, i) => 
          `${i+1}. ${t.type === 'buy' ? 'Покупка' : 'Продажа'} ${t.amount} USDT по ${t.rate} RUB - ${t.date}`
        ).join('\n')
      : 'Транзакций пока нет';
    
    return ctx.reply(
      '<b>Ваш профиль</b>\n\n' +
      `Имя пользователя: ${user.username}\n` +
      `ID: ${ctx.from.id}\n\n` +
      `<b>История транзакций:</b>\n${transactionHistory}`,
      { parse_mode: 'HTML' }
    );
  }
  
  // Обработчики для покупки USDT
  bot.hears('💰 Купить USDT', (ctx) => {
    ctx.session.exchange = { type: 'buy', step: 'amount' };
    return ctx.reply('Сколько USDT вы хотели бы купить?');
  });
  
  // Обработчики для продажи USDT
  bot.hears('💸 Продать USDT', (ctx) => {
    ctx.session.exchange = { type: 'sell', step: 'amount' };
    return ctx.reply('Сколько USDT вы хотели бы продать?');
  });
  
  // Обработчик для кнопки помощи
  bot.hears('❓ Помощь', (ctx) => {
    return ctx.reply(
      'Нужна помощь? Свяжитесь с нашей службой поддержки @TeamExSupport или посетите наш сайт teamex.io',
      Markup.inlineKeyboard([
        Markup.button.url('Посетить сайт', 'https://teamex.io'),
        Markup.button.url('Поддержка', 'https://t.me/TeamExSupport')
      ])
    );
  });
  
  // Обработка текстовых сообщений (для процесса обмена)
  bot.on('text', (ctx) => {
    const exchange = ctx.session.exchange;
    if (!exchange) return;
  
    const text = ctx.message.text;
  
    // Обработка шага ввода суммы
    if (exchange.step === 'amount') {
      const amount = parseFloat(text.replace(',', '.'));
      if (isNaN(amount) || amount <= 0) {
        return ctx.reply('Пожалуйста, введите корректную сумму (положительное число).');
      }
  
      exchange.amount = amount;
      exchange.step = 'card';
      
      const rate = exchange.type === 'buy' ? exchangeRates.buy : exchangeRates.sell;
      const totalRub = (amount * rate).toFixed(2);
      
      if (exchange.type === 'buy') {
        return ctx.reply(`Вы хотите купить ${amount} USDT по курсу ${rate} RUB.\nИтого: ${totalRub} RUB\n\nПожалуйста, введите ваш USDT-кошелек (TRC20):`);
      } else {
        return ctx.reply(`Вы хотите продать ${amount} USDT по курсу ${rate} RUB.\nИтого: ${totalRub} RUB\n\nПожалуйста, введите номер вашей карты для получения RUB:`);
      }
    }
    
    // Обработка шага ввода карты/кошелька
    if (exchange.step === 'card') {
      exchange.cardOrWallet = text;
      exchange.step = 'confirm';
      
      const rate = exchange.type === 'buy' ? exchangeRates.buy : exchangeRates.sell;
      const totalRub = (exchange.amount * rate).toFixed(2);
      
      return ctx.reply(
        `<b>Подтвердите ${exchange.type === 'buy' ? 'покупку' : 'продажу'}</b>\n\n` +
        `Сумма: ${exchange.amount} USDT\n` +
        `Курс: ${rate} RUB\n` +
        `Итого: ${totalRub} RUB\n` +
        `${exchange.type === 'buy' ? 'USDT-кошелек' : 'Номер карты'}: ${exchange.cardOrWallet}\n\n` +
        `Всё верно?`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            Markup.button.callback('✅ Подтвердить', 'confirm_exchange'),
            Markup.button.callback('❌ Отменить', 'cancel_exchange')
          ])
        }
      );
    }
  });
  
  // Обработка подтверждения обмена
  bot.action('confirm_exchange', (ctx) => {
    const exchange = ctx.session.exchange;
    if (!exchange) return ctx.reply('Ваша сессия истекла. Пожалуйста, начните заново.');
    
    const rate = exchange.type === 'buy' ? exchangeRates.buy : exchangeRates.sell;
    const totalRub = (exchange.amount * rate).toFixed(2);
    
    // Добавляем транзакцию в историю пользователя
    ctx.session.user.transactions.push({
      type: exchange.type,
      amount: exchange.amount,
      rate: rate,
      total: totalRub,
      cardOrWallet: exchange.cardOrWallet,
      date: new Date().toLocaleString('ru-RU')
    });
    
    // Отправляем сообщение с подтверждением
    ctx.reply(
      `<b>✅ Транзакция инициирована!</b>\n\n` +
      `Ваш заказ на ${exchange.type === 'buy' ? 'покупку' : 'продажу'} ${exchange.amount} USDT получен.\n\n` +
      `${exchange.type === 'buy' 
        ? `Пожалуйста, переведите ${totalRub} RUB на наш счёт:\n\nБанк: Тинькофф\nКарта: 2200 7007 8291 0534\nИмя: Евгений В.\n\nПосле оплаты отправьте скриншот в @TeamExSupport.` 
        : `Пожалуйста, переведите ${exchange.amount} USDT по адресу:\n\nTRC20: TLn2hv97MsS5tVEPjJYMUuaNcqzWMCahuK\n\nПосле перевода отправьте ID транзакции в @TeamExSupport.`}`,
      { parse_mode: 'HTML' }
    );
    
    // Сбрасываем сессию обмена
    ctx.session.exchange = null;
    
    return ctx.answerCbQuery('Транзакция подтверждена!');
  });
  
  // Обработка отмены обмена
  bot.action('cancel_exchange', (ctx) => {
    ctx.session.exchange = null;
    ctx.reply('Транзакция отменена. Чем ещё я могу помочь?');
    return ctx.answerCbQuery('Транзакция отменена');
  });
  
  // Обработка ошибок
  bot.catch((err, ctx) => {
    console.error(`[BOT] Error for ${ctx.updateType}:`, err);
    return ctx.reply('Произошла ошибка. Пожалуйста, попробуйте снова или обратитесь в поддержку.');
  });
  
  return bot;
}

/**
 * Запускает и инициализирует Telegram-бота
 * @param {string} token - Токен Telegram-бота
 * @returns {Object} Объект с методами управления ботом
 */
function startBot(token) {
  console.log('[BOT] Инициализация Telegram бота...');
  
  try {
    // Получаем текущие курсы из API
    // В реальном приложении это может быть API вызов или данные из БД
    const exchangeRates = {
      buy: 96.5, // Курс покупки USDT (сколько рублей за 1 USDT)
      sell: 95.0  // Курс продажи USDT (сколько рублей за 1 USDT)
    };

    const bot = initBot(token, exchangeRates);
    botInstance = bot;

    // Запуск бота
    bot.launch()
      .then(() => {
        console.log('[BOT] Telegram бот успешно запущен');
      })
      .catch(err => {
        console.error('[BOT] Ошибка запуска бота:', err);
        throw err;
      });

    // Включаем graceful stop
    const stopBot = () => {
      console.log('[BOT] Останавливаем Telegram бота...');
      botInstance.stop();
      botInstance = null;
      console.log('[BOT] Telegram бот остановлен');
    };

    // Возвращаем методы управления ботом
    return {
      bot,
      stopBot
    };
  } catch (error) {
    console.error('[BOT] Критическая ошибка при инициализации бота:', error);
    return {
      stopBot: () => console.log('[BOT] Бот не был запущен из-за ошибки')
    };
  }
}

// Получение названия метода оплаты
function getMethodName(method) {
  const methods = {
    'bank': 'Банковский перевод',
    'card': 'Банковскую карту',
    'sbp': 'Систему быстрых платежей (СБП)'
  };
  return methods[method] || method;
}

module.exports = {
  initBot,
  startBot
}; 