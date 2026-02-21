// webapp/js/recipes-page.js

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Получаем данные из бота (выбранные продукты)
let userIngredients = [];

try {
    // Данные приходят из initData или из URL
    const initData = tg.initData || '';
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('ingredients')) {
        userIngredients = urlParams.get('ingredients').split(',');
    } else if (tg.initDataUnsafe?.start_param) {
        userIngredients = tg.initDataUnsafe.start_param.split(',');
    }
} catch (e) {
    console.log('Ошибка получения данных:', e);
    // Для тестирования используем тестовые данные
    userIngredients = ['яйца', 'молоко', 'сыр'];
}

// Обновляем информацию о выбранных продуктах
const selectedInfo = document.getElementById('selectedIngredients');
if (selectedInfo) {
    selectedInfo.textContent = `📦 ${userIngredients.length} продуктов`;
}

// Состояние страницы
let currentFilter = 'all';
let allRecipes = [];

// Функция загрузки рецептов
function loadRecipes() {
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');
    const recipesGrid = document.getElementById('recipesGrid');
    
    if (loading) loading.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    
    // Ищем рецепты
    setTimeout(() => {
        allRecipes = findRecipesByIngredients(userIngredients);
        
        if (loading) loading.style.display = 'none';
        
        if (allRecipes.length > 0) {
            displayRecipes(allRecipes);
            updateResultsInfo();
        } else {
            if (noResults) noResults.style.display = 'block';
            if (recipesGrid) recipesGrid.innerHTML = '';
        }
    }, 500); // Небольшая задержка для имитации загрузки
}

// Функция отображения рецептов
function displayRecipes(recipes) {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;
    
    if (recipes.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Нет рецептов по выбранному фильтру</p>';
        return;
    }
    
    grid.innerHTML = recipes.map(recipe => {
        // Определяем цвет бейджа в зависимости от процента совпадения
        let badgeColor = '#ef4444';
        if (recipe.matchPercentage >= 80) badgeColor = '#22c55e';
        else if (recipe.matchPercentage >= 50) badgeColor = '#eab308';
        
        return `
            <div class="recipe-card fade-in" onclick="viewRecipe(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <span class="recipe-category">${recipe.category}</span>
                    <div class="recipe-ingredients">
                        <strong>Нужно:</strong> ${recipe.ingredients.map(i => i.name).join(', ')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span class="match-badge" style="background: ${badgeColor}">
                            Совпадение: ${recipe.matchPercentage}%
                        </span>
                        <span>⏱️ ${recipe.time}</span>
                    </div>
                    ${recipe.missingIngredients.length > 0 ? 
                        `<p style="color: #ef4444; font-size: 0.85em; margin-top: 10px;">
                            ❌ Нет: ${recipe.missingIngredients.slice(0, 3).join(', ')}
                            ${recipe.missingIngredients.length > 3 ? '...' : ''}
                        </p>` : 
                        '<p style="color: #22c55e; font-size: 0.85em; margin-top: 10px;">✅ Все продукты есть!</p>'
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Функция обновления информации о результатах
function updateResultsInfo() {
    const info = document.getElementById('resultsInfo');
    if (!info) return;
    
    const total = allRecipes.length;
    const perfectMatches = allRecipes.filter(r => r.missingIngredients.length === 0).length;
    
    info.textContent = `Найдено ${total} рецептов. Из них ${perfectMatches} идеально подходят!`;
}

// Функция просмотра детального рецепта
window.viewRecipe = function(recipeId) {
    // Сохраняем ID рецепта и переходим на детальную страницу
    sessionStorage.setItem('currentRecipeId', recipeId);
    window.location.href = `recipe-detail.html?id=${recipeId}`;
};

// Фильтрация рецептов
function filterRecipes(filter) {
    currentFilter = filter;
    
    let filtered = [...allRecipes];
    
    switch(filter) {
        case 'highMatch':
            filtered = filtered.filter(r => r.matchPercentage >= 70);
            break;
        case 'breakfast':
            filtered = filtered.filter(r => r.category === 'Завтрак');
            break;
        case 'soup':
            filtered = filtered.filter(r => r.category === 'Суп');
            break;
        case 'main':
            filtered = filtered.filter(r => r.category === 'Основное блюдо');
            break;
        case 'salad':
            filtered = filtered.filter(r => r.category === 'Салат');
            break;
        default:
            // all - без фильтрации
            break;
    }
    
    displayRecipes(filtered);
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    
    // Обработчики фильтров
    const filterBtns = document.querySelectorAll('[data-filter]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterRecipes(e.target.dataset.filter);
        });
    });
});

// Настраиваем главную кнопку Telegram
tg.MainButton.setText('Выбрать другие продукты');
tg.MainButton.onClick(() => {
    window.location.href = 'index.html';
});
tg.MainButton.show();