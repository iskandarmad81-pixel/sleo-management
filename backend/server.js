// Backend Express server with MongoDB
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const cron = require('node-cron');
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sleo')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  telegram: { type: String, unique: true, required: true },
  password: { type: String, required: true },
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

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);
const Event = mongoose.model('Event', eventSchema);

// JWT Secret
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { telegram, password } = req.body;

    if (!telegram || !password) {
      return res.status(400).json({ error: 'Telegram и пароль обязательны' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ telegram, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, telegram: user.telegram },
      JWT_SECRET
    );
    res.json({ token, user: { id: user._id, telegram: user.telegram } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { telegram, password } = req.body;

    if (!telegram || !password) {
      return res.status(400).json({ error: 'Telegram и пароль обязательны' });
    }

    const user = await User.findOne({ telegram });
    if (!user)
      return res.status(401).json({ error: 'Неверные учетные данные' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: 'Неверные учетные данные' });

    const token = jwt.sign(
      { id: user._id, telegram: user.telegram },
      JWT_SECRET
    );
    res.json({ token, user: { id: user._id, telegram: user.telegram } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer Routes
app.get('/api/volunteers', authMiddleware, async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('events');
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteers', authMiddleware, async (req, res) => {
  try {
    // Проверка на дубликаты перед сохранением
    const existingTelegram = await Volunteer.findOne({
      telegram: req.body.telegram,
    });
    if (
      existingTelegram &&
      (!req.body._id || existingTelegram._id.toString() !== req.body._id)
    ) {
      return res
        .status(400)
        .json({ error: 'Волонтер с таким Telegram уже существует' });
    }

    const existingPhone = await Volunteer.findOne({ phone: req.body.phone });
    if (
      existingPhone &&
      req.body.phone &&
      (!req.body._id || existingPhone._id.toString() !== req.body._id)
    ) {
      return res
        .status(400)
        .json({ error: 'Волонтер с таким номером телефона уже существует' });
    }

    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.json(volunteer);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      if (field === 'telegram') {
        return res
          .status(400)
          .json({ error: 'Волонтер с таким Telegram уже существует' });
      } else if (field === 'phone') {
        return res
          .status(400)
          .json({ error: 'Волонтер с таким номером телефона уже существует' });
      }
    }
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/volunteers/:id', authMiddleware, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate(
      'events'
    );
    if (!volunteer)
      return res.status(404).json({ error: 'Волонтер не найден' });
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/volunteers/:id', authMiddleware, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/volunteers/:id', authMiddleware, async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Волонтер удален' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Event Routes
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().populate('volunteers');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('volunteers');
    if (!event) return res.status(404).json({ error: 'Событие не найдено' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Событие удалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add volunteer to event
app.post(
  '/api/events/:eventId/volunteers/:volunteerId',
  authMiddleware,
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event.volunteers.includes(req.params.volunteerId)) {
        event.volunteers.push(req.params.volunteerId);
      }
      await event.save();

      const volunteer = await Volunteer.findById(req.params.volunteerId);
      if (!volunteer.events.includes(req.params.eventId)) {
        volunteer.events.push(req.params.eventId);
      }
      await volunteer.save();

      res.json({ message: 'Волонтер добавлен к событию' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Remove volunteer from event
app.delete(
  '/api/events/:eventId/volunteers/:volunteerId',
  authMiddleware,
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      event.volunteers = event.volunteers.filter(
        (id) => id.toString() !== req.params.volunteerId
      );
      await event.save();

      const volunteer = await Volunteer.findById(req.params.volunteerId);
      volunteer.events = volunteer.events.filter(
        (id) => id.toString() !== req.params.eventId
      );
      await volunteer.save();

      res.json({ message: 'Волонтер удален из события' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

app.post('/api/bot/send-events-list', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find();
    if (events.length === 0) {
      return res.json({ message: 'Нет событий для отправки', sentTo: 0 });
    }

    // Формируем список событий
    let eventsList = '<b>📋 Список всех событий:</b>\n\n';
    events.forEach((event, index) => {
      eventsList += `${index + 1}. <b>${event.name}</b>\n📅 ${event.date}\n📍 ${
        event.location || 'Не указано'
      }\n\n`;
    });

    // Получаем группы из env
    const groupIds = (process.env.GROUP_IDS || '').split(',');
    console.log(process.env.GROUP_IDS);

    let sentCount = 0;

    for (const chatId of groupIds) {
      try {
        await bot.sendMessage(chatId, eventsList, { parse_mode: 'HTML' });
        sentCount++;
        console.log(`[BOT] Sent events list to group ${chatId}`);
      } catch (err) {
        console.error(`[BOT] Failed to send to group ${chatId}:`, err.message);
      }
    }

    res.json({
      message: 'Список событий отправлен группам',
      sentTo: sentCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

async function sendTomorrowReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowDate = `${yyyy}-${mm}-${dd}`;

    const events = await Event.find({ date: tomorrowDate });

    if (events.length === 0) {
      console.log('[BOT] Нет событий на завтра');
      return;
    }

    // Формируем сообщение
    let message = '<b>📢 Напоминание о событиях на завтра:</b>\n\n';
    events.forEach((event, index) => {
      message +=
        `${index + 1}. <b>${event.name}</b>\n` +
        `📅 ${event.date}\n` +
        `📍 ${event.location || 'Не указано'}\n` +
        `📝 ${event.description || 'Нет описания'}\n\n`;
    });

    const groupIds = (process.env.GROUP_IDS || '').split(',');

    for (const chatId of groupIds) {
      try {
        await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        console.log(`[BOT] Reminder sent to group ${chatId}`);
      } catch (err) {
        console.error(
          `[BOT] Failed to send reminder to group ${chatId}:`,
          err.message
        );
      }
    }
  } catch (err) {
    console.error('[BOT] Error sending tomorrow reminders:', err);
  }
}

// Каждый день в 9:00 утра
cron.schedule('0 8 * * *', () => {
  console.log('[BOT] Daily reminder triggered');
  sendTomorrowReminders();
});

sendTomorrowReminders();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
