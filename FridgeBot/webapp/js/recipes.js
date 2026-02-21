// webapp/js/recipes.js

// База рецептов на русском языке
const recipesDatabase = [
    {
        id: 1,
        name: "Омлет с сыром",
        category: "Завтрак",
        cuisine: "Русская",
        time: "15 минут",
        servings: 2,
        image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400",
        ingredients: [
            { name: "яйца", amount: "3 шт" },
            { name: "молоко", amount: "50 мл" },
            { name: "сыр", amount: "50 г" },
            { name: "масло сливочное", amount: "20 г" },
            { name: "соль", amount: "по вкусу" }
        ],
        instructions: [
            "Взбейте яйца с молоком и солью до однородности",
            "Натрите сыр на крупной терке",
            "Разогрейте сковороду с маслом",
            "Вылейте яичную смесь и посыпьте сыром",
            "Жарьте под крышкой 5-7 минут на среднем огне"
        ],
        steps: [
            "Подготовить ингредиенты",
            "Приготовить яичную смесь",
            "Обжарить",
            "Подавать горячим"
        ]
    },
    {
        id: 2,
        name: "Куриный суп с лапшой",
        category: "Суп",
        cuisine: "Русская",
        time: "45 минут",
        servings: 4,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
        ingredients: [
            { name: "курица", amount: "300 г" },
            { name: "морковь", amount: "1 шт" },
            { name: "лук", amount: "1 шт" },
            { name: "картофель", amount: "2 шт" },
            { name: "макароны", amount: "100 г" },
            { name: "соль", amount: "по вкусу" },
            { name: "перец", amount: "по вкусу" }
        ],
        instructions: [
            "Сварите куриный бульон (30 минут)",
            "Добавьте нарезанный картофель",
            "Обжарьте лук с морковью и добавьте в суп",
            "За 10 минут до готовности добавьте макароны",
            "Посолите, поперчите, дайте настояться"
        ],
        steps: [
            "Сварить бульон",
            "Подготовить овощи",
            "Собрать суп",
            "Подавать с зеленью"
        ]
    },
    {
        id: 3,
        name: "Макароны по-флотски",
        category: "Основное блюдо",
        cuisine: "Русская",
        time: "30 минут",
        servings: 3,
        image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400",
        ingredients: [
            { name: "макароны", amount: "300 г" },
            { name: "фарш мясной", amount: "300 г" },
            { name: "лук", amount: "1 шт" },
            { name: "масло растительное", amount: "2 ст.л" },
            { name: "соль", amount: "по вкусу" },
            { name: "перец", amount: "по вкусу" }
        ],
        instructions: [
            "Отварите макароны в подсоленной воде",
            "Мелко нарежьте лук и обжарьте до золотистого цвета",
            "Добавьте фарш и жарьте, помешивая, 10 минут",
            "Смешайте макароны с фаршем",
            "Прогрейте все вместе 2-3 минуты"
        ],
        steps: [
            "Отварить макароны",
            "Приготовить фарш с луком",
            "Смешать ингредиенты",
            "Подавать горячим"
        ]
    },
    {
        id: 4,
        name: "Салат Цезарь с курицей",
        category: "Салат",
        cuisine: "Итальянская",
        time: "20 минут",
        servings: 2,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400",
        ingredients: [
            { name: "курица", amount: "200 г" },
            { name: "салат айсберг", amount: "100 г" },
            { name: "сыр пармезан", amount: "50 г" },
            { name: "хлеб", amount: "2 куска" },
            { name: "яйца", amount: "1 шт" },
            { name: "масло оливковое", amount: "3 ст.л" }
        ],
        instructions: [
            "Обжарьте куриное филе до готовности, нарежьте",
            "Хлеб нарежьте кубиками и подсушите на сковороде",
            "Салат порвите руками в миску",
            "Добавьте курицу и сухарики",
            "Посыпьте тертым сыром"
        ],
        steps: [
            "Подготовить ингредиенты",
            "Обжарить курицу",
            "Сделать сухарики",
            "Смешать все ингредиенты"
        ]
    },
    {
        id: 5,
        name: "Блины на молоке",
        category: "Выпечка",
        cuisine: "Русская",
        time: "40 минут",
        servings: 6,
        image: "https://images.unsplash.com/photo-1575853121743-60c24f0a7502?w=400",
        ingredients: [
            { name: "молоко", amount: "500 мл" },
            { name: "яйца", amount: "2 шт" },
            { name: "мука", amount: "200 г" },
            { name: "сахар", amount: "1 ст.л" },
            { name: "соль", amount: "щепотка" },
            { name: "масло растительное", amount: "2 ст.л" }
        ],
        instructions: [
            "Смешайте яйца с сахаром и солью",
            "Добавьте половину молока и муку, перемешайте",
            "Влейте оставшееся молоко и масло",
            "Жарьте на разогретой сковороде с двух сторон",
            "Подавайте со сметаной или вареньем"
        ],
        steps: [
            "Замесить тесто",
            "Дать тесту отдохнуть",
            "Испечь блины",
            "Подавать с начинкой"
        ]
    },
    {
        id: 6,
        name: "Картошка по-деревенски",
        category: "Гарнир",
        cuisine: "Русская",
        time: "35 минут",
        servings: 3,
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400",
        ingredients: [
            { name: "картофель", amount: "500 г" },
            { name: "масло растительное", amount: "3 ст.л" },
            { name: "чеснок", amount: "2 зубчика" },
            { name: "соль", amount: "по вкусу" },
            { name: "паприка", amount: "1 ч.л" }
        ],
        instructions: [
            "Картофель нарежьте дольками",
            "Смешайте с маслом, солью и специями",
            "Выложите на противень",
            "Запекайте 30 минут при 200°C",
            "Подавайте с зеленью"
        ],
        steps: [
            "Подготовить картофель",
            "Добавить специи",
            "Запечь в духовке",
            "Подавать горячим"
        ]
    },
    {
        id: 7,
        name: "Яичница с помидорами",
        category: "Завтрак",
        cuisine: "Международная",
        time: "10 минут",
        servings: 1,
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
        ingredients: [
            { name: "яйца", amount: "2 шт" },
            { name: "помидоры", amount: "1 шт" },
            { name: "масло растительное", amount: "1 ст.л" },
            { name: "соль", amount: "по вкусу" },
            { name: "перец", amount: "по вкусу" }
        ],
        instructions: [
            "Помидоры нарежьте кружочками",
            "Обжарьте на сковороде с двух сторон",
            "Разбейте яйца сверху",
            "Посолите, поперчите",
            "Жарьте до готовности яиц"
        ],
        steps: [
            "Подготовить помидоры",
            "Обжарить помидоры",
            "Добавить яйца",
            "Подавать с хлебом"
        ]
    },
    {
        id: 8,
        name: "Гречка с грибами",
        category: "Основное блюдо",
        cuisine: "Русская",
        time: "30 минут",
        servings: 3,
        image: "https://images.unsplash.com/photo-1593253787226-567eda4ad32a?w=400",
        ingredients: [
            { name: "гречка", amount: "200 г" },
            { name: "грибы", amount: "200 г" },
            { name: "лук", amount: "1 шт" },
            { name: "морковь", amount: "1 шт" },
            { name: "масло растительное", amount: "2 ст.л" },
            { name: "соль", amount: "по вкусу" }
        ],
        instructions: [
            "Отварите гречку до готовности",
            "Обжарьте лук с морковью и грибами",
            "Смешайте гречку с овощами",
            "Прогрейте все вместе 5 минут",
            "Подавайте горячим"
        ],
        steps: [
            "Сварить гречку",
            "Обжарить грибы с овощами",
            "Смешать ингредиенты",
            "Подавать"
        ]
    }
];

