const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Создаем экземпляр бота с токеном (в реальном проекте токен нужно хранить в .env)
const bot = new Telegraf(process.env.BOT_TOKEN);

// Курсы валют (в реальном проекте берутся из API)
const rates = {
  buy: 97.5, // Курс покупки USDT
  sell: 95.5, // Курс продажи USDT
};

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply(
    `👋 Привет, ${ctx.from.first_name}! Я бот TeamEx Exchange.\n\nВы можете совершать операции с криптовалютами прямо здесь или в веб-приложении.`,
    getMainMenu()
  );
});

// Обработчик команды /help
bot.help((ctx) => {
  ctx.reply(
    'TeamEx Exchange - сервис обмена криптовалют.\n\n' +
    'Доступные команды:\n' +
    '/start - Главное меню\n' +
    '/exchange - Обмен валют\n' +
    '/rates - Курсы валют\n' +
    '/wallet - Крипто кошелек\n' +
    '/account - Управление учетной записью\n' +
    '/help - Помощь'
  );
});

// Обработчик текстовых сообщений - рассматриваем их как ввод суммы
bot.on('text', async (ctx) => {
  const state = ctx.session?.state || {};

  // Если пользователь в процессе ввода суммы
  if (state.expectAmount) {
    const amount = parseFloat(ctx.message.text.replace(',', '.'));
    
    if (isNaN(amount) || amount <= 0) {
      return ctx.reply('Пожалуйста, введите корректную сумму в формате числа, например: 1000');
    }
    
    let calculatedAmount, messageText;
    
    if (state.exchangeType === 'buy') {
      calculatedAmount = (amount / rates.buy).toFixed(2);
      messageText = `Вы собираетесь купить ${calculatedAmount} USDT за ${amount} RUB.\n\nКурс: ${rates.buy} RUB/USDT`;
    } else {
      calculatedAmount = (amount * rates.sell).toFixed(2);
      messageText = `Вы собираетесь продать ${amount} USDT и получить ${calculatedAmount} RUB.\n\nКурс: ${rates.sell} RUB/USDT`;
    }
    
    ctx.session = {
      ...ctx.session,
      state: {
        ...state,
        amount,
        calculatedAmount,
        expectAmount: false
      }
    };
    
    return ctx.reply(messageText, getConfirmationMenu());
  }
  
  // Если пользователь в процессе ввода номера карты
  if (state.expectCardNumber) {
    const cardNumber = ctx.message.text.replace(/\D/g, '');
    
    if (cardNumber.length !== 16) {
      return ctx.reply('Пожалуйста, введите корректный номер карты (16 цифр)');
    }
    
    ctx.session = {
      ...ctx.session,
      state: {
        ...state,
        cardNumber,
        expectCardNumber: false
      }
    };
    
    return ctx.reply(
      `Номер карты: ${formatCardNumber(cardNumber)}\n\n` +
      `Выберите способ оплаты:`,
      getPaymentMethodMenu()
    );
  }
  
  // Если ни одно из условий не подходит
  ctx.reply('Выберите действие из меню:', getMainMenu());
});

// Обработчик кнопки "Обмен валют"
bot.action('exchange', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Выберите тип операции:', getExchangeTypeMenu());
});

// Обработчик кнопки "Курсы валют"
bot.action('rates', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `📊 Текущие курсы валют:\n\n` +
    `💵 Покупка USDT: ${rates.buy} ₽\n` +
    `💴 Продажа USDT: ${rates.sell} ₽\n\n` +
    `Курсы обновляются каждые 30 минут.`,
    getBackToMainMenu()
  );
});

// Обработчик кнопки "Крипто кошелек"
bot.action('wallet', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    '💼 Ваш крипто кошелек\n\n' +
    'Здесь будет информация о балансе и история транзакций.\n\n' +
    'Функционал в разработке.',
    getBackToMainMenu()
  );
});

// Обработчик кнопки "Учетная запись"
bot.action('account', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    '👤 Учетная запись\n\n' +
    `Имя: ${ctx.from.first_name} ${ctx.from.last_name || ''}\n` +
    `ID: ${ctx.from.id}\n` +
    `Username: @${ctx.from.username || 'не указан'}\n\n` +
    'Для верификации аккаунта напишите администратору @admin',
    getBackToMainMenu()
  );
});

// Обработчик кнопки "Купить USDT"
bot.action('buy_usdt', (ctx) => {
  ctx.answerCbQuery();
  ctx.session = {
    ...ctx.session,
    state: {
      exchangeType: 'buy',
      expectAmount: true
    }
  };
  ctx.reply(
    '💵 Покупка USDT\n\n' +
    `Текущий курс: ${rates.buy} ₽\n\n` +
    'Введите сумму в рублях, которую хотите обменять:',
    getBackToExchangeMenu()
  );
});

// Обработчик кнопки "Продать USDT"
bot.action('sell_usdt', (ctx) => {
  ctx.answerCbQuery();
  ctx.session = {
    ...ctx.session,
    state: {
      exchangeType: 'sell',
      expectAmount: true
    }
  };
  ctx.reply(
    '💴 Продажа USDT\n\n' +
    `Текущий курс: ${rates.sell} ₽\n\n` +
    'Введите количество USDT, которое хотите продать:',
    getBackToExchangeMenu()
  );
});

// Обработчик кнопки "Отмена"
bot.action('cancel', (ctx) => {
  ctx.answerCbQuery();
  ctx.session = {}; // Сбрасываем состояние
  ctx.reply('Операция отменена.', getMainMenu());
});

