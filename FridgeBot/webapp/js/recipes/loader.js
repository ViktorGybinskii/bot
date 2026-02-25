// webapp/js/recipes/loader.js
window.recipesDatabase = [];

function loadAllRecipes() {
    window.recipesDatabase = [];
    let totalCount = 0;
    
    // Проверяем и добавляем каждую категорию
    if (window.recipesMainDishes) {
        window.recipesDatabase.push(...window.recipesMainDishes);
        console.log(`🍖 Загружено основных блюд: ${window.recipesMainDishes.length}`);
        totalCount += window.recipesMainDishes.length;
    }
    
    if (window.recipesSalads) {
        window.recipesDatabase.push(...window.recipesSalads);
        console.log(`🥗 Загружено салатов: ${window.recipesSalads.length}`);
        totalCount += window.recipesSalads.length;
    }
    
    if (window.recipesSoups) {
        window.recipesDatabase.push(...window.recipesSoups);
        console.log(`🍲 Загружено супов: ${window.recipesSoups.length}`);
        totalCount += window.recipesSoups.length;
    }
    
    if (window.recipesBreakfast) {
        window.recipesDatabase.push(...window.recipesBreakfast);
        console.log(`🍳 Загружено завтраков: ${window.recipesBreakfast.length}`);
        totalCount += window.recipesBreakfast.length;
    }
    
    if (window.recipesBaking) {
        window.recipesDatabase.push(...window.recipesBaking);
        console.log(`🥐 Загружено выпечки: ${window.recipesBaking.length}`);
        totalCount += window.recipesBaking.length;
    }
    
    if (window.recipesDesserts) {
        window.recipesDatabase.push(...window.recipesDesserts);
        console.log(`🍰 Загружено десертов: ${window.recipesDesserts.length}`);
        totalCount += window.recipesDesserts.length;
    }
    
    console.log(`📊 ВСЕГО РЕЦЕПТОВ В БАЗЕ: ${totalCount}`);
    
    // Сохраняем в localStorage для быстрого доступа (опционально)
    try {
        localStorage.setItem('recipesCount', totalCount);
    } catch(e) {
        console.log('localStorage не доступен');
    }
}

// Загружаем рецепты после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllRecipes);
} else {
    loadAllRecipes();
}