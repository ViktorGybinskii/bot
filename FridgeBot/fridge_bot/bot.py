import asyncio
import logging
import json
from datetime import datetime, timedelta
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    WebAppInfo, ReplyKeyboardMarkup, KeyboardButton, 
    InlineKeyboardMarkup, InlineKeyboardButton, LabeledPrice,
    PreCheckoutQuery
)
from aiogram.utils.keyboard import ReplyKeyboardBuilder
import aiosqlite

BOT_TOKEN = "8442285913:AAHeocPCiYdusLDCpJHX4FM2tGDkPrBep4M"
WEB_APP_URL = "https://bot-nine-ashy.vercel.app"
ADMIN_ID = 903712248

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# ============ БАЗА ДАННЫХ ============
async def init_db():
    async with aiosqlite.connect('subscriptions.db') as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT,
                first_name TEXT,
                subscription_expires TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        await db.commit()
    print("✅ База данных инициализирована")

async def get_user_subscription(user_id: int):
    async with aiosqlite.connect('subscriptions.db') as db:
        async with db.execute(
            'SELECT subscription_expires FROM users WHERE user_id = ?',
            (user_id,)
        ) as cursor:
            row = await cursor.fetchone()
            if row and row[0]:
                expires = datetime.fromisoformat(row[0])
                if expires > datetime.now():
                    return expires
    return None

async def update_user_subscription(user_id: int, username: str, first_name: str, days: int = 30):
    expires = datetime.now() + timedelta(days=days)
    async with aiosqlite.connect('subscriptions.db') as db:
        await db.execute('''
            INSERT INTO users (user_id, username, first_name, subscription_expires)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                username = excluded.username,
                first_name = excluded.first_name,
                subscription_expires = excluded.subscription_expires
        ''', (user_id, username, first_name, expires.isoformat()))
        await db.commit()
    print(f"✅ Premium активирован для user_id {user_id} до {expires}")
    return expires

# ============ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ URL СО СТАТУСОМ ============
async def get_webapp_url(user_id: int, page: str) -> str:
    """Возвращает URL с правильным параметром premium"""
    subscription = await get_user_subscription(user_id)
    
    # Определяем базовый URL и параметры
    if '?' in page:
        base_url, existing_params = page.split('?', 1)
        separator = '&'
    else:
        base_url = page
        existing_params = ''
        separator = '?'
    
    # Добавляем параметр premium
    premium_param = "1" if subscription else "0"
    
    # Собираем финальный URL
    if existing_params:
        full_url = f"{WEB_APP_URL}/{base_url}?{existing_params}{separator}premium={premium_param}"
    else:
        full_url = f"{WEB_APP_URL}/{base_url}{separator}premium={premium_param}"
    
    print(f"🔗 Сгенерирован URL для user {user_id}: {full_url} (premium={premium_param})")
    return full_url

# ============ ФУНКЦИЯ ДЛЯ ОТПРАВКИ КНОПКИ ============
async def send_webapp_button(message: types.Message, text: str, page: str):
    """Отправляет кнопку с WebApp, учитывая статус подписки"""
    user_id = message.from_user.id
    url = await get_webapp_url(user_id, page)
    
    await message.answer(
        f"🍳 Открываю...",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text=text, web_app=WebAppInfo(url=url))]],
            resize_keyboard=True
        )
    )

# ============ КЛАВИАТУРЫ ============
def get_main_menu():
    builder = ReplyKeyboardBuilder()
    # Кнопки будут обновляться динамически через отдельные обработчики
    builder.button(text="🍳 Выбрать продукты")
    builder.button(text="🌟 Подписка")
    builder.button(text="📚 Все рецепты")
    builder.adjust(2, 1)
    return builder.as_markup(resize_keyboard=True)

# ============ КОМАНДА СТАРТ ============
@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    user_id = message.from_user.id
    subscription = await get_user_subscription(user_id)
    
    status_text = f"📅 Действует до: {subscription.strftime('%d.%m.%Y')}" if subscription else "🌟 Premium: Все 1825 рецептов за 150 ⭐/мес"
    
    await message.answer(
        f"👋 <b>Добро пожаловать в Fridge Chef!</b>\n\n"
        f"🍳 <i>Ваш персональный кулинарный помощник</i>\n\n"
        f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
        f"📦 <b>В базе данных:</b>\n"
        f"🥕 <b>350+ продуктов</b> · 11 категорий\n"
        f"📖 <b>1825+ рецептов</b> · 6 категорий\n\n"
        f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
        f"{'🌟 <b>Premium активен</b>' if subscription else '🎁 <b>Бесплатно:</b> 300 рецептов'}\n"
        f"{status_text}\n\n"
        f"👇 <b>Выбери действие в меню ниже</b>",
        reply_markup=get_main_menu(),
        parse_mode="HTML"
    )

# ============ КОМАНДА ТЕСТ ============
@dp.message(Command("test"))
async def cmd_test(message: types.Message):
    user_id = message.from_user.id
    subscription = await get_user_subscription(user_id)
    
    await message.answer(
        f"📊 <b>Информация:</b>\n\n"
        f"🆔 Ваш ID: <code>{user_id}</code>\n"
        f"👤 Username: @{message.from_user.username or 'нет'}\n"
        f"🌟 Premium: {'✅ <b>АКТИВЕН</b>' if subscription else '❌ <b>НЕТ</b>'}\n"
        f"📅 Действует до: {subscription.strftime('%d.%m.%Y') if subscription else '—'}\n\n"
        f"ADMIN_ID в коде: <code>{ADMIN_ID}</code>",
        parse_mode="HTML"
    )

