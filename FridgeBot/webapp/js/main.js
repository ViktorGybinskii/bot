// webapp/js/main.js

// Состояние приложения
let currentPage = 'products';
let selectedProducts = new Set();
let currentCategory = 'all';
let searchQuery = '';
let currentRecipes = [];
let isSearchFocused = false;
let searchTimeout;
let currentFilterCategory = 'all';

// Новые переменные для пагинации
let visibleProducts = [];
let currentPage_index = 0;
const PRODUCTS_PER_PAGE = 50;
let isLoading = false;
let hasMoreProducts = true;

// Принудительное применение стилей для темной темы
function injectDarkThemeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Прямое внедрение стилей для темной темы */
        body.dark-theme .recipe-detail .ingredients-list {
            background: #3d3d3d !important;
        }
        
        body.dark-theme .recipe-detail .ingredients-list li {
            background: #2d2d2d !important;
            border: 1px solid #404040 !important;
            color: white !important;
        }
        
        body.dark-theme .recipe-detail .ingredients-list li span:first-child {
            color: white !important;
        }
        
        body.dark-theme .recipe-detail .ingredients-list li span:last-child {
            color: #8b9eff !important;
        }
        
        body.dark-theme .filter-chips .filter-chip {
            background: #3d3d3d !important;
            color: #e0e0e0 !important;
        }
        
        body.dark-theme .filter-chips .filter-chip.active {
            background: #8b9eff !important;
            color: white !important;
        }
        
        body.dark-theme .back-btn {
            background: #3d3d3d !important;
            color: #e0e0e0 !important;
        }
        
        body.dark-theme .meta-item {
            background: #3d3d3d !important;
            color: #e0e0e0 !important;
        }
        
        body.dark-theme .instructions {
            color: #e0e0e0 !important;
        }
        
        body.dark-theme .instructions li span {
            background: #8b9eff !important;
            color: white !important;
        }
    `;
    document.head.appendChild(style);
    console.log('Стили для темной темы внедрены');
}

// База данных продуктов (РАСШИРЕННАЯ - 300+ продуктов)
const productsDatabase = [
    { id: 'tomato', name: 'Помидоры', category: 'vegetables', icon: '🍅' },
    { id: 'cucumber', name: 'Огурцы', category: 'vegetables', icon: '🥒' },
    { id: 'potato', name: 'Картофель', category: 'vegetables', icon: '🥔' },
    { id: 'carrot', name: 'Морковь', category: 'vegetables', icon: '🥕' },
    { id: 'onion', name: 'Лук репчатый', category: 'vegetables', icon: '🧅' },
    { id: 'garlic', name: 'Чеснок', category: 'vegetables', icon: '🧄' },
    { id: 'cabbage', name: 'Капуста белокочанная', category: 'vegetables', icon: '🥬' },
    { id: 'bell-pepper', name: 'Перец болгарский', category: 'vegetables', icon: '🫑' },
    { id: 'broccoli', name: 'Брокколи', category: 'vegetables', icon: '🥦' },
    { id: 'cauliflower', name: 'Цветная капуста', category: 'vegetables', icon: '🥦' },
    { id: 'zucchini', name: 'Кабачки', category: 'vegetables', icon: '🥒' },
    { id: 'eggplant', name: 'Баклажаны', category: 'vegetables', icon: '🍆' },
    { id: 'pumpkin', name: 'Тыква', category: 'vegetables', icon: '🎃' },
    { id: 'radish', name: 'Редис', category: 'vegetables', icon: '🌶️' },
    { id: 'corn', name: 'Кукуруза', category: 'vegetables', icon: '🌽' },
    { id: 'beetroot', name: 'Свекла', category: 'vegetables', icon: '🟣' },
    { id: 'turnip', name: 'Репа', category: 'vegetables', icon: '🟡' },
    { id: 'celery', name: 'Сельдерей', category: 'vegetables', icon: '🥬' },
    { id: 'parsnip', name: 'Пастернак', category: 'vegetables', icon: '🥕' },
    { id: 'horseradish', name: 'Хрен', category: 'vegetables', icon: '🌶️' },
    { id: 'red-cabbage', name: 'Капуста краснокочанная', category: 'vegetables', icon: '🟣' },
    { id: 'savoy-cabbage', name: 'Капуста савойская', category: 'vegetables', icon: '🥬' },
    { id: 'brussels-sprouts', name: 'Брюссельская капуста', category: 'vegetables', icon: '🥬' },
    { id: 'kohlrabi', name: 'Кольраби', category: 'vegetables', icon: '🟢' },
    { id: 'pak-choi', name: 'Пак-чой', category: 'vegetables', icon: '🥬' },
    { id: 'kale', name: 'Кале (кудрявая капуста)', category: 'vegetables', icon: '🥬' },
    { id: 'red-onion', name: 'Лук красный', category: 'vegetables', icon: '🧅' },
    { id: 'leek', name: 'Лук-порей', category: 'vegetables', icon: '🧅' },
    { id: 'shallot', name: 'Лук-шалот', category: 'vegetables', icon: '🧅' },
    { id: 'spring-onion', name: 'Лук зеленый', category: 'vegetables', icon: '🧅' },
    { id: 'chives', name: 'Шнитт-лук', category: 'vegetables', icon: '🌱' },
    { id: 'chili', name: 'Перец чили', category: 'vegetables', icon: '🌶️' },
    { id: 'jalapeno', name: 'Халапеньо', category: 'vegetables', icon: '🌶️' },
    { id: 'habanero', name: 'Хабанеро', category: 'vegetables', icon: '🌶️' },
    { id: 'sweet-pepper', name: 'Перец сладкий', category: 'vegetables', icon: '🫑' },
    { id: 'yellow-pepper', name: 'Перец желтый', category: 'vegetables', icon: '🫑' },
    { id: 'orange-pepper', name: 'Перец оранжевый', category: 'vegetables', icon: '🫑' },
    { id: 'squash', name: 'Патиссон', category: 'vegetables', icon: '🟡' },
    { id: 'acorn-squash', name: 'Тыква желудевая', category: 'vegetables', icon: '🎃' },
    { id: 'butternut', name: 'Тыква мускатная', category: 'vegetables', icon: '🎃' },
    { id: 'spaghetti-squash', name: 'Тыква спагетти', category: 'vegetables', icon: '🎃' },
    { id: 'green-beans', name: 'Фасоль стручковая', category: 'vegetables', icon: '🫛' },
    { id: 'peas-fresh', name: 'Горошек зеленый', category: 'vegetables', icon: '🫛' },
    { id: 'asparagus', name: 'Спаржа', category: 'vegetables', icon: '🌱' },
    { id: 'okra', name: 'Окра (бамия)', category: 'vegetables', icon: '🫛' },
    { id: 'sweet-potato', name: 'Батат (сладкий картофель)', category: 'vegetables', icon: '🍠' },
    { id: 'jerusalem-artichoke', name: 'Топинамбур', category: 'vegetables', icon: '🥔' },
    { id: 'daikon', name: 'Дайкон', category: 'vegetables', icon: '🥕' },
    { id: 'radicchio', name: 'Радиккьо', category: 'vegetables', icon: '🟣' },
    { id: 'artichoke', name: 'Артишок', category: 'vegetables', icon: '🌿' },
    { id: 'dill', name: 'Укроп', category: 'herbs', icon: '🌿' },
    { id: 'parsley', name: 'Петрушка', category: 'herbs', icon: '🌿' },
    { id: 'cilantro', name: 'Кинза', category: 'herbs', icon: '🌱' },
    { id: 'basil', name: 'Базилик', category: 'herbs', icon: '🌱' },
    { id: 'green-onion', name: 'Зеленый лук', category: 'herbs', icon: '🧅' },
    { id: 'spinach', name: 'Шпинат', category: 'herbs', icon: '🍃' },
    { id: 'lettuce', name: 'Салат листовой', category: 'herbs', icon: '🥬' },
    { id: 'arugula', name: 'Руккола', category: 'herbs', icon: '🌱' },
    { id: 'mint', name: 'Мята', category: 'herbs', icon: '🌿' },
    { id: 'oregano', name: 'Орегано', category: 'herbs', icon: '🌿' },
    { id: 'thyme', name: 'Тимьян (чабрец)', category: 'herbs', icon: '🌿' },
    { id: 'rosemary', name: 'Розмарин', category: 'herbs', icon: '🌿' },
    { id: 'sage', name: 'Шалфей', category: 'herbs', icon: '🌿' },
    { id: 'tarragon', name: 'Эстрагон (тархун)', category: 'herbs', icon: '🌿' },
    { id: 'chervil', name: 'Кервель', category: 'herbs', icon: '🌿' },
    { id: 'lovage', name: 'Любисток', category: 'herbs', icon: '🌿' },
    { id: 'sorrel', name: 'Щавель', category: 'herbs', icon: '🍃' },
    { id: 'watercress', name: 'Кресс-салат', category: 'herbs', icon: '🌱' },
    { id: 'fennel', name: 'Фенхель', category: 'herbs', icon: '🌿' },
    { id: 'dandelion', name: 'Одуванчик (листья)', category: 'herbs', icon: '🌼' },
    { id: 'nettle', name: 'Крапива', category: 'herbs', icon: '🌿' },
    { id: 'parsley-root', name: 'Петрушка корневая', category: 'herbs', icon: '🌿' },
    { id: 'celery-leaves', name: 'Сельдерей (листья)', category: 'herbs', icon: '🥬' },
    { id: 'basil-purple', name: 'Базилик фиолетовый', category: 'herbs', icon: '🟣' },
    { id: 'lemon-balm', name: 'Мелисса', category: 'herbs', icon: '🌿' },
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
    { id: 'apple-green', name: 'Яблоки зеленые', category: 'fruits', icon: '🍏' },
    { id: 'apple-red', name: 'Яблоки красные', category: 'fruits', icon: '🍎' },
    { id: 'apple-golden', name: 'Яблоки золотые', category: 'fruits', icon: '🍎' },
    { id: 'apple-granny', name: 'Яблоки Гренни Смит', category: 'fruits', icon: '🍏' },
    { id: 'lime', name: 'Лайм', category: 'fruits', icon: '🍈' },
    { id: 'grapefruit', name: 'Грейпфрут', category: 'fruits', icon: '🍊' },
    { id: 'tangerine', name: 'Мандарины', category: 'fruits', icon: '🍊' },
    { id: 'pomelo', name: 'Помело', category: 'fruits', icon: '🍊' },
    { id: 'clementine', name: 'Клементин', category: 'fruits', icon: '🍊' },
    { id: 'raspberry', name: 'Малина', category: 'fruits', icon: '🍇' },
    { id: 'blueberry', name: 'Голубика', category: 'fruits', icon: '🫐' },
    { id: 'blackberry', name: 'Ежевика', category: 'fruits', icon: '🍇' },
    { id: 'cranberry', name: 'Клюква', category: 'fruits', icon: '🍓' },
    { id: 'cherry', name: 'Вишня', category: 'fruits', icon: '🍒' },
    { id: 'sweet-cherry', name: 'Черешня', category: 'fruits', icon: '🍒' },
    { id: 'currant-red', name: 'Смородина красная', category: 'fruits', icon: '🍓' },
    { id: 'currant-black', name: 'Смородина черная', category: 'fruits', icon: '🫐' },
    { id: 'gooseberry', name: 'Крыжовник', category: 'fruits', icon: '🍇' },
    { id: 'lingonberry', name: 'Брусника', category: 'fruits', icon: '🍓' },
    { id: 'avocado', name: 'Авокадо', category: 'fruits', icon: '🥑' },
    { id: 'pomegranate', name: 'Гранат', category: 'fruits', icon: '🍎' },
    { id: 'fig', name: 'Инжир', category: 'fruits', icon: '🟣' },
    { id: 'persimmon', name: 'Хурма', category: 'fruits', icon: '🍊' },
    { id: 'feijoa', name: 'Фейхоа', category: 'fruits', icon: '🟢' },
    { id: 'papaya', name: 'Папайя', category: 'fruits', icon: '🍈' },
    { id: 'passion-fruit', name: 'Маракуйя', category: 'fruits', icon: '🟡' },
    { id: 'lychee', name: 'Личи', category: 'fruits', icon: '🍓' },
    { id: 'rambutan', name: 'Рамбутан', category: 'fruits', icon: '🔴' },
    { id: 'durian', name: 'Дуриан', category: 'fruits', icon: '🟡' },
    { id: 'jackfruit', name: 'Джекфрут', category: 'fruits', icon: '🟢' },
    { id: 'dragon-fruit', name: 'Питахайя (драконий фрукт)', category: 'fruits', icon: '🐉' },
    { id: 'carambola', name: 'Карамбола', category: 'fruits', icon: '⭐' },
    { id: 'guava', name: 'Гуава', category: 'fruits', icon: '🟢' },
    { id: 'quince', name: 'Айва', category: 'fruits', icon: '🍐' },
    { id: 'apricot', name: 'Абрикосы', category: 'fruits', icon: '🍑' },
    { id: 'nectarine', name: 'Нектарины', category: 'fruits', icon: '🍑' },
    { id: 'plum', name: 'Сливы', category: 'fruits', icon: '🟣' },
    { id: 'prune', name: 'Чернослив', category: 'fruits', icon: '🟣' },
    { id: 'dates', name: 'Финики', category: 'fruits', icon: '🌴' }
];

// Инициализация Telegram с поддержкой темы
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.disableVerticalSwipes();

// Принудительно применяем темную тему
function applyTheme() {
    const isDark = tg.colorScheme === 'dark';
    console.log('Тема Telegram:', isDark ? 'темная' : 'светлая');
    
    if (isDark) {
        document.body.classList.add('dark-theme');
        console.log('Класс dark-theme добавлен');
    } else {
        document.body.classList.remove('dark-theme');
        console.log('Класс dark-theme удален');
    }
}

applyTheme();
tg.onEvent('themeChanged', applyTheme);

// Загрузка сохраненных продуктов
function loadSelectedProducts() {
    const saved = sessionStorage.getItem('selectedProducts');
    if (saved) {
        selectedProducts = new Set(JSON.parse(saved));
    }
}

function saveSelectedProducts() {
    sessionStorage.setItem('selectedProducts', JSON.stringify([...selectedProducts]));
}

// Функция показа/скрытия футера при поиске
function updateFooterVisibility() {
    const footerBar = document.querySelector('.footer-bar');
    if (!footerBar) return;
    
    if (isSearchFocused && window.innerWidth <= 768) {
        footerBar.style.transform = 'translateY(100%)';
        footerBar.style.transition = 'transform 0.3s ease';
    } else {
        footerBar.style.transform = 'translateY(0)';
    }
}

// Функция показа страницы с продуктами
function showProductsPage() {
    currentPage = 'products';
    currentPage_index = 0;
    visibleProducts = [];
    hasMoreProducts = true;
    renderProductsPage();
    renderProductsFooter();
}

// Функция показа страницы с рецептами
function showRecipesPage() {
    const selectedNames = Array.from(selectedProducts)
        .map(id => {
            const product = productsDatabase.find(p => p.id === id);
            return product ? product.name : id;
        });
    
    window.location.href = `recipes.html?ingredients=${encodeURIComponent(selectedNames.join(','))}`;
}

// Функция показа всех рецептов
function showAllRecipesPage() {
    window.location.href = 'recipes.html?all=true';
}

// Получение отфильтрованных продуктов
function getFilteredProducts() {
    let filtered = productsDatabase;
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

// Загрузка следующей порции продуктов
function loadMoreProducts() {
    if (isLoading || !hasMoreProducts) return;
    
    isLoading = true;
    
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    setTimeout(() => {
        const filteredProducts = getFilteredProducts();
        const start = currentPage_index * PRODUCTS_PER_PAGE;
        const end = start + PRODUCTS_PER_PAGE;
        
        if (start >= filteredProducts.length) {
            hasMoreProducts = false;
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            isLoading = false;
            return;
        }
        
        const newProducts = filteredProducts.slice(start, end);
        visibleProducts = [...visibleProducts, ...newProducts];
        currentPage_index++;
        
        appendProductsToGrid(newProducts);
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        isLoading = false;
        
        if (end >= filteredProducts.length) {
            hasMoreProducts = false;
            const endMessage = document.getElementById('end-message');
            if (endMessage) {
                endMessage.style.display = 'block';
            }
        }
    }, 100);
}

// Добавление продуктов в сетку
function appendProductsToGrid(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = `product-item ${selectedProducts.has(product.id) ? 'selected' : ''}`;
        productEl.dataset.id = product.id;
        
        productEl.innerHTML = `
            <span class="product-icon">${product.icon}</span>
            <span class="product-name">${product.name}</span>
        `;
        
        productEl.onclick = () => {
            toggleProduct(product.id);
            const searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.blur();
            }
        };
        
        grid.appendChild(productEl);
    });
}

// Отрисовка страницы с продуктами
function renderProductsPage() {
    const content = document.getElementById('content');
    
    const filteredProducts = getFilteredProducts();
    visibleProducts = filteredProducts.slice(0, PRODUCTS_PER_PAGE);
    currentPage_index = 1;
    hasMoreProducts = filteredProducts.length > PRODUCTS_PER_PAGE;
    
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
                    style="flex: 1; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 30px; font-size: 16px; transition: all 0.3s ease;"
                    onfocus="handleSearchFocus(true)"
                    onblur="handleSearchFocus(false)">
                <button id="clearSearch" 
                        style="padding: 0 20px; background: #f1f5f9; border: none; border-radius: 30px; cursor: pointer; font-size: 18px;">
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
            <button class="category-btn ${currentCategory === 'nuts' ? 'active' : ''}" data-category="nuts">Орехи</button>
            <button class="category-btn ${currentCategory === 'frozen' ? 'active' : ''}" data-category="frozen">Заморозка</button>
        </div>
        
        <div class="stats-bar" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
            <span id="total-products">📦 Всего продуктов: ${filteredProducts.length}</span>
            <span id="selected-products-counter">✅ Выбрано: ${selectedProducts.size}</span>
        </div>
    `;
    
    if (filteredProducts.length === 0) {
        productsHtml += `
            <div style="text-align: center; padding: 60px 20px; color: #64748b;">
                <span style="font-size: 48px;">😕</span>
                <p style="margin-top: 20px;">Ничего не найдено</p>
                <p style="font-size: 14px;">Попробуйте изменить запрос</p>
            </div>
        `;
        content.innerHTML = productsHtml;
    } else {
        productsHtml += `<div class="products-grid" id="productsGrid"></div>`;
        productsHtml += `
            <div id="loading-indicator" style="text-align: center; padding: 20px; display: none;">
                <div class="loading-spinner" style="width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 10px; color: #64748b;">Загрузка...</p>
            </div>
            <div id="end-message" style="text-align: center; padding: 20px; color: #64748b; display: ${hasMoreProducts ? 'none' : 'block'};">
                <p>✨ Все продукты загружены</p>
            </div>
            <div id="scroll-trigger" style="height: 20px;"></div>
        `;
        
        content.innerHTML = productsHtml;
        
        const grid = document.getElementById('productsGrid');
        appendProductsToGrid(visibleProducts);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && hasMoreProducts && !isLoading) {
                    loadMoreProducts();
                }
            });
        }, { threshold: 0.1, rootMargin: '100px' });
        
        const trigger = document.getElementById('scroll-trigger');
        if (trigger) observer.observe(trigger);
    }
    
    attachProductsEventListeners();
}