// Обработчик кнопки "Назад в меню"
bot.action('back_to_main', (ctx) => {
  ctx.answerCbQuery();
  ctx.session = {}; // Сбрасываем состояние
  ctx.reply('Главное меню:', getMainMenu());
});

// Обработчик кнопки "Назад к обмену"
bot.action('back_to_exchange', (ctx) => {
  ctx.answerCbQuery();
  ctx.session = {}; // Сбрасываем состояние
  ctx.reply('Выберите тип операции:', getExchangeTypeMenu());
});

// Обработчик кнопки "Подтвердить"
bot.action('confirm', (ctx) => {
  ctx.answerCbQuery();
  const state = ctx.session?.state || {};
  
  if (state.exchangeType === 'buy') {
    // Если покупка USDT, запрашиваем номер карты
    ctx.session = {
      ...ctx.session,
      state: {
        ...state,
        expectCardNumber: true
      }
    };
    ctx.reply('Введите номер вашей банковской карты для зачисления средств:');
  } else {
    // Если продажа USDT, сразу переходим к выбору способа оплаты
    ctx.reply('Выберите способ оплаты:', getPaymentMethodMenu());
  }
});

// Обработчики кнопок способов оплаты
['tinkoff', 'sber', 'alfabank', 'qiwi', 'yoomoney'].forEach(method => {
  bot.action(method, (ctx) => {
    ctx.answerCbQuery();
    const state = ctx.session?.state || {};
    
    ctx.session = {
      ...ctx.session,
      state: {
        ...state,
        paymentMethod: method
      }
    };
    
    // Формируем сообщение с заявкой
    const exchangeType = state.exchangeType;
    const amount = state.amount;
    const calculatedAmount = state.calculatedAmount;
    const cardNumber = state.cardNumber ? formatCardNumber(state.cardNumber) : 'Не указан';
    
    let paymentMethodName;
    switch (method) {
      case 'tinkoff': paymentMethodName = 'Тинькофф'; break;
      case 'sber': paymentMethodName = 'Сбербанк'; break;
      case 'alfabank': paymentMethodName = 'Альфа-Банк'; break;
      case 'qiwi': paymentMethodName = 'QIWI'; break;
      case 'yoomoney': paymentMethodName = 'ЮMoney'; break;
      default: paymentMethodName = method;
    }
    
    const messageText = 
      `✅ Заявка принята!\n\n` +
      `Тип операции: ${exchangeType === 'buy' ? 'Покупка USDT' : 'Продажа USDT'}\n` +
      `Сумма: ${amount} ${exchangeType === 'buy' ? 'RUB' : 'USDT'}\n` +
      `Вы получите: ${calculatedAmount} ${exchangeType === 'buy' ? 'USDT' : 'RUB'}\n` +
      `Курс: ${exchangeType === 'buy' ? rates.buy : rates.sell} RUB/USDT\n` +
      `Способ оплаты: ${paymentMethodName}\n` +
      (exchangeType === 'buy' ? `Номер карты: ${cardNumber}\n` : '') +
      `\nОжидайте сообщения от оператора для продолжения обмена.`;
    
    ctx.reply(messageText, getBackToMainMenu());
    
    // В реальном проекте здесь будет отправка заявки на сервер или в админ-чат
    console.log('New order:', {
      user_id: ctx.from.id,
      username: ctx.from.username,
      type: exchangeType,
      amount: parseFloat(amount),
      total: parseFloat(calculatedAmount),
      payment_method: method,
      card_number: state.cardNumber
    });
    
    // Сбрасываем состояние
    ctx.session = {};
  });
});

// Функция для форматирования номера карты (добавляет пробелы)
function formatCardNumber(cardNumber) {
  const parts = [];
  for (let i = 0; i < cardNumber.length; i += 4) {
    parts.push(cardNumber.substring(i, i + 4));
  }
  return parts.join(' ');
}

// Клавиатура главного меню
function getMainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💱 Обмен валют', 'exchange')],
    [Markup.button.callback('📊 Курсы валют', 'rates')],
    [Markup.button.callback('💼 Крипто кошелек', 'wallet')],
    [Markup.button.callback('👤 Учетная запись', 'account')],
    [Markup.button.webApp('🌐 Открыть веб-приложение', 'https://teamex.onrender.com')]
  ]);
}

// Клавиатура выбора типа обмена
function getExchangeTypeMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💵 Купить USDT', 'buy_usdt')],
    [Markup.button.callback('💴 Продать USDT', 'sell_usdt')],
    [Markup.button.callback('« Назад', 'back_to_main')]
  ]);
}

// Клавиатура подтверждения обмена
function getConfirmationMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Подтвердить', 'confirm')],
    [Markup.button.callback('❌ Отмена', 'cancel')]
  ]);
}

// Клавиатура выбора способа оплаты
function getPaymentMethodMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Тинькофф', 'tinkoff')],
    [Markup.button.callback('Сбербанк', 'sber')],
    [Markup.button.callback('Альфа-Банк', 'alfabank')],
    [Markup.button.callback('QIWI', 'qiwi')],
    [Markup.button.callback('ЮMoney', 'yoomoney')],
    [Markup.button.callback('❌ Отмена', 'cancel')]
  ]);
}

// Клавиатура возврата в главное меню
function getBackToMainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('« Назад в меню', 'back_to_main')]
  ]);
}

// Клавиатура возврата к выбору типа обмена
function getBackToExchangeMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('« Назад', 'back_to_exchange')]
  ]);
}

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущен!');
}).catch(err => {
  console.error('Ошибка запуска бота:', err);
});

// Обработка остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 