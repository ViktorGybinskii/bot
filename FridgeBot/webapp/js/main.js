// webapp/js/main.js

// Состояние приложения
let currentPage = 'products'; // 'products' или 'recipes'
let selectedProducts = new Set();
let currentCategory = 'all';
let searchQuery = '';
let currentRecipes = [];

// База данных продуктов
const productsDatabase = [
    // Овощи
    { id: 'tomato', name: 'Помидоры', category: 'vegetables', icon: '🍅' },
    { id: 'cucumber', name: 'Огурцы', category: 'vegetables', icon: '🥒' },
    { id: 'potato', name: 'Картофель', category: 'vegetables', icon: '🥔' },
    { id: 'carrot', name: 'Морковь', category: 'vegetables', icon: '🥕' },
    { id: 'onion', name: 'Лук репчатый', category: 'vegetables', icon: '🧅' },
    { id: 'garlic', name: 'Чеснок', category: 'vegetables', icon: '🧄' },
    { id: 'cabbage', name: 'Капуста', category: 'vegetables', icon: '🥬' },
    { id: 'bell-pepper', name: 'Перец болгарский', category: 'vegetables', icon: '🫑' },
    { id: 'broccoli', name: 'Брокколи', category: 'vegetables', icon: '🥦' },
    { id: 'cauliflower', name: 'Цветная капуста', category: 'vegetables', icon: '🥦' },
    { id: 'zucchini', name: 'Кабачки', category: 'vegetables', icon: '🥒' },
    { id: 'eggplant', name: 'Баклажаны', category: 'vegetables', icon: '🍆' },
    { id: 'pumpkin', name: 'Тыква', category: 'vegetables', icon: '🎃' },
    { id: 'radish', name: 'Редис', category: 'vegetables', icon: '🌶️' },
    { id: 'corn', name: 'Кукуруза', category: 'vegetables', icon: '🌽' },
    
    // Зелень
    { id: 'dill', name: 'Укроп', category: 'herbs', icon: '🌿' },
    { id: 'parsley', name: 'Петрушка', category: 'herbs', icon: '🌿' },
    { id: 'cilantro', name: 'Кинза', category: 'herbs', icon: '🌱' },
    { id: 'basil', name: 'Базилик', category: 'herbs', icon: '🌱' },
    { id: 'green-onion', name: 'Зеленый лук', category: 'herbs', icon: '🧅' },
    { id: 'spinach', name: 'Шпинат', category: 'herbs', icon: '🍃' },
    { id: 'lettuce', name: 'Салат', category: 'herbs', icon: '🥬' },
    { id: 'arugula', name: 'Руккола', category: 'herbs', icon: '🌱' },
    
    // Фрукты
    { id: 'apple', name: 'Яблоки', category: 'fruits', icon: '🍎' },
    { id: 'banana', name: 'Бананы', category: 'fruits', icon: '🍌' },
    { id: 'lemon', name: 'Лимоны', category: 'fruits', icon: '🍋' },
    { id: 'orange', name: 'Апельсины', category: 'fruits', icon: '🍊' },
    { id: 'strawberry', name: 'Клубника', category: 'fruits', icon: '🍓' },
    { id: 'grape', name: 'Виноград', category: 'fruits', icon: '🍇' },
    { id: 'watermelon', name: 'Арбуз', category: 'fruits', icon: '🍉' },
    { id: 'peach', name: 'Персики', category: 'fruits', icon: '🍑' },
    { id: 'pear', name: 'Груши', category: 'fruits', icon: '🍐' },
    { id: 'kiwi', name: 'Киви', category: 'fruits', icon: '🥝' },
    { id: 'pineapple', name: 'Ананас', category: 'fruits', icon: '🍍' },
    { id: 'mango', name: 'Манго', category: 'fruits', icon: '🥭' },
    
    // Молочные
    { id: 'milk', name: 'Молоко', category: 'dairy', icon: '🥛' },
    { id: 'cheese', name: 'Сыр твердый', category: 'dairy', icon: '🧀' },
    { id: 'mozzarella', name: 'Моцарелла', category: 'dairy', icon: '🧀' },
    { id: 'parmesan', name: 'Пармезан', category: 'dairy', icon: '🧀' },
    { id: 'butter', name: 'Масло сливочное', category: 'dairy', icon: '🧈' },
    { id: 'yogurt', name: 'Йогурт', category: 'dairy', icon: '🥛' },
    { id: 'eggs', name: 'Яйца', category: 'dairy', icon: '🥚' },
    { id: 'sour-cream', name: 'Сметана', category: 'dairy', icon: '🥛' },
    { id: 'cream', name: 'Сливки', category: 'dairy', icon: '🥛' },
    { id: 'cottage-cheese', name: 'Творог', category: 'dairy', icon: '🧀' },
    
    // Мясо
    { id: 'chicken', name: 'Курица (филе)', category: 'meat', icon: '🍗' },
    { id: 'chicken-thigh', name: 'Курица (бедро)', category: 'meat', icon: '🍗' },
    { id: 'chicken-wing', name: 'Курица (крылья)', category: 'meat', icon: '🍗' },
    { id: 'beef', name: 'Говядина', category: 'meat', icon: '🥩' },
    { id: 'beef-mince', name: 'Говяжий фарш', category: 'meat', icon: '🥩' },
    { id: 'pork', name: 'Свинина', category: 'meat', icon: '🐷' },
    { id: 'pork-mince', name: 'Свиной фарш', category: 'meat', icon: '🐷' },
    { id: 'bacon', name: 'Бекон', category: 'meat', icon: '🥓' },
    { id: 'sausage', name: 'Колбаса', category: 'meat', icon: '🌭' },
    { id: 'ham', name: 'Ветчина', category: 'meat', icon: '🍖' },
    { id: 'lamb', name: 'Баранина', category: 'meat', icon: '🐑' },
    { id: 'duck', name: 'Утка', category: 'meat', icon: '🦆' },
    
    // Рыба
    { id: 'fish', name: 'Рыба (филе)', category: 'seafood', icon: '🐟' },
    { id: 'salmon', name: 'Семга/Лосось', category: 'seafood', icon: '🐠' },
    { id: 'shrimp', name: 'Креветки', category: 'seafood', icon: '🦐' },
    { id: 'squid', name: 'Кальмары', category: 'seafood', icon: '🦑' },
    { id: 'mussels', name: 'Мидии', category: 'seafood', icon: '🦪' },
    { id: 'crab', name: 'Краб', category: 'seafood', icon: '🦀' },
    { id: 'tuna', name: 'Тунец', category: 'seafood', icon: '🐟' },
    { id: 'canned-fish', name: 'Рыбные консервы', category: 'seafood', icon: '🥫' },
    
    // Бакалея
    { id: 'pasta', name: 'Макароны', category: 'groceries', icon: '🍝' },
    { id: 'spaghetti', name: 'Спагетти', category: 'groceries', icon: '🍝' },
    { id: 'rice', name: 'Рис', category: 'groceries', icon: '🍚' },
    { id: 'buckwheat', name: 'Гречка', category: 'groceries', icon: '🌾' },
    { id: 'flour', name: 'Мука', category: 'groceries', icon: '🫓' },
    { id: 'sugar', name: 'Сахар', category: 'groceries', icon: '🧁' },
    { id: 'salt', name: 'Соль', category: 'groceries', icon: '🧂' },
    { id: 'oil', name: 'Масло растительное', category: 'groceries', icon: '🫒' },
    { id: 'olive-oil', name: 'Масло оливковое', category: 'groceries', icon: '🫒' },
    { id: 'vinegar', name: 'Уксус', category: 'groceries', icon: '🍶' },
    { id: 'soy-sauce', name: 'Соевый соус', category: 'groceries', icon: '🍶' },
    { id: 'ketchup', name: 'Кетчуп', category: 'groceries', icon: '🍅' },
    { id: 'mayonnaise', name: 'Майонез', category: 'groceries', icon: '🥫' },
    { id: 'breadcrumbs', name: 'Панировочные сухари', category: 'groceries', icon: '🥖' },
    { id: 'cereal', name: 'Хлопья', category: 'groceries', icon: '🥣' },
    
    // Консервы
    { id: 'peas', name: 'Горошек консервированный', category: 'canned', icon: '🥫' },
    { id: 'corn-canned', name: 'Кукуруза консервированная', category: 'canned', icon: '🥫' },
    { id: 'beans', name: 'Фасоль консервированная', category: 'canned', icon: '🥫' },
    { id: 'olives', name: 'Оливки', category: 'canned', icon: '🫒' },
    { id: 'pickles', name: 'Огурцы соленые', category: 'canned', icon: '🥒' },
    
    // Специи
    { id: 'pepper', name: 'Перец черный', category: 'spices', icon: '🫑' },
    { id: 'paprika', name: 'Паприка', category: 'spices', icon: '🫑' },
    { id: 'cinnamon', name: 'Корица', category: 'spices', icon: '🥨' },
    { id: 'vanilla', name: 'Ваниль', category: 'spices', icon: '🍨' },
    { id: 'bay-leaf', name: 'Лавровый лист', category: 'spices', icon: '🌿' },
    { id: 'turmeric', name: 'Куркума', category: 'spices', icon: '🟡' },
    { id: 'ginger', name: 'Имбирь', category: 'spices', icon: '🫚' },
    { id: 'cumin', name: 'Зира', category: 'spices', icon: '🌾' }
];

// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.disableVerticalSwipes(); // Запрещаем свайпы

// Загрузка сохраненных продуктов из sessionStorage
function loadSelectedProducts() {
    const saved = sessionStorage.getItem('selectedProducts');
    if (saved) {
        selectedProducts = new Set(JSON.parse(saved));
    }
}

// Сохранение продуктов в sessionStorage
function saveSelectedProducts() {
    sessionStorage.setItem('selectedProducts', JSON.stringify([...selectedProducts]));
}

// Функция показа страницы с продуктами
function showProductsPage() {
    currentPage = 'products';
    renderProductsPage();
    renderProductsFooter();
}

// Функция показа страницы с рецептами
function showRecipesPage() {
    currentPage = 'recipes';
    
    // Получаем названия выбранных продуктов
    const selectedNames = Array.from(selectedProducts)
        .map(id => {
            const product = productsDatabase.find(p => p.id === id);
            return product ? product.name : id;
        });
    
    // Ищем рецепты
    currentRecipes = findRecipesByIngredients(selectedNames);
    
    renderRecipesPage();
    renderRecipesFooter();
}

// Функция показа всех рецептов
function showAllRecipesPage() {
    currentPage = 'recipes';
    currentRecipes = getAllRecipes().map(recipe => ({
        ...recipe,
        matchPercentage: 100,
        missingIngredients: []
    }));
    renderRecipesPage();
    renderRecipesFooter();
}

