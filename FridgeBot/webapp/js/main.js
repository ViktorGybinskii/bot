// webapp/js/main.js

// База данных продуктов с категориями и иконками
const productsDatabase = [
    // Овощи
    { id: 'tomato', name: 'Помидоры', category: 'vegetables', icon: '🍅' },
    { id: 'cucumber', name: 'Огурцы', category: 'vegetables', icon: '🥒' },
    { id: 'potato', name: 'Картофель', category: 'vegetables', icon: '🥔' },
    { id: 'carrot', name: 'Морковь', category: 'vegetables', icon: '🥕' },
    { id: 'onion', name: 'Лук', category: 'vegetables', icon: '🧅' },
    { id: 'garlic', name: 'Чеснок', category: 'vegetables', icon: '🧄' },
    { id: 'cabbage', name: 'Капуста', category: 'vegetables', icon: '🥬' },
    { id: 'bell-pepper', name: 'Перец', category: 'vegetables', icon: '🫑' },
    { id: 'broccoli', name: 'Брокколи', category: 'vegetables', icon: '🥦' },
    
    // Молочные
    { id: 'milk', name: 'Молоко', category: 'dairy', icon: '🥛' },
    { id: 'cheese', name: 'Сыр', category: 'dairy', icon: '🧀' },
    { id: 'butter', name: 'Масло', category: 'dairy', icon: '🧈' },
    { id: 'yogurt', name: 'Йогурт', category: 'dairy', icon: '🥛' },
    { id: 'eggs', name: 'Яйца', category: 'dairy', icon: '🥚' },
    
    // Мясо
    { id: 'chicken', name: 'Курица', category: 'meat', icon: '🍗' },
    { id: 'beef', name: 'Говядина', category: 'meat', icon: '🥩' },
    { id: 'pork', name: 'Свинина', category: 'meat', icon: '🥩' },
    { id: 'fish', name: 'Рыба', category: 'meat', icon: '🐟' },
    { id: 'sausage', name: 'Колбаса', category: 'meat', icon: '🌭' },
    
    // Фрукты
    { id: 'apple', name: 'Яблоки', category: 'fruits', icon: '🍎' },
    { id: 'banana', name: 'Бананы', category: 'fruits', icon: '🍌' },
    { id: 'lemon', name: 'Лимоны', category: 'fruits', icon: '🍋' },
    { id: 'orange', name: 'Апельсины', category: 'fruits', icon: '🍊' },
    
    // Другое
    { id: 'bread', name: 'Хлеб', category: 'other', icon: '🍞' },
    { id: 'pasta', name: 'Макароны', category: 'other', icon: '🍝' },
    { id: 'rice', name: 'Рис', category: 'other', icon: '🍚' },
    { id: 'salt', name: 'Соль', category: 'other', icon: '🧂' },
    { id: 'sugar', name: 'Сахар', category: 'other', icon: '🧁' },
    { id: 'oil', name: 'Масло растит.', category: 'other', icon: '🫒' },
    { id: 'flour', name: 'Мука', category: 'other', icon: '🥨' }
];

// Состояние приложения
let selectedProducts = new Set();
let currentCategory = 'all';

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand(); // Растягиваем на весь экран

// Функция отображения продуктов
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Фильтруем продукты по категории
    let filteredProducts = productsDatabase;
    if (currentCategory !== 'all') {
        filteredProducts = productsDatabase.filter(p => p.category === currentCategory);
    }
    
    // Отрисовываем продукты
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-item ${selectedProducts.has(product.id) ? 'selected' : ''}" 
             data-id="${product.id}"
             onclick="toggleProduct('${product.id}')">
            <span class="product-icon">${product.icon}</span>
            <span class="product-name">${product.name}</span>
        </div>
    `).join('');
    
    // Обновляем счетчик
    updateSelectedCount();
}

// Функция переключения выбора продукта
window.toggleProduct = function(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    
    // Обновляем отображение
    renderProducts();
    
    // Обновляем состояние кнопки
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

// Функция отправки данных в бота
function sendData() {
    if (selectedProducts.size === 0) return;
    
    // Получаем названия выбранных продуктов
    const selectedNames = Array.from(selectedProducts)
        .map(id => {
            const product = productsDatabase.find(p => p.id === id);
            return product ? product.name : id;
        });
    
    // Отправляем данные в Telegram
    tg.sendData(selectedNames.join(','));
    
    // Показываем уведомление
    showNotification('Ищем рецепты...', 'success');
    
    // Закрываем Web App через небольшую задержку
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
    // Первоначальная отрисовка
    renderProducts();
    
    // Обработчик кнопки отправки
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendData);
    }
    
    // Обработчики категорий
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Убираем активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            e.target.classList.add('active');
            // Меняем категорию
            currentCategory = e.target.dataset.category;
            // Перерисовываем продукты
            renderProducts();
        });
    });
    
    // Настраиваем главную кнопку Telegram (на всякий случай)
    tg.MainButton.setText('Найти рецепты');
    tg.MainButton.onClick(sendData);
    
    // Показываем или скрываем главную кнопку в зависимости от выбора
    tg.onEvent('mainButtonClicked', sendData);
});

// Сохраняем функцию в глобальную область для доступа из HTML
window.sendData = sendData;