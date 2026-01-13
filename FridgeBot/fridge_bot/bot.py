# bot.py

import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo
import aiohttp

BOT_TOKEN = "8442285913:AAHeocPCiYdusLDCpJHX4FM2tGDkPrBep4M"
WEB_APP_URL = "https://fridgechefbot.netlify.app"

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


# Универсальная функция запроса к TheMealDB
async def fetch_json(url: str):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as resp:
                if resp.status == 200:
                    return await resp.json()
        except Exception as e:
            logging.error(f"API error: {e}")
    return None


# Главное меню
def get_main_menu():
    builder = ReplyKeyboardBuilder()
    builder.button(text="🍳 Выбрать продукты", web_app=WebAppInfo(url=f"{WEB_APP_URL}/index.html"))
    builder.button(text="🔥 Популярные рецепты")
    builder.button(text="🔍 Поиск по названию")
    builder.adjust(2)  # 2 кнопки в строке
    return builder.as_markup(resize_keyboard=True)


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "Добро пожаловать в <b>FridgeMonitoring</b>! 🧊\n\n"
        "Выберите действие:",
        reply_markup=get_main_menu(),
        parse_mode="HTML"
    )


# Обработка данных из Web App (выбор продуктов)
@dp.message(lambda message: message.web_app_
            async
def handle_webapp_data(message: types.Message):
    data = message.web_app_data.data
    ingredients = [x.strip().lower() for x in data.split(",") if x.strip()]

    if not ingredients:
        await message.answer("❌ Вы не выбрали ни одного продукта.")
        return

    await message.answer("🔍 Ищу рецепты...")

    # Получаем рецепты по каждому ингредиенту
    all_meal_ids = set()
    async with aiohttp.ClientSession() as session:
        for ing in ingredients:
            url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={ing}"
            try:
                async with session.get(url) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        meals = data.get("meals", [])
                        for m in meals:
                            all_meal_ids.add(m["idMeal"])
            except:
                continue

    # Фильтруем: оставляем только те, где ВСЕ ингредиенты пользователя есть в рецепте
    valid_recipes = []
    user_set = set(ingredients)

    async with aiohttp.ClientSession() as session:
        for meal_id in list(all_meal_ids)[:15]:  # ограничим 15 запросами
            url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}"
            try:
                async with session.get(url) as resp:
                    if resp.status == 200:
                        full = (await resp.json())["meals"][0]
                        recipe_ings = set()
                        for i in range(1, 21):
                            ing = full.get(f"strIngredient{i}")
                            if ing and ing.strip():
                                recipe_ings.add(ing.lower())
                        if user_set.issubset(recipe_ings):
                            valid_recipes.append(full)
                            if len(valid_recipes) >= 3:
                                break
            except:
                continue

    if valid_recipes:
        for r in valid_recipes:
            caption = f"<b>{r['strMeal']}</b>\n\n{r['strInstructions'][:500]}..."
            await message.answer_photo(photo=r["strMealThumb"], caption=caption, parse_mode="HTML")
    else:
        await message.answer(
            "😔 Не нашлось блюд, которые можно приготовить ТОЛЬКО из этих продуктов.\n"
            "Попробуйте добавить ещё ингредиенты!"
        )


# Кнопка: Популярные рецепты
@dp.message(Text("🔥 Популярные рецепты"))
async def popular_recipes(message: types.Message):
    data = await fetch_json("https://www.themealdb.com/api/json/v1/1/random.php")
    if data and data.get("meals"):
        for _ in range(3):  # покажем 3 случайных
            data = await fetch_json("https://www.themelldb.com/api/json/v1/1/random.php")
            if data and data["meals"]:
                r = data["meals"][0]
                caption = f"<b>{r['strMeal']}</b>\n\nСтрана: {r.get('strArea', '—')}\nКатегория: {r.get('strCategory', '—')}"
                await message.answer_photo(photo=r["strMealThumb"], caption=caption, parse_mode="HTML")
    else:
        await message.answer("❌ Не удалось загрузить популярные рецепты.")


# Кнопка: Поиск по названию
@dp.message(Text("🔍 Поиск по названию"))
async def search_prompt(message: types.Message):
    await message.answer("Введите название блюда (например: pasta, omelette, soup):")


# Обработка текстового поиска
@dp.message(lambda message: message.text and not message.web_app_
            async
def search_by_name(message: types.Message):
    query = message.text.strip()
    if len(query) < 2:
        await message.answer("Введите хотя бы 2 символа.")
        return

    data = await fetch_json(f"https://www.themealdb.com/api/json/v1/1/search.php?s={query}")
    if data and data.get("meals"):
        for r in data["meals"][:3]:
            caption = f"<b>{r['strMeal']}</b>\n\n{r['strInstructions'][:400]}..."
            await message.answer_photo(photo=r["strMealThumb"], caption=caption, parse_mode="HTML")
    else:
        await message.answer("❌ Рецепты по вашему запросу не найдены.")


# Запуск
async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())