// Отрисовка страницы с продуктами
function renderProductsPage() {
    const content = document.getElementById('content');
    
    let filteredProducts = productsDatabase;
    
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );
    }
    
    let productsHtml = `
        <header class="header fade-in">
            <h1>
                <span>🥘</span>
                Fridge Chef
            </h1>
            <p>Выберите продукты в холодильнике</p>
        </header>
        
        <div class="search-container" style="margin-bottom: 15px;">
            <div style="display: flex; gap: 8px;">
                <input type="text" 
                       id="searchInput" 
                       placeholder="🔍 Поиск продуктов..." 
                       value="${searchQuery}"
                       style="flex: 1; padding: 10px; border: 2px solid #e2e8f0; border-radius: 30px; font-size: 14px;">
                <button id="clearSearch" 
                        style="padding: 0 15px; background: #f1f5f9; border: none; border-radius: 30px; cursor: pointer;">
                    ✕
                </button>
            </div>
        </div>
        
        <div class="categories" style="margin-bottom: 15px; overflow-x: auto; white-space: nowrap; padding: 5px 0;">
            <button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">Все</button>
            <button class="category-btn ${currentCategory === 'vegetables' ? 'active' : ''}" data-category="vegetables">Овощи</button>
            <button class="category-btn ${currentCategory === 'herbs' ? 'active' : ''}" data-category="herbs">Зелень</button>
            <button class="category-btn ${currentCategory === 'fruits' ? 'active' : ''}" data-category="fruits">Фрукты</button>
            <button class="category-btn ${currentCategory === 'dairy' ? 'active' : ''}" data-category="dairy">Молочные</button>
            <button class="category-btn ${currentCategory === 'meat' ? 'active' : ''}" data-category="meat">Мясо</button>
            <button class="category-btn ${currentCategory === 'seafood' ? 'active' : ''}" data-category="seafood">Рыба</button>
            <button class="category-btn ${currentCategory === 'groceries' ? 'active' : ''}" data-category="groceries">Бакалея</button>
            <button class="category-btn ${currentCategory === 'canned' ? 'active' : ''}" data-category="canned">Консервы</button>
            <button class="category-btn ${currentCategory === 'spices' ? 'active' : ''}" data-category="spices">Специи</button>
        </div>
    `;
    
    if (filteredProducts.length === 0) {
        productsHtml += `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <p>😕 Ничего не найдено</p>
                <p style="font-size: 14px;">Попробуйте изменить запрос</p>
            </div>
        `;
    } else {
        productsHtml += `<div class="products-grid">`;
        
        filteredProducts.forEach(product => {
            productsHtml += `
                <div class="product-item ${selectedProducts.has(product.id) ? 'selected' : ''}" 
                     data-id="${product.id}"
                     onclick="toggleProduct('${product.id}')">
                    <span class="product-icon">${product.icon}</span>
                    <span class="product-name">${product.name}</span>
                </div>
            `;
        });
        
        productsHtml += `</div>`;
    }
    
    content.innerHTML = productsHtml;
    
    // Добавляем обработчики
    attachProductsEventListeners();
}

