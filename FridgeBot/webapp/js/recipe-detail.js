// webapp/js/recipe-detail.js

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Получаем ID рецепта из URL или sessionStorage
function getRecipeId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || sessionStorage.getItem('currentRecipeId');
}

// Загружаем детальную информацию о рецепте
function loadRecipeDetail() {
    const recipeId = parseInt(getRecipeId());
    const recipe = recipesDatabase.find(r => r.id === recipeId);
    
    if (!recipe) {
        window.location.href = 'recipes.html';
        return;
    }
    
    displayRecipeDetail(recipe);
}

// Отображаем детальную информацию
function displayRecipeDetail(recipe) {
    const container = document.getElementById('recipeDetail');
    if (!container) return;
    
    container.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-detail-image">
        
        <div class="recipe-detail-content">
            <h1 class="recipe-detail-title">${recipe.name}</h1>
            
            <div class="recipe-meta">
                <span class="meta-item">⏱️ ${recipe.time}</span>
                <span class="meta-item">👥 ${recipe.servings} порции</span>
                <span class="meta-item">🏷️ ${recipe.category}</span>
                <span class="meta-item">🌍 ${recipe.cuisine}</span>
            </div>
            
            <div class="ingredients-list">
                <h3>📝 Ингредиенты:</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `
                        <li>
                            <span>•</span>
                            <span><strong>${ing.name}</strong> - ${ing.amount}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="instructions">
                <h3>👨‍🍳 Приготовление:</h3>
                <ol style="list-style-position: inside;">
                    ${recipe.instructions.map(step => `<li style="margin-bottom: 10px;">${step}</li>`).join('')}
                </ol>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button class="send-btn" onclick="window.print()" style="flex: 1; background: #64748b;">
                    🖨️ Распечатать
                </button>
                <button class="send-btn" onclick="shareRecipe(${recipe.id})" style="flex: 1; background: #22c55e;">
                    📤 Поделиться
                </button>
            </div>
        </div>
    `;
}

// Функция поделиться рецептом
window.shareRecipe = function(recipeId) {
    const recipe = recipesDatabase.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const shareText = `🍳 Рецепт: ${recipe.name}\n\n⏱️ Время: ${recipe.time}\n👥 Порций: ${recipe.servings}\n\nИнгредиенты:\n${recipe.ingredients.map(i => `- ${i.name}: ${i.amount}`).join('\n')}`;
    
    // Пробуем использовать Web Share API
    if (navigator.share) {
        navigator.share({
            title: recipe.name,
            text: shareText,
            url: window.location.href
        }).catch(() => {
            // Если не получилось, копируем в буфер обмена
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
};

// Копирование в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Рецепт скопирован в буфер обмена!', 'success');
    }).catch(() => {
        showNotification('Не удалось скопировать', 'error');
    });
}

// Показать уведомление
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Загружаем рецепт при загрузке страницы
document.addEventListener('DOMContentLoaded', loadRecipeDetail);

// Настраиваем главную кнопку Telegram
tg.MainButton.setText('← К рецептам');
tg.MainButton.onClick(() => {
    window.location.href = 'recipes.html';
});
tg.MainButton.show();