// Отрисовка страницы с рецептами
function renderRecipesPage() {
    const content = document.getElementById('content');
    
    const urlParams = new URLSearchParams(window.location.search);
    const isAllMode = urlParams.has('all');
    const urlSearchQuery = urlParams.get('search') || '';
    
   let recipesHtml = `
    <div class="results-header" style="display: flex; justify-content: ${isAllMode ? 'center' : 'space-between'}; align-items: center; margin-bottom: 15px;">
        ${!isAllMode ? '<button class="back-btn" onclick="showProductsPage()" style="background: #f1f5f9; border: none; padding: 8px 15px; border-radius: 30px; cursor: pointer;">← Назад</button>' : ''}
        <span style="font-weight: 600; color: #475569;">Найдено: ${currentRecipes.length}</span>
    </div>
`;
    
    if (isAllMode) {
        recipesHtml += `
            <div class="search-container" style="margin-bottom: 15px;">
                <div style="display: flex; gap: 8px;">
                    <input type="text" 
                        id="recipeSearchInput" 
                        placeholder="🔍 Поиск по названию рецепта..." 
                        value="${urlSearchQuery}"
                        style="flex: 1; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 30px; font-size: 16px; transition: all 0.3s ease;">
                    <button id="clearRecipeSearch" 
                            style="padding: 0 20px; background: #f1f5f9; border: none; border-radius: 30px; cursor: pointer; font-size: 18px;">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }
    
    recipesHtml += `
        <div class="filter-chips" style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin-bottom: 15px;">
            <span class="filter-chip ${currentFilterCategory === 'all' ? 'active' : ''}" onclick="filterRecipes(event, 'all')">Все</span>
            <span class="filter-chip ${currentFilterCategory === 'breakfast' ? 'active' : ''}" onclick="filterRecipes(event, 'breakfast')">Завтраки</span>
            <span class="filter-chip ${currentFilterCategory === 'soup' ? 'active' : ''}" onclick="filterRecipes(event, 'soup')">Супы</span>
            <span class="filter-chip ${currentFilterCategory === 'main' ? 'active' : ''}" onclick="filterRecipes(event, 'main')">Основные</span>
            <span class="filter-chip ${currentFilterCategory === 'salad' ? 'active' : ''}" onclick="filterRecipes(event, 'salad')">Салаты</span>
            <span class="filter-chip ${currentFilterCategory === 'baking' ? 'active' : ''}" onclick="filterRecipes(event, 'baking')">Выпечка</span>
            <span class="filter-chip ${currentFilterCategory === 'dessert' ? 'active' : ''}" onclick="filterRecipes(event, 'dessert')">Десерты</span>
        </div>
        
        <div class="recipes-grid">
    `;
    
    if (currentRecipes.length === 0) {
        recipesHtml += `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <span style="font-size: 48px;">😔</span>
                <p style="margin-top: 20px; font-size: 18px;">Рецептов не найдено</p>
                <p style="font-size: 14px; color: #64748b;">Попробуйте изменить запрос</p>
            </div>
        `;
    } else {
        currentRecipes.forEach(recipe => {
            let badgeColor = '#ef4444';
            if (recipe.matchPercentage >= 80) badgeColor = '#22c55e';
            else if (recipe.matchPercentage >= 50) badgeColor = '#eab308';
            
            const missingText = recipe.missingIngredients && recipe.missingIngredients.length > 0 
                ? `❌ Не хватает: ${recipe.missingIngredients.slice(0, 3).join(', ')}${recipe.missingIngredients.length > 3 ? '...' : ''}`
                : recipe.missingIngredients && recipe.missingIngredients.length === 0
                ? '✅ Все продукты есть!'
                : '';
            
            recipesHtml += `
                <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
                    <div class="recipe-image" style="height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 3em;">
                        ${recipe.emoji || '🍽️'}
                    </div>
                    <div class="recipe-info" style="padding: 15px;">
                        <h3 class="recipe-title" style="font-size: 16px; margin-bottom: 5px;">${recipe.name}</h3>
                        <span class="recipe-category" style="font-size: 12px; color: #64748b;">${recipe.category} · ${recipe.time}</span>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
                            <span class="match-badge" style="background: ${badgeColor}; padding: 4px 8px; border-radius: 20px; font-size: 12px; color: white;">
                                Совпадение: ${recipe.matchPercentage}%
                            </span>
                            <span style="font-size: 12px; color: #64748b;">${recipe.calories} ккал</span>
                        </div>
                        ${missingText ? `
                            <p style="font-size: 12px; color: ${recipe.missingIngredients && recipe.missingIngredients.length === 0 ? '#22c55e' : '#ef4444'}; margin-top: 5px; padding: 5px; background: #f8fafc; border-radius: 8px;">
                                ${missingText}
                            </p>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    recipesHtml += `</div>`;
    content.innerHTML = recipesHtml;
    
    if (isAllMode) {
        const searchInput = document.getElementById('recipeSearchInput');
        const clearSearch = document.getElementById('clearRecipeSearch');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    const url = new URL(window.location);
                    if (query) {
                        url.searchParams.set('search', query);
                    } else {
                        url.searchParams.delete('search');
                    }
                    window.location.href = url.toString();
                }
            });
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                const url = new URL(window.location);
                url.searchParams.delete('search');
                window.location.href = url.toString();
            });
        }
    }
}

// Фильтрация рецептов
window.filterRecipes = function(event, category) {
    const categoryMap = {
        'breakfast': 'Завтрак',
        'soup': 'Суп',
        'main': 'Основное блюдо',
        'salad': 'Салат',
        'baking': 'Выпечка',
        'dessert': 'Десерт'
    };
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    currentFilterCategory = category;
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearchQuery = urlParams.get('search') || '';
    
    let filtered = window._allRecipes || [];
    
    if (category !== 'all') {
        filtered = filtered.filter(r => r.category === categoryMap[category]);
    }
    
    if (urlSearchQuery) {
        filtered = filtered.filter(recipe =>
            recipe.name.toLowerCase().includes(urlSearchQuery.toLowerCase()) ||
            recipe.category.toLowerCase().includes(urlSearchQuery.toLowerCase())
        );
    }
    
    currentRecipes = filtered;
    renderRecipesPage();
};

// Просмотр детального рецепта
window.viewRecipe = function(id) {
    const recipe = getRecipeById(id);
    if (!recipe) return;
    
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="results-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <button class="back-btn" onclick="renderRecipesPage()" style="background: #f1f5f9; border: none; padding: 8px 15px; border-radius: 30px; cursor: pointer;">
                ← К рецептам
            </button>
        </div>
        
        <div class="recipe-detail" style="padding: 20px 0;">
            <div style="font-size: 5em; text-align: center; margin: 20px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 120px; height: 120px; border-radius: 60px; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: white;">
                ${recipe.emoji || '🍽️'}
            </div>
            
            <h1 style="font-size: 24px; margin: 20px 0; text-align: center;">${recipe.name}</h1>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0; justify-content: center;">
                <span class="filter-chip" style="background: #667eea; color: white; padding: 5px 10px;">⏱️ ${recipe.time}</span>
                <span class="filter-chip" style="background: #667eea; color: white; padding: 5px 10px;">👥 ${recipe.servings} порции</span>
                <span class="filter-chip" style="background: #667eea; color: white; padding: 5px 10px;">🔥 ${recipe.calories} ккал</span>
                <span class="filter-chip" style="background: #667eea; color: white; padding: 5px 10px;">📊 ${recipe.difficulty}</span>
            </div>
            
            <div class="ingredients-list">
                <h3>📝 Ингредиенты:</h3>
                <ul>
                    ${recipe.ingredients.map(i => `
                        <li>
                            <span>${i.name}</span>
                            <span class="amount">${i.amount}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <div class="instructions">
                    <h3>👨‍🍳 Приготовление:</h3>
                    <ol>
                        ${recipe.instructions.map((step, index) => `
                            <li>
                                <span class="step-number">${index + 1}</span>
                                ${step}
                            </li>
                        `).join('')}
                    </ol>
                </div>
            </div>
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
        <button class="footer-btn danger" id="resetBtn" ${selectedProducts.size === 0 ? 'disabled' : ''}>
            🗑️ Сброс
        </button>
    `;
    
    countElement.textContent = `Выбрано продуктов: ${selectedProducts.size}`;
    
    document.getElementById('findRecipesBtn')?.addEventListener('click', () => {
        showRecipesPage();
    });
    
    document.getElementById('allRecipesBtn')?.addEventListener('click', () => {
        showAllRecipesPage();
    });
    
    document.getElementById('resetBtn')?.addEventListener('click', () => {
        selectedProducts.clear();
        saveSelectedProducts();
        showProductsPage();
        returnFooterAfterSearch();
    });
}

// Обработка фокуса поиска
window.handleSearchFocus = function(focused) {
    const footerBar = document.querySelector('.footer-bar');
    
    if (focused) {
        if (footerBar) {
            footerBar.style.transform = 'translateY(100%)';
            footerBar.style.opacity = '0';
            footerBar.style.pointerEvents = 'none';
        }
        document.body.classList.add('search-mode');
    } else {
        if (footerBar) {
            footerBar.style.transform = 'translateY(0)';
            footerBar.style.opacity = '1';
            footerBar.style.pointerEvents = 'auto';
        }
        document.body.classList.remove('search-mode');
    }
    
    isSearchFocused = focused;
};

// Возвращение футера после выбора продукта
function returnFooterAfterSearch() {
    const footerBar = document.querySelector('.footer-bar');
    if (footerBar && isSearchFocused) {
        handleSearchFocus(false);
    }
}

// Переключение продукта
window.toggleProduct = function(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    
    saveSelectedProducts();
    
    const productEl = document.querySelector(`.product-item[data-id="${productId}"]`);
    if (productEl) {
        if (selectedProducts.has(productId)) {
            productEl.classList.add('selected');
        } else {
            productEl.classList.remove('selected');
        }
    }
    
    updateAllCounters();
    updateButtonsState();
    returnFooterAfterSearch();
};

// Обновление счетчиков
function updateAllCounters() {
    const statsCounter = document.querySelector('.stats-bar span:last-child');
    if (statsCounter) {
        statsCounter.textContent = `✅ Выбрано: ${selectedProducts.size}`;
    }
    
    const footerCounter = document.getElementById('selectedCount');
    if (footerCounter) {
        footerCounter.textContent = `Выбрано продуктов: ${selectedProducts.size}`;
    }
}

// Обновление состояния кнопок
function updateButtonsState() {
    const findBtn = document.getElementById('findRecipesBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (findBtn) {
        findBtn.disabled = selectedProducts.size === 0;
    }
    if (resetBtn) {
        resetBtn.disabled = selectedProducts.size === 0;
    }
}

// Обработчики для страницы продуктов
function attachProductsEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchQuery = searchInput.value;
                showProductsPage();
                searchInput.blur();
            }
        });
    }
    
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchQuery = '';
            showProductsPage();
        });
    }
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.category;
            showProductsPage();
        });
    });
}

// Стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Определяем страницу
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('recipes.html')) {
        loadSelectedProducts();
        
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('all')) {
            currentPage = 'recipes';
            currentFilterCategory = 'all';
            
            currentRecipes = getAllRecipes().map(recipe => ({
                ...recipe,
                matchPercentage: 100,
                missingIngredients: []
            }));
            
            window._allRecipes = [...currentRecipes];
            
            const urlSearchQuery = urlParams.get('search') || '';
            if (urlSearchQuery) {
                currentRecipes = currentRecipes.filter(recipe =>
                    recipe.name.toLowerCase().includes(urlSearchQuery.toLowerCase()) ||
                    recipe.category.toLowerCase().includes(urlSearchQuery.toLowerCase())
                );
            }
            
            renderRecipesPage();
        } else if (urlParams.has('ingredients')) {
            const ingredients = urlParams.get('ingredients').split(',');
            currentRecipes = findRecipesByIngredients(ingredients);
            window._allRecipes = [...currentRecipes];
            renderRecipesPage();
        }
    } else {
        loadSelectedProducts();
        showProductsPage();
        
        window.addEventListener('resize', () => {
            if (!isSearchFocused) {
                updateFooterVisibility();
            }
        });
    }
});

// Глобальные функции
window.showProductsPage = showProductsPage;
window.showRecipesPage = showRecipesPage;
window.showAllRecipesPage = showAllRecipesPage;
window.handleSearchFocus = handleSearchFocus;
window.toggleProduct = toggleProduct;
window.filterRecipes = filterRecipes;
window.viewRecipe = viewRecipe;

injectDarkThemeStyles();
applyTheme();