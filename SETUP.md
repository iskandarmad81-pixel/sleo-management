# SLEO - Volunteer Management Platform
## Полная инструкция по запуску

### Требования
- Node.js 16+ и npm
- MongoDB (локально или MongoDB Atlas)
- Git

---

## Структура проекта

\`\`\`
sleo/
├── frontend/              # Next.js приложение (React)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── .env.local
│
└── backend/               # Express.js API сервер
    ├── server.js
    ├── package.json
    └── .env
\`\`\`

---

## Шаг 1: Подготовка MongoDB

### Вариант A: Локальное хранилище MongoDB

1. Установите MongoDB: https://www.mongodb.com/try/download/community
2. Запустите MongoDB сервер:
   - **Windows**: `mongod` (в PowerShell или CMD)
   - **Mac**: `mongod` (если установлено через Homebrew)
   - **Linux**: `sudo systemctl start mongod`

Сервер должен запуститься на `mongodb://localhost:27017`

### Вариант B: MongoDB Atlas (облако)

1. Создайте аккаунт на https://www.mongodb.com/cloud/atlas
2. Создайте новый проект и кластер (бесплатный tier)
3. Получите строку подключения вида:
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/sleo?retryWrites=true&w=majority
   \`\`\`
4. Сохраните эту строку, она понадобится в `.env` файле

---

## Шаг 2: Установка Backend

### 2.1 Создайте папку backend и перейдите в неё
\`\`\`bash
mkdir backend
cd backend
\`\`\`

### 2.2 Создайте файл `server.js`
Скопируйте содержимое файла `backend/server.js` из проекта

### 2.3 Создайте файл `package.json`
Скопируйте содержимое файла `backend/package.json` из проекта

### 2.4 Создайте файл `.env`
\`\`\`env
# MongoDB подключение
MONGODB_URI=mongodb://localhost:27017/sleo

# Или если используете MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sleo?retryWrites=true&w=majority

# JWT секрет ключ (измените на что-то сложное в production)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Порт сервера
PORT=5000
\`\`\`

### 2.5 Установите зависимости
\`\`\`bash
npm install
\`\`\`

### 2.6 Запустите backend
\`\`\`bash
npm run dev
\`\`\`

Вы должны увидеть:
\`\`\`
MongoDB connected
Server running on port 5000
\`\`\`

**Backend работает на:** `http://localhost:5000`

---

## Шаг 3: Установка Frontend

### 3.1 Откройте новый терминал и перейдите в папку frontend

Если вы скачали проект v0, это уже готовый Next.js проект

### 3.2 Установите зависимости
\`\`\`bash
npm install
\`\`\`

### 3.3 Создайте файл `.env.local`

В корне frontend папки создайте файл `.env.local`:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

**Важно:** Переменная должна начинаться с `NEXT_PUBLIC_` чтобы быть доступной в браузере!

### 3.4 Запустите frontend
\`\`\`bash
npm run dev
\`\`\`

Вы должны увидеть:
\`\`\`
- Local:        http://localhost:3000
\`\`\`

**Frontend работает на:** `http://localhost:3000`

---

## Шаг 4: Запуск приложения

Теперь откройте браузер и перейдите на: **http://localhost:3000**

### Первый вход:

1. Введите Telegram юзернейм (например: `@myusername`)
2. Введите пароль
3. Нажмите кнопку "Зарегистрироваться" (первый вход)
4. После успешной регистрации вы будете перенаправлены на dashboard

---

## Структура файлов Frontend

