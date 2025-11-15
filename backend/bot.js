const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sleo')
  .then(() => console.log('[BOT] MongoDB connected'))
  .catch((err) => console.error('[BOT] MongoDB connection error:', err));

// Models
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  createdAt: { type: Date, default: Date.now },
});

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  telegram: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  skills: { type: String },
  joinDate: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// Initialize Telegram Bot
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TELEGRAM_BOT_TOKEN) {
  console.error('[BOT] TELEGRAM_BOT_TOKEN is not set in .env file');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

console.log('[BOT] Telegram bot started');

async function checkAndSendReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Поиск событий которые завтра
    const events = await Event.find({ date: tomorrowDate }).populate('volunteers');

    for (const event of events) {
      // Отправляем сообщение каждому волонтеру которого в событии
      for (const volunteer of event.volunteers) {
        const message = `📢 НАПОМИНАНИЕ!\n\nЗавтра: <b>${event.name}</b>\n\n📝 Описание: ${event.description || 'Нет описания'}\n\n📍 Место: ${event.location || 'Не указано'}\n\n✅ Ты зарегистрирован на это событие!`;

        try {
          await bot.sendMessage(volunteer.telegram, message, { parse_mode: 'HTML' });
          console.log(`[BOT] Reminder sent to ${volunteer.telegram} for event "${event.name}"`);
        } catch (err) {
          console.error(`[BOT] Failed to send message to ${volunteer.telegram}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('[BOT] Error in checkAndSendReminders:', err);
  }
}

async function logBotStatus() {
  try {
    const volunteerCount = await Volunteer.countDocuments();
    const eventCount = await Event.countDocuments();
    console.log(`[BOT] Status: ${volunteerCount} volunteers, ${eventCount} events in database`);
  } catch (err) {
    console.error('[BOT] Error getting bot status:', err);
  }
}

// Запускается каждый день в 9:00 утра (по времени сервера)
cron.schedule('0 9 * * *', () => {
  console.log('[BOT] Running daily reminder check...');
  checkAndSendReminders();
});

// Также проверяем при старте бота
checkAndSendReminders();

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const username = msg.from.username || 'unknown';
  
  console.log(`[BOT] Message received from @${username}: ${text}`);

  if (text === '/start') {
    const firstName = msg.from.first_name || 'User';
    console.log(`[BOT] /start command from @${username}`);
    bot.sendMessage(
      chatId,
      `Привет ${firstName}! 👋\n\nТвой Telegram: @${username}\n\nЯ бот системы SLEO для управления волонтерами и событиями.\n\nЯ буду отправлять тебе напоминания за день до событий на которых ты зарегистрирован.\n\n/help - список команд\n/events - твои события\n/status - статус подключения`,
      { parse_mode: 'HTML' }
    );
  } else if (text === '/help') {
    console.log(`[BOT] /help command from @${username}`);
    bot.sendMessage(
      chatId,
      `<b>Доступные команды:</b>\n\n/start - Начать работу с ботом\n/events - Показать ближайшие события\n/status - Статус подключения к системе\n/help - Показать эту справку`,
      { parse_mode: 'HTML' }
    );
  } else if (text === '/status') {
    Volunteer.findOne({ telegram: username })
      .then((volunteer) => {
        if (volunteer) {
          console.log(`[BOT] /status - Volunteer found: ${volunteer.name}`);
          bot.sendMessage(
            chatId,
            `✅ Ты зарегистрирован в системе!\n\nТвое имя: ${volunteer.name}\nТелефон: ${volunteer.phone || 'Не указан'}\nНавыки: ${volunteer.skills || 'Не указаны'}\nПрисоединился: ${volunteer.joinDate}`
          );
        } else {
          console.log(`[BOT] /status - Volunteer NOT found for: @${username}`);
          bot.sendMessage(
            chatId,
            `❌ Ты не зарегистрирован в системе волонтеров.\n\nПросите администратора добавить вас с Telegram: @${username}`
          );
        }
      })
      .catch((err) => console.error('[BOT] Error in /status:', err));
  } else if (text === '/events') {
    console.log(`[BOT] /events command from @${username}`);
    Volunteer.findOne({ telegram: username })
      .populate('events')
      .then((volunteer) => {
        if (!volunteer) {
          console.log(`[BOT] /events - Volunteer not found: @${username}`);
          bot.sendMessage(chatId, '❌ Ты не зарегистрирован в системе волонтеров');
          return;
        }

        if (volunteer.events.length === 0) {
          console.log(`[BOT] /events - No events for: @${username}`);
          bot.sendMessage(chatId, '📭 У тебя нет зарегистрированных событий');
          return;
        }

        console.log(`[BOT] /events - Found ${volunteer.events.length} events for: @${username}`);
        let eventsList = `<b>Твои события (${volunteer.events.length}):</b>\n\n`;
        volunteer.events.forEach((event, index) => {
          eventsList += `${index + 1}. <b>${event.name}</b>\n📅 ${event.date}\n📍 ${event.location || 'Не указано'}\n\n`;
        });

        bot.sendMessage(chatId, eventsList, { parse_mode: 'HTML' });
      })
      .catch((err) => console.error('[BOT] Error in /events:', err));
  } else {
    console.log(`[BOT] Unknown command from @${username}`);
    bot.sendMessage(
      chatId,
      'Я не понимаю эту команду. Напиши /help для списка доступных команд.'
    );
  }
});

bot.on('polling_error', (error) => {
  console.error('[BOT] Polling error:', error);
});

console.log('[BOT] Bot is ready to send reminders');