// Отрисовка страницы с рецептами
function renderRecipesPage() {
    const content = document.getElementById('content');
    
    let recipesHtml = `
        <div class="results-header">
            <button class="back-btn" onclick="showProductsPage()">
                ← Назад
            </button>
            <span>Найдено: ${currentRecipes.length}</span>
        </div>
        
        <div class="filter-chips">
            <span class="filter-chip active" onclick="filterRecipes('all')">Все</span>
            <span class="filter-chip" onclick="filterRecipes('breakfast')">Завтраки</span>
            <span class="filter-chip" onclick="filterRecipes('soup')">Супы</span>
            <span class="filter-chip" onclick="filterRecipes('main')">Основные</span>
            <span class="filter-chip" onclick="filterRecipes('salad')">Салаты</span>
            <span class="filter-chip" onclick="filterRecipes('baking')">Выпечка</span>
            <span class="filter-chip" onclick="filterRecipes('dessert')">Десерты</span>
        </div>
        
        <div class="recipes-grid">
    `;
    
    if (currentRecipes.length === 0) {
        recipesHtml += `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p>😔 Рецептов не найдено</p>
                <p style="font-size: 14px; color: #64748b;">Попробуйте выбрать другие продукты</p>
            </div>
        `;
    } else {
        currentRecipes.forEach(recipe => {
            let badgeColor = '#ef4444';
            if (recipe.matchPercentage >= 80) badgeColor = '#22c55e';
            else if (recipe.matchPercentage >= 50) badgeColor = '#eab308';
            
            recipesHtml += `
                <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
                    <div class="recipe-image">
                        ${recipe.emoji || '🍽️'}
                    </div>
                    <div class="recipe-info">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <span class="recipe-category">${recipe.category} · ${recipe.time}</span>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                            <span class="match-badge" style="background: ${badgeColor}">
                                ${recipe.matchPercentage}%
                            </span>
                            <span>${recipe.calories} ккал</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    recipesHtml += `</div>`;
    content.innerHTML = recipesHtml;
}

// Фильтрация рецептов
window.filterRecipes = function(category) {
    const categoryMap = {
        'breakfast': 'Завтрак',
        'soup': 'Суп',
        'main': 'Основное блюдо',
        'salad': 'Салат',
        'baking': 'Выпечка',
        'dessert': 'Десерт'
    };
    
    const filtered = category === 'all' 
        ? currentRecipes 
        : currentRecipes.filter(r => r.category === categoryMap[category]);
    
    // Обновляем отображение (простая реализация - перерисовываем)
    renderRecipesPage();
};

// Просмотр детального рецепта
window.viewRecipe = function(id) {
    const recipe = getRecipeById(id);
    if (!recipe) return;
    
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="results-header">
            <button class="back-btn" onclick="renderRecipesPage()">
                ← К рецептам
            </button>
        </div>
        
        <div class="recipe-detail" style="padding: 20px 0;">
            <div style="font-size: 5em; text-align: center; margin: 20px 0;">
                ${recipe.emoji || '🍽️'}
            </div>
            
            <h1 style="font-size: 28px; margin: 20px 0; text-align: center;">${recipe.name}</h1>
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
                <span class="filter-chip">⏱️ ${recipe.time}</span>
                <span class="filter-chip">👥 ${recipe.servings} порции</span>
                <span class="filter-chip">🔥 ${recipe.calories} ккал</span>
                <span class="filter-chip">📊 ${recipe.difficulty}</span>
            </div>
            
            <h3>📝 Ингредиенты:</h3>
            <ul style="list-style: none; padding: 0; margin: 15px 0;">
                ${recipe.ingredients.map(i => `
                    <li style="padding: 8px; background: #f8fafc; margin: 5px 0; border-radius: 10px;">
                        <strong>${i.name}</strong> - ${i.amount}
                    </li>
                `).join('')}
            </ul>
            
            <h3>👨‍🍳 Приготовление:</h3>
            <ol style="padding-left: 20px; margin: 15px 0;">
                ${recipe.instructions.map(step => `
                    <li style="margin: 10px 0;">${step}</li>
                `).join('')}
            </ol>
        </div>
    `;
};

// Отрисовка нижней панели для страницы продуктов
function renderProductsFooter() {
    const footer = document.getElementById('footerButtons');
    const countElement = document.getElementById('selectedCount');
    
    footer.innerHTML = `
        <button class="footer-btn primary" id="findRecipesBtn" ${selectedProducts.size === 0 ? 'disabled' : ''}>
            🔍 Найти рецепты
        </button>
        <button class="footer-btn secondary" id="allRecipesBtn">
            📚 Все рецепты
        </button>
        <button class="footer-btn danger" id="resetBtn">
            🗑️ Сброс
        </button>
    `;
    
    countElement.textContent = `Выбрано продуктов: ${selectedProducts.size}`;
    
    // Обработчики
    document.getElementById('findRecipesBtn').addEventListener('click', () => {
        showRecipesPage();
    });
    
    document.getElementById('allRecipesBtn').addEventListener('click', () => {
        showAllRecipesPage();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        selectedProducts.clear();
        saveSelectedProducts();
        renderProductsPage();
        renderProductsFooter();
    });
}

// Отрисовка нижней панели для страницы рецептов
function renderRecipesFooter() {
    const footer = document.getElementById('footerButtons');
    const countElement = document.getElementById('selectedCount');
    
    footer.innerHTML = `
        <button class="footer-btn primary" onclick="showProductsPage()">
            ← Выбрать продукты
        </button>
        <button class="footer-btn secondary" onclick="showAllRecipesPage()">
            📚 Все рецепты
        </button>
    `;
    
    countElement.textContent = `Найдено рецептов: ${currentRecipes.length}`;
}

// Переключение продукта
window.toggleProduct = function(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    
    saveSelectedProducts();
    renderProductsPage();
    renderProductsFooter();
};

// Обработчики для страницы продуктов
function attachProductsEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value;
                renderProductsPage();
            }, 300);
        });
    }
    
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchQuery = '';
            renderProductsPage();
        });
    }
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            renderProductsPage();
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedProducts();
    showProductsPage();
});

// Сохраняем функции в глобальную область
window.showProductsPage = showProductsPage;
window.showRecipesPage = showRecipesPage;
window.showAllRecipesPage = showAllRecipesPage;