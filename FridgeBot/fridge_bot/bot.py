import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command, Text
from aiogram.types import WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder

BOT_TOKEN = "8442285913:AAHeocPCiYdusLDCpJHX4FM2tGDkPrBep4M"
WEB_APP_URL = "https://fridgechefbot.netlify.app"  # Твой URL на Netlify

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Главное меню
def get_main_menu():
    builder = ReplyKeyboardBuilder()
    builder.button(text="🍳 Выбрать продукты", web_app=WebAppInfo(url=f"{WEB_APP_URL}/index.html"))
    builder.button(text="🔥 Популярные рецепты")
    builder.button(text="🔍 Поиск по названию")
    builder.adjust(2)
    return builder.as_markup(resize_keyboard=True)

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "👋 Добро пожаловать в <b>Fridge Chef</b>!\n\n"
        "Я помогу вам приготовить вкусные блюда из тех продуктов,\n"
        "которые уже есть в вашем холодильнике.\n\n"
        "🥘 <b>Как это работает:</b>\n"
        "1. Нажмите 'Выбрать продукты'\n"
        "2. Отметьте, что у вас есть\n"
        "3. Получите список подходящих рецептов\n\n"
        "Выберите действие:",
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
    
    # Отправляем ссылку на страницу с рецептами
    webapp_url = f"{WEB_APP_URL}/recipes.html?ingredients={','.join(ingredients)}"
    
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🍳 Посмотреть рецепты", web_app=WebAppInfo(url=webapp_url))],
            [KeyboardButton(text="◀️ В главное меню")]
        ],
        resize_keyboard=True
    )
    
    await message.answer(
        f"✅ Вы выбрали: {', '.join(ingredients)}\n\n"
        f"🔍 Нажимайте кнопку ниже, чтобы посмотреть подходящие рецепты!",
        reply_markup=keyboard
    )

# Кнопка: Популярные рецепты
@dp.message(Text("🔥 Популярные рецепты"))
async def popular_recipes(message: types.Message):
    webapp_url = f"{WEB_APP_URL}/recipes.html?popular=true"
    
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🍳 Смотреть популярные", web_app=WebAppInfo(url=webapp_url))],
            [KeyboardButton(text="◀️ В главное меню")]
        ],
        resize_keyboard=True
    )
    
    await message.answer(
        "🔥 Самые популярные рецепты этой недели!\n"
        "Нажмите кнопку ниже, чтобы посмотреть:",
        reply_markup=keyboard
    )

# Кнопка: Поиск по названию
@dp.message(Text("🔍 Поиск по названию"))
async def search_prompt(message: types.Message):
    await message.answer(
        "🔍 Введите название блюда, которое хотите найти\n"
        "Например: омлет, суп, борщ, паста..."
    )

# Обработка текстового поиска
@dp.message(lambda message: message.text and not message.web_app_data)
async def search_by_name(message: types.Message):
    query = message.text.strip()
    if len(query) < 2:
        await message.answer("Введите хотя бы 2 символа.")
        return
    
    webapp_url = f"{WEB_APP_URL}/recipes.html?search={query}"
    
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🔍 Найти рецепты", web_app=WebAppInfo(url=webapp_url))],
            [KeyboardButton(text="◀️ В главное меню")]
        ],
        resize_keyboard=True
    )
    
    await message.answer(
        f"Ищем рецепты по запросу: {query}",
        reply_markup=keyboard
    )

# Обработка кнопки "В главное меню"
@dp.message(Text("◀️ В главное меню"))
async def back_to_main(message: types.Message):
    await message.answer(
        "Главное меню:",
        reply_markup=get_main_menu()
    )

# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())