const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

/* ========================= MONGO CONNECT ========================= */

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sleo')
  .then(() => console.log('[BOT] MongoDB connected'))
  .catch((err) => console.error('[BOT] MongoDB connection error:', err));

/* ========================= MODELS ========================= */

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

/* ========================= BOT INIT ========================= */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('[BOT] TELEGRAM_BOT_TOKEN missing');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
console.log('[BOT] Telegram bot started');

/* ========================= GROUP LIST FROM .ENV ========================= */

const GROUP_LIST = process.env.GROUP_IDS
  ? process.env.GROUP_IDS.split(',').map((id) => id.trim())
  : [];

console.log('[BOT] Loaded groups from .env:', GROUP_LIST);

/* =============================================================
   SEND EVENTS LIST TO ALL GROUPS FROM .ENV
============================================================= */

async function sendEventsListToGroups() {
  try {
    if (GROUP_LIST.length === 0) {
      console.log('[BOT] No groups in GROUP_IDS');
      return;
    }

    const events = await Event.find();

    const message =
      `📋 <b>Список событий SLEO</b>\n\n` +
      events
        .map(
          (e, i) =>
            `${i + 1}. <b>${e.name}</b>\n📅 ${e.date}\n📍 ${e.location || "Не указано"}\n`
        )
        .join("\n");

    for (const chatId of GROUP_LIST) {
      try {
        await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
        console.log(`[BOT] Sent events list to group ${chatId}`);
      } catch (err) {
        console.error(`[BOT] Failed to send to group ${chatId}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[BOT] Error sending list:', err);
  }
}

/* =============================================================
   DAILY REMINDERS
============================================================= */

async function checkAndSendReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const events = await Event.find({ date: tomorrowDate }).populate('volunteers');

    for (const event of events) {
      for (const volunteer of event.volunteers) {
        const message = `📢 НАПОМИНАНИЕ!\n\nЗавтра: <b>${event.name}</b>\n\n📝 Описание: ${
          event.description || 'Нет описания'
        }\n\n📍 Место: ${
          event.location || 'Не указано'
        }\n\n✅ Ты зарегистрирован на это событие!`;

        try {
          await bot.sendMessage(volunteer.telegram, message, { parse_mode: 'HTML' });
        } catch (err) {
          console.error(
            `[BOT] Reminder failed for @${volunteer.telegram}:`,
            err.message
          );
        }
      }
    }
  } catch (err) {
    console.error('[BOT] Reminder error:', err);
  }
}

/* send reminder every day at 09:00 */
cron.schedule('0 9 * * *', () => {
  console.log('[BOT] Daily reminder triggered');
  checkAndSendReminders();
});

/* Run at start */
checkAndSendReminders();

/* =============================================================
   BOT COMMANDS
============================================================= */

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    bot.sendMessage(
      chatId,
      `Привет ${msg.from.first_name}! 👋\n\nТы подключён к системе SLEO.`,
      { parse_mode: 'HTML' }
    );
  }

  if (text === '/events') {
    sendEventsListToGroups();
    bot.sendMessage(chatId, 'Список событий отправлен всем группам.');
  }
});

bot.on('polling_error', (error) => {
  console.error('[BOT] Polling error:', error);
});

router.post("/send-events-list", async (req, res) => {
  try {
    const events = await Event.find()

    if (!events.length) {
      return res.status(400).json({ error: "Нет событий для отправки" })
    }

    const text =
      "📅 *Список ближайших событий:*\n\n" +
      events
        .map((e, idx) => `*${idx + 1}.* ${e.name}\n📍 ${e.location}\n📆 ${e.date}`)
        .join("\n\n")

    for (const chatId of GROUP_IDS) {
      try {
        await bot.sendMessage(chatId, text, { parse_mode: "Markdown" })
      } catch (err) {
        console.error(`Ошибка отправки в чат ${chatId}:`, err.message)
      }
    }

    res.json({ status: "ok" })
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" })
  }
})