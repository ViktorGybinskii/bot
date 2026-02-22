// webapp/js/recipes-page.js

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let userIngredients = [];
let showAllRecipes = false;
let currentFilter = 'all';
let currentDifficulty = 'all';
let allRecipes = [];

try {
    const urlParams = new URLSearchParams(window.location.search);
    showAllRecipes = urlParams.has('all');
    
    if (showAllRecipes) {
        // Показываем все рецепты
        allRecipes = recipesDatabase.map(recipe => ({
            ...recipe,
            matchPercentage: 100,
            missingIngredients: []
        }));
        document.getElementById('resultsInfo').textContent = `📚 Все рецепты (${allRecipes.length} шт.)`;
        document.getElementById('selectedIngredients').textContent = `📚 Все рецепты`;
    } else if (urlParams.has('ingredients')) {
        userIngredients = urlParams.get('ingredients').split(',');
        allRecipes = findRecipesByIngredients(userIngredients);
        document.getElementById('selectedIngredients').textContent = `📦 ${userIngredients.length} продуктов`;
    } else if (urlParams.has('search')) {
        const query = urlParams.get('search');
        allRecipes = searchRecipesByName(query);
        document.getElementById('resultsInfo').textContent = `🔍 Результаты поиска: "${query}" (${allRecipes.length})`;
        document.getElementById('selectedIngredients').textContent = `🔍 Поиск`;
    }
} catch (e) {
    console.log('Ошибка:', e);
    showAllRecipes = true;
    allRecipes = recipesDatabase.map(recipe => ({
        ...recipe,
        matchPercentage: 100,
        missingIngredients: []
    }));
}

// Функция отображения рецептов
function displayRecipes(recipes) {
    const grid = document.getElementById('recipesGrid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');
    
    if (loading) loading.style.display = 'none';
    
    if (!grid) return;
    
    if (recipes.length === 0) {
        if (noResults) noResults.style.display = 'block';
        grid.innerHTML = '';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    grid.innerHTML = recipes.map(recipe => {
        let badgeColor = '#ef4444';
        if (recipe.matchPercentage >= 80) badgeColor = '#22c55e';
        else if (recipe.matchPercentage >= 50) badgeColor = '#eab308';
        
        return `
            <div class="recipe-card fade-in" onclick="viewRecipe(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" 
                     onerror="this.src='https://via.placeholder.com/400x200/667eea/ffffff?text=${encodeURIComponent(recipe.name)}'">
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <span class="recipe-category">${recipe.category} · ${recipe.cuisine}</span>
                    <div class="recipe-ingredients">
                        <strong>⏱️ ${recipe.time}</strong> · ${recipe.calories} ккал
                    </div>
                    ${!showAllRecipes ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span class="match-badge" style="background: ${badgeColor}">
                                Совпадение: ${recipe.matchPercentage}%
                            </span>
                        </div>
                        ${recipe.missingIngredients && recipe.missingIngredients.length > 0 ? 
                            `<p style="color: #ef4444; font-size: 0.85em; margin-top: 10px;">
                                ❌ Нет: ${recipe.missingIngredients.slice(0, 3).join(', ')}
                                ${recipe.missingIngredients.length > 3 ? '...' : ''}
                            </p>` : 
                            recipe.missingIngredients && recipe.missingIngredients.length === 0 ?
                            '<p style="color: #22c55e; font-size: 0.85em; margin-top: 10px;">✅ Все продукты есть!</p>' : ''
                        }
                    ` : `
                        <div style="margin-top: 10px; color: #64748b;">
                            ${recipe.ingredients.slice(0, 5).map(i => i.name).join(', ')}...
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

window.viewRecipe = function(recipeId) {
    sessionStorage.setItem('currentRecipeId', recipeId);
    window.location.href = `recipe-detail.html?id=${recipeId}`;
};

function filterRecipes() {
    let filtered = [...allRecipes];
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => r.category === currentCategory);
    }
    
    if (currentDifficulty !== 'all') {
        filtered = filtered.filter(r => r.difficulty === currentDifficulty);
    }
    
    displayRecipes(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    displayRecipes(allRecipes);
    
    const filterBtns = document.querySelectorAll('[data-category]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterRecipes();
        });
    });
    
    const difficultyBtns = document.querySelectorAll('[data-difficulty]');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDifficulty = e.target.dataset.difficulty;
            filterRecipes();
        });
    });
});

tg.MainButton.setText('Выбрать продукты');
tg.MainButton.onClick(() => {
    window.location.href = 'index.html';
});
tg.MainButton.show();