// Функция поиска рецептов по продуктам
function findRecipesByIngredients(userIngredients) {
    // Приводим продукты пользователя к нижнему регистру
    const userIngredientsLower = userIngredients.map(i => i.toLowerCase().trim());
    
    // Оцениваем каждый рецепт
    const scoredRecipes = recipesDatabase.map(recipe => {
        // Получаем список ингредиентов рецепта
        const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
        
        // Считаем сколько ингредиентов пользователя есть в рецепте
        const matchedIngredients = userIngredientsLower.filter(ui => 
            recipeIngredients.some(ri => ri.includes(ui) || ui.includes(ri))
        );
        
        // Считаем сколько ингредиентов рецепта есть у пользователя
        const recipeMatches = recipeIngredients.filter(ri =>
            userIngredientsLower.some(ui => ri.includes(ui) || ui.includes(ri))
        );
        
        // Вычисляем процент совпадения
        const matchPercentage = (matchedIngredients.length / recipeIngredients.length) * 100;
        
        return {
            ...recipe,
            matchCount: matchedIngredients.length,
            totalIngredients: recipeIngredients.length,
            matchPercentage: Math.round(matchPercentage),
            matchedIngredients: matchedIngredients,
            missingIngredients: recipeIngredients.filter(ri => 
                !userIngredientsLower.some(ui => ri.includes(ui) || ui.includes(ri))
            )
        };
    });
    
    // Фильтруем и сортируем
    return scoredRecipes
        .filter(recipe => recipe.matchCount > 0)  // Хотя бы одно совпадение
        .sort((a, b) => {
            // Сортируем по проценту совпадения (чем больше, тем лучше)
            if (b.matchPercentage !== a.matchPercentage) {
                return b.matchPercentage - a.matchPercentage;
            }
            // Если процент одинаковый, то по количеству совпадений
            return b.matchCount - a.matchCount;
        })
        .slice(0, 10);  // Ограничиваем 10 рецептами
}

// Функция поиска рецептов по названию
function searchRecipesByName(query) {
    const searchQuery = query.toLowerCase().trim();
    return recipesDatabase.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.category.toLowerCase().includes(searchQuery) ||
        recipe.cuisine.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(searchQuery))
    );
}

// Функция получения популярных рецептов
function getPopularRecipes() {
    // Пока просто возвращаем случайные рецепты
    const shuffled = [...recipesDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
}