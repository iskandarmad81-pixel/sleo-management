# SLEO - Быстрый старт за 5 минут

## Что вам нужно

1. **Node.js 16+** - https://nodejs.org/
2. **MongoDB** - локально или на MongoDB Atlas
3. **Git** (опционально)

---

## Быстрый старт

### 1. MongoDB (выбери один вариант)

**Локально:**
\`\`\`bash
mongod
\`\`\`

**Или MongoDB Atlas:** Создай аккаунт и получи строку подключения

---

### 2. Запуск Backend

\`\`\`bash
cd backend
npm install
# Создай .env с MONGODB_URI и JWT_SECRET
npm run dev
# Server running on port 5000
\`\`\`

---

### 3. Запуск Frontend

\`\`\`bash
# В новом терминале
npm install
# Создай .env.local с NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
# Откройся http://localhost:3000
\`\`\`

---

### 4. Первый вход

Зарегистрируйся с любым Telegram юзернеймом

---

## Переменные окружения

### Backend (.env)
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/sleo
JWT_SECRET=your-secret-key
PORT=5000
\`\`\`

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

---

## Готово!

Frontend: http://localhost:3000
Backend: http://localhost:5000

Для деталей смотри SETUP.md