\`\`\`
app/
├── page.jsx              # Страница логина
├── layout.jsx            # Root layout
├── globals.css           # Глобальные стили
└── dashboard/
    ├── page.jsx          # Список волонтеров
    ├── events/
    │   └── page.jsx      # Список событий
    ├── volunteers/
    │   └── [id]/
    │       └── page.jsx  # Профиль волонтера
    └── events/
        └── [id]/
            └── page.jsx  # Детали события

components/
├── navigation.jsx        # Навигация (адаптивная, с бургер-меню)
├── volunteer-form.jsx    # Форма волонтера
├── volunteer-list.jsx    # Список волонтеров
├── event-form.jsx        # Форма события
├── event-list.jsx        # Список событий
└── ui/                   # UI компоненты (shadcn/ui)
\`\`\`

---

## API Endpoints

### Аутентификация
- **POST** `/api/auth/register` - Регистрация
- **POST** `/api/auth/login` - Логин

### Волонтеры
- **GET** `/api/volunteers` - Получить всех волонтеров
- **POST** `/api/volunteers` - Создать волонтера
- **GET** `/api/volunteers/:id` - Получить волонтера по ID
- **PUT** `/api/volunteers/:id` - Обновить волонтера
- **DELETE** `/api/volunteers/:id` - Удалить волонтера

### События
- **GET** `/api/events` - Получить все события
- **POST** `/api/events` - Создать событие
- **GET** `/api/events/:id` - Получить событие по ID
- **PUT** `/api/events/:id` - Обновить событие
- **DELETE** `/api/events/:id` - Удалить событие

### Связь Волонтеров и Событий
- **POST** `/api/events/:eventId/volunteers/:volunteerId` - Добавить волонтера к событию
- **DELETE** `/api/events/:eventId/volunteers/:volunteerId` - Удалить волонтера из события

---

## Решение проблем

### "Cannot find module 'express'"
Решение: Убедитесь что вы в папке `backend` и выполнили `npm install`

### "MongoDB connection error"
1. Проверьте что MongoDB запущена
2. Проверьте `MONGODB_URI` в `.env` файле
3. Если используете MongoDB Atlas, проверьте IP адрес в сетевых правилах (разрешите 0.0.0.0)

### "Failed to fetch from API"
1. Убедитесь что backend запущен на `http://localhost:5000`
2. Проверьте `NEXT_PUBLIC_API_URL` в `.env.local`
3. Проверьте что переменная начинается с `NEXT_PUBLIC_`
4. Перезагрузите страницу в браузере

### "Cannot find 'sleo_token' in localStorage"
Решение: Авторизируйтесь снова - пройдите процесс регистрации/логина

---

## Deployment (Развертывание)

### Вариант A: Vercel (Frontend) + Render (Backend)

**Frontend:**
1. Залейте проект на GitHub
2. Подключите к Vercel (vercel.com)
3. Добавьте переменную окружения: `NEXT_PUBLIC_API_URL=https://your-backend-url`

**Backend:**
1. Залейте backend на GitHub
2. Подключите к Render (render.com)
3. Добавьте переменные окружения в Render:
   - `MONGODB_URI` - ваша MongoDB строка
   - `JWT_SECRET` - сильный секретный ключ
   - `PORT=5000`

### Вариант B: Самостоятельный хостинг

Используйте DigitalOcean, Linode или другой VPS хостинг

---

## Команды для разработки

### Frontend
\`\`\`bash
npm run dev      # Запустить в режиме разработки
npm run build    # Собрать для production
npm run start    # Запустить production версию
npm run lint     # Проверить код
\`\`\`

### Backend
\`\`\`bash
npm run dev      # Запустить backend (просто node server.js)
\`\`\`

---

## Стек технологий

**Frontend:**
- Next.js 16 (React 19)
- Tailwind CSS
- shadcn/ui компоненты

**Backend:**
- Express.js
- MongoDB + Mongoose ODM
- JWT для аутентификации
- bcryptjs для хеширования паролей

**JavaScript версия:** ES6+ (CommonJS для backend, ESM для frontend)

---

## Поддержка

Если у вас есть проблемы:
1. Проверьте все переменные окружения
2. Убедитесь что все сервисы запущены
3. Проверьте логи в консоли (terminal)
4. Проверьте Network tab в DevTools браузера

---

**Готово!** Теперь у вас есть полностью функциональное приложение SLEO на JavaScript!
