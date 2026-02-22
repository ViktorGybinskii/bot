import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder

BOT_TOKEN = "8442285913:AAHeocPCiYdusLDCpJHX4FM2tGDkPrBep4M"
WEB_APP_URL = "https://fridgebot.netlify.app"

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Главное меню 
def get_main_menu():
    builder = ReplyKeyboardBuilder()
    builder.button(text="🍳 Выбрать продукты", web_app=WebAppInfo(url=f"{WEB_APP_URL}/index.html"))
    builder.button(text="📚 Все рецепты", web_app=WebAppInfo(url=f"{WEB_APP_URL}/recipes.html?all=true"))
    builder.adjust(2)
    return builder.as_markup(resize_keyboard=True)

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "👋 <b>Добро пожаловать в Fridge Chef!</b>\n\n"
        "🍳 <i>Ваш персональный кулинарный помощник</i>\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "📦 <b>В базе данных:</b>\n"
        "🥕 <b>350+ продуктов</b> · 11 категорий\n"
        "📖 <b>100+ рецептов</b> · 6 категорий\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "✨ <b>Возможности:</b>\n"
        "🔍 • Умный поиск по продуктам\n"
        "🏷️ • Фильтры по категориям\n"
        "🌓 • Адаптация под тему Telegram\n"
        "📱 • Удобный интерфейс\n"
        "⚡ • Быстрая загрузка\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "🥘 <b>Как приготовить:</b>\n"
        "1️⃣ Нажми <b>\"Выбрать продукты\"</b>\n"
        "2️⃣ Отметь что есть в холодильнике\n"
        "3️⃣ Получи идеальный рецепт\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "👇 <b>Выбери действие в меню ниже</b>",
        reply_markup=get_main_menu(),
        parse_mode="HTML"
    )

# Обработка данных из Web App
@dp.message(lambda message: message.web_app_data)
async def handle_webapp_data(message: types.Message):
    data = message.web_app_data.data
    ingredients = [x.strip() for x in data.split(",") if x.strip()]
    
    if not ingredients:
        await message.answer("❌ Вы не выбрали ни одного продукта.")
        return
    
    webapp_url = f"{WEB_APP_URL}/recipes.html?ingredients={','.join(ingredients)}"
    
    await message.answer(
        f"✅ Вы выбрали: {', '.join(ingredients)}\n\n"
        f"🍽️ <b>Рецепты готовы!</b>",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="🍳 Смотреть рецепты", web_app=WebAppInfo(url=webapp_url))],
                [KeyboardButton(text="📚 Все рецепты", web_app=WebAppInfo(url=f"{WEB_APP_URL}/recipes.html?all=true"))],
                [KeyboardButton(text="◀️ В главное меню")]
            ],
            resize_keyboard=True
        ),
        parse_mode="HTML"
    )

# Кнопка "В главное меню"
@dp.message(lambda message: message.text == "◀️ В главное меню")
async def back_to_main(message: types.Message):
    await message.answer(
        "Главное меню:",
        reply_markup=get_main_menu()
    )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())