# ============ КОМАНДА ДЛЯ АДМИНА ============
@dp.message(Command("givemepls"))
async def cmd_give_premium(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or ""
    first_name = message.from_user.first_name
    
    if user_id != ADMIN_ID:
        await message.answer("❌ У вас нет прав")
        return
    
    expires = await update_user_subscription(user_id, username, first_name, 365)
    
    url = await get_webapp_url(user_id, "index.html")
    
    await message.answer(
        f"✅ <b>Premium активирован!</b>\n\n"
        f"📅 Действует до: {expires.strftime('%d.%m.%Y')}\n"
        f"👑 Теперь вам доступны все 1825 рецептов!\n\n"
        f"👇 <b>Нажмите кнопку ниже</b>",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="🍳 Открыть Fridge Chef", web_app=WebAppInfo(url=url))]],
            resize_keyboard=True
        ),
        parse_mode="HTML"
    )

# ============ ОБРАБОТЧИКИ ТЕКСТОВЫХ КНОПОК ============
# ============ ОБРАБОТЧИКИ ТЕКСТОВЫХ КНОПОК ============
@dp.message(lambda message: message.text == "🍳 Выбрать продукты")
async def open_products(message: types.Message):
    await send_webapp_button(message, "🍳 Выбрать продукты", "index.html")

@dp.message(lambda message: message.text == "📚 Все рецепты")
async def open_all_recipes(message: types.Message):
    await send_webapp_button(message, "📚 Все рецепты", "recipes.html?all=true")


@dp.message(lambda message: message.text == "🌟 Подписка")
async def cmd_subscribe(message: types.Message):
    user_id = message.from_user.id
    subscription = await get_user_subscription(user_id)
    
    if subscription:
        days_left = (subscription - datetime.now()).days
        text = (
            f"🌟 <b>У вас уже есть Premium!</b>\n\n"
            f"📅 Действует до: {subscription.strftime('%d.%m.%Y')}\n"
            f"⏳ Осталось дней: {days_left}\n\n"
            f"Подписка продлевается автоматически.\n"
            f"Управление подпиской в настройках Telegram."
        )
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📋 Мои подписки", url="https://t.me/stars?start=subscriptions")],
            [InlineKeyboardButton(text="⭐ Пополнить баланс", url="https://t.me/stars?start=topup")]
        ])
    else:
        text = (
            "🌟 <b>Fridge Chef Premium</b>\n\n"
            "🎁 <b>БЕСПЛАТНО</b>\n"
            "✓ 300 рецептов\n"
            "✓ Поиск по продуктам\n"
            "✓ Фильтры по категориям\n\n"
            "⭐ <b>PREMIUM (150 ⭐/мес)</b>\n"
            "✓ Все 1825 рецептов\n"
            "✓ Эксклюзивные авторские блюда\n"
            "✓ Новые рецепты каждую неделю\n"
            "✓ Приоритетная поддержка\n\n"
            "💫 <b>Автоматическое продление</b> • Отмена в любой момент\n"
            "👇 Нажмите кнопку ниже для оплаты"
        )
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💫 Купить Premium за 150 ⭐", callback_data="buy_premium")]
        ])
    
    await message.answer(text, reply_markup=keyboard, parse_mode="HTML")

# ============ ОБРАБОТЧИК ПОКУПКИ ============
@dp.callback_query(lambda c: c.data == "buy_premium")
async def process_buy_premium(callback: types.CallbackQuery):
    user_id = callback.from_user.id
    
    prices = [LabeledPrice(label="Premium подписка (30 дней)", amount=150)]
    payload = json.dumps({"user_id": user_id, "type": "subscription", "months": 1})
    
    await bot.send_invoice(
        chat_id=user_id,
        title="🌟 Fridge Chef Premium",
        description="Доступ ко всем 1825 рецептам на 30 дней",
        payload=payload,
        provider_token="",
        currency="XTR",
        prices=prices,
        start_parameter="premium_subscription"
    )
    
    await callback.answer()

# ============ ОБРАБОТКА ПЛАТЕЖЕЙ ============
@dp.pre_checkout_query()
async def pre_checkout_handler(pre_checkout_q: PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)

@dp.message(lambda message: message.successful_payment is not None)
async def payment_success_handler(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or ""
    first_name = message.from_user.first_name
    
    expires = await update_user_subscription(user_id, username, first_name)
    
    url = await get_webapp_url(user_id, "index.html?premium=1")
    
    await message.answer(
        f"✅ <b>Оплата прошла успешно!</b>\n\n"
        f"🌟 Premium активирован до: {expires.strftime('%d.%m.%Y')}\n"
        f"💫 Списано: 150 ⭐\n\n"
        f"👇 <b>Нажмите кнопку ниже чтобы открыть Mini App</b>",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="🍳 Открыть Fridge Chef", web_app=WebAppInfo(url=url))]],
            resize_keyboard=True
        ),
        parse_mode="HTML"
    )

# ============ ЗАПУСК ============
async def main():
    await init_db()
    print("🚀 Бот запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())