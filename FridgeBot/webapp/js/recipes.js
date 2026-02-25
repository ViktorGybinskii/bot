// webapp/js/recipes.js

// Получение всех рецептов с пагинацией
window.getAllRecipes = function(page = 1, limit = 50) {
    const allRecipes = window.recipesDatabase || [];
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
        recipes: allRecipes.slice(start, end).map(r => ({
            ...r,
            matchPercentage: 100,
            missingIngredients: []
        })),
        total: allRecipes.length,
        currentPage: page,
        totalPages: Math.ceil(allRecipes.length / limit)
    };
};

// Поиск по ингредиентам (оптимизированный)
window.findRecipesByIngredients = function(ingredients) {
    const allRecipes = window.recipesDatabase || [];
    const ingredientsLower = ingredients.map(i => i.toLowerCase());
    
    return allRecipes.map(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
        const matched = recipeIngredients.filter(ri =>
            ingredientsLower.some(ui => ri.includes(ui) || ui.includes(ri))
        );
        
        return {
            ...recipe,
            matchPercentage: Math.round((matched.length / recipeIngredients.length) * 100),
            missingIngredients: recipeIngredients.filter(ri =>
                !ingredientsLower.some(ui => ri.includes(ui) || ui.includes(ri))
            )
        };
    })
    .filter(r => r.matchPercentage >= 30)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 50);
};

// Получение рецепта по ID
window.getRecipeById = function(id) {
    const allRecipes = window.recipesDatabase || [];
    return allRecipes.find(r => r.id === id);
};