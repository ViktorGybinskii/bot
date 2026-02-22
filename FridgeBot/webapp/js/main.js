// webapp/js/main.js

// База данных продуктов с категориями и уникальными иконками
const productsDatabase = [
    // Овощи (15 шт)
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
    
    // Зелень (8 шт)
    { id: 'dill', name: 'Укроп', category: 'herbs', icon: '🌿' },
    { id: 'parsley', name: 'Петрушка', category: 'herbs', icon: '🌿' },
    { id: 'cilantro', name: 'Кинза', category: 'herbs', icon: '🌱' },
    { id: 'basil', name: 'Базилик', category: 'herbs', icon: '🌱' },
    { id: 'green-onion', name: 'Зеленый лук', category: 'herbs', icon: '🧅' },
    { id: 'spinach', name: 'Шпинат', category: 'herbs', icon: '🍃' },
    { id: 'lettuce', name: 'Салат', category: 'herbs', icon: '🥬' },
    { id: 'arugula', name: 'Руккола', category: 'herbs', icon: '🌱' },
    
    // Фрукты (12 шт)
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
    
    // Молочные (10 шт)
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
    
    // Мясо (12 шт)
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
    
    // Рыба и морепродукты (8 шт)
    { id: 'fish', name: 'Рыба (филе)', category: 'seafood', icon: '🐟' },
    { id: 'salmon', name: 'Семга/Лосось', category: 'seafood', icon: '🐠' },
    { id: 'shrimp', name: 'Креветки', category: 'seafood', icon: '🦐' },
    { id: 'squid', name: 'Кальмары', category: 'seafood', icon: '🦑' },
    { id: 'mussels', name: 'Мидии', category: 'seafood', icon: '🦪' },
    { id: 'crab', name: 'Краб', category: 'seafood', icon: '🦀' },
    { id: 'tuna', name: 'Тунец', category: 'seafood', icon: '🐟' },
    { id: 'canned-fish', name: 'Рыбные консервы', category: 'seafood', icon: '🥫' },
    
    // Бакалея (15 шт)
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
    
    // Консервы (5 шт)
    { id: 'peas', name: 'Горошек консервированный', category: 'canned', icon: '🥫' },
    { id: 'corn-canned', name: 'Кукуруза консервированная', category: 'canned', icon: '🥫' },
    { id: 'beans', name: 'Фасоль консервированная', category: 'canned', icon: '🥫' },
    { id: 'olives', name: 'Оливки', category: 'canned', icon: '🫒' },
    { id: 'pickles', name: 'Огурцы соленые', category: 'canned', icon: '🥒' },
    
    // Специи (8 шт)
    { id: 'pepper', name: 'Перец черный', category: 'spices', icon: '🫑' },
    { id: 'paprika', name: 'Паприка', category: 'spices', icon: '🫑' },
    { id: 'cinnamon', name: 'Корица', category: 'spices', icon: '🥨' },
    { id: 'vanilla', name: 'Ваниль', category: 'spices', icon: '🍨' },
    { id: 'bay-leaf', name: 'Лавровый лист', category: 'spices', icon: '🌿' },
    { id: 'turmeric', name: 'Куркума', category: 'spices', icon: '🟡' },
    { id: 'ginger', name: 'Имбирь', category: 'spices', icon: '🫚' },
    { id: 'cumin', name: 'Зира', category: 'spices', icon: '🌾' }
];

// Состояние приложения
let selectedProducts = new Set();
let currentCategory = 'all';
let searchQuery = '';

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Функция отображения продуктов
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Фильтруем по категории и поисковому запросу
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
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
            <p>😕 Ничего не найдено</p>
            <p style="font-size: 14px;">Попробуйте изменить запрос</p>
        </div>`;
    } else {
        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-item ${selectedProducts.has(product.id) ? 'selected' : ''}" 
                 data-id="${product.id}"
                 onclick="toggleProduct('${product.id}')">
                <span class="product-icon">${product.icon}</span>
                <span class="product-name">${product.name}</span>
            </div>
        `).join('');
    }
    
    updateSelectedCount();
}

// Функция переключения выбора продукта
window.toggleProduct = function(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    
    renderProducts();
    updateSendButton();
};

// Функция обновления кнопки отправки
function updateSendButton() {
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.disabled = selectedProducts.size === 0;
    }
}

// Функция обновления счетчика
function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = `Выбрано продуктов: ${selectedProducts.size}`;
    }
}

// Функция поиска
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value;
    renderProducts();
}

// Функция отправки данных в бота
function sendData() {
    if (selectedProducts.size === 0) return;
    
    const selectedNames = Array.from(selectedProducts)
        .map(id => {
            const product = productsDatabase.find(p => p.id === id);
            return product ? product.name : id;
        });
    
    tg.sendData(selectedNames.join(','));
    showNotification('Ищем рецепты...', 'success');
    
    setTimeout(() => {
        tg.close();
    }, 500);
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Кнопка отправки
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendData);
    }
    
    // Кнопка "Все рецепты"
    const allRecipesBtn = document.getElementById('allRecipesBtn');
    if (allRecipesBtn) {
        allRecipesBtn.addEventListener('click', () => {
            window.location.href = 'recipes.html?all=true';
        });
    }
    
    // Кнопка "Сбросить выбор"
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            selectedProducts.clear();
            renderProducts();
            updateSendButton();
        });
    }
    
    // Категории
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderProducts();
        });
    });
    
    // Поиск (с задержкой)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(handleSearch, 300);
        });
    }
    
    // Кнопка очистки поиска
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                renderProducts();
            }
        });
    }
    
    tg.MainButton.setText('Найти рецепты');
    tg.MainButton.onClick(sendData);
});

window.sendData = sendData;