// webapp/js/main.js

// Состояние приложения
let currentPage = 'products';
let selectedProducts = new Set();
let currentCategory = 'all';
let searchQuery = '';
let currentRecipes = [];
let isSearchFocused = false;
let searchTimeout;

// Новые переменные для пагинации
let visibleProducts = [];
let currentPage_index = 0;
const PRODUCTS_PER_PAGE = 50;
let isLoading = false;
let hasMoreProducts = true;

// База данных продуктов (РАСШИРЕННАЯ - 300+ продуктов)
const productsDatabase = [
    // ============ ОВОЩИ (40 шт) ============
    // Базовые овощи
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
    
    // Капуста разная
    { id: 'red-cabbage', name: 'Капуста краснокочанная', category: 'vegetables', icon: '🟣' },
    { id: 'savoy-cabbage', name: 'Капуста савойская', category: 'vegetables', icon: '🥬' },
    { id: 'brussels-sprouts', name: 'Брюссельская капуста', category: 'vegetables', icon: '🥬' },
    { id: 'kohlrabi', name: 'Кольраби', category: 'vegetables', icon: '🟢' },
    { id: 'pak-choi', name: 'Пак-чой', category: 'vegetables', icon: '🥬' },
    { id: 'kale', name: 'Кале (кудрявая капуста)', category: 'vegetables', icon: '🥬' },
    
    // Лук разный
    { id: 'red-onion', name: 'Лук красный', category: 'vegetables', icon: '🧅' },
    { id: 'leek', name: 'Лук-порей', category: 'vegetables', icon: '🧅' },
    { id: 'shallot', name: 'Лук-шалот', category: 'vegetables', icon: '🧅' },
    { id: 'spring-onion', name: 'Лук зеленый', category: 'vegetables', icon: '🧅' },
    { id: 'chives', name: 'Шнитт-лук', category: 'vegetables', icon: '🌱' },
    
    // Перцы разные
    { id: 'chili', name: 'Перец чили', category: 'vegetables', icon: '🌶️' },
    { id: 'jalapeno', name: 'Халапеньо', category: 'vegetables', icon: '🌶️' },
    { id: 'habanero', name: 'Хабанеро', category: 'vegetables', icon: '🌶️' },
    { id: 'sweet-pepper', name: 'Перец сладкий', category: 'vegetables', icon: '🫑' },
    { id: 'yellow-pepper', name: 'Перец желтый', category: 'vegetables', icon: '🫑' },
    { id: 'orange-pepper', name: 'Перец оранжевый', category: 'vegetables', icon: '🫑' },
    
    // Тыквенные
    { id: 'squash', name: 'Патиссон', category: 'vegetables', icon: '🟡' },
    { id: 'acorn-squash', name: 'Тыква желудевая', category: 'vegetables', icon: '🎃' },
    { id: 'butternut', name: 'Тыква мускатная', category: 'vegetables', icon: '🎃' },
    { id: 'spaghetti-squash', name: 'Тыква спагетти', category: 'vegetables', icon: '🎃' },
    
    // Бобовые овощи
    { id: 'green-beans', name: 'Фасоль стручковая', category: 'vegetables', icon: '🫛' },
    { id: 'peas-fresh', name: 'Горошек зеленый', category: 'vegetables', icon: '🫛' },
    { id: 'asparagus', name: 'Спаржа', category: 'vegetables', icon: '🌱' },
    { id: 'okra', name: 'Окра (бамия)', category: 'vegetables', icon: '🫛' },
    
    // Корнеплоды
    { id: 'sweet-potato', name: 'Батат (сладкий картофель)', category: 'vegetables', icon: '🍠' },
    { id: 'jerusalem-artichoke', name: 'Топинамбур', category: 'vegetables', icon: '🥔' },
    { id: 'daikon', name: 'Дайкон', category: 'vegetables', icon: '🥕' },
    { id: 'radicchio', name: 'Радиккьо', category: 'vegetables', icon: '🟣' },
    { id: 'artichoke', name: 'Артишок', category: 'vegetables', icon: '🌿' },
    
    // ============ ЗЕЛЕНЬ (25 шт) ============
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
    
    // ============ ФРУКТЫ (40 шт) ============
    // Базовые фрукты
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
    
    // Яблоки разных сортов
    { id: 'apple-green', name: 'Яблоки зеленые', category: 'fruits', icon: '🍏' },
    { id: 'apple-red', name: 'Яблоки красные', category: 'fruits', icon: '🍎' },
    { id: 'apple-golden', name: 'Яблоки золотые', category: 'fruits', icon: '🍎' },
    { id: 'apple-granny', name: 'Яблоки Гренни Смит', category: 'fruits', icon: '🍏' },
    
    // Цитрусовые
    { id: 'lime', name: 'Лайм', category: 'fruits', icon: '🍈' },
    { id: 'grapefruit', name: 'Грейпфрут', category: 'fruits', icon: '🍊' },
    { id: 'tangerine', name: 'Мандарины', category: 'fruits', icon: '🍊' },
    { id: 'pomelo', name: 'Помело', category: 'fruits', icon: '🍊' },
    { id: 'clementine', name: 'Клементин', category: 'fruits', icon: '🍊' },
    
    // Ягоды
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
    
    // Экзотические фрукты
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
    { id: 'dates', name: 'Финики', category: 'fruits', icon: '🌴' },
    
    // ============ МОЛОЧНЫЕ ПРОДУКТЫ (25 шт) ============
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
    
    // Сыры
    { id: 'cheddar', name: 'Чеддер', category: 'dairy', icon: '🧀' },
    { id: 'gouda', name: 'Гауда', category: 'dairy', icon: '🧀' },
    { id: 'edam', name: 'Эдам', category: 'dairy', icon: '🧀' },
    { id: 'maasdam', name: 'Маасдам', category: 'dairy', icon: '🧀' },
    { id: 'emmental', name: 'Эмменталь', category: 'dairy', icon: '🧀' },
    { id: 'brie', name: 'Бри', category: 'dairy', icon: '🧀' },
    { id: 'camembert', name: 'Камамбер', category: 'dairy', icon: '🧀' },
    { id: 'blue-cheese', name: 'Сыр с плесенью', category: 'dairy', icon: '🧀' },
    { id: 'feta', name: 'Фета', category: 'dairy', icon: '🧀' },
    { id: 'ricotta', name: 'Рикотта', category: 'dairy', icon: '🧀' },
    { id: 'mascarpone', name: 'Маскарпоне', category: 'dairy', icon: '🧀' },
    { id: 'cream-cheese', name: 'Сливочный сыр', category: 'dairy', icon: '🧀' },
    
    // Кисломолочные
    { id: 'kefir', name: 'Кефир', category: 'dairy', icon: '🥛' },
    { id: 'ryazhenka', name: 'Ряженка', category: 'dairy', icon: '🥛' },
    { id: 'buttermilk', name: 'Пахта', category: 'dairy', icon: '🥛' },
    { id: 'curdled-milk', name: 'Простокваша', category: 'dairy', icon: '🥛' },
    { id: 'varenets', name: 'Варенец', category: 'dairy', icon: '🥛' },
    { id: 'ayran', name: 'Айран', category: 'dairy', icon: '🥛' },
    { id: 'tan', name: 'Тан', category: 'dairy', icon: '🥛' },
    { id: 'matsoni', name: 'Мацони', category: 'dairy', icon: '🥛' },
    
    // ============ МЯСО (35 шт) ============
    { id: 'chicken', name: 'Курица (филе)', category: 'meat', icon: '🍗' },
    { id: 'chicken-thigh', name: 'Курица (бедро)', category: 'meat', icon: '🍗' },
    { id: 'chicken-wing', name: 'Курица (крылья)', category: 'meat', icon: '🍗' },
    { id: 'chicken-drumstick', name: 'Курица (голень)', category: 'meat', icon: '🍗' },
    { id: 'chicken-breast', name: 'Куриная грудка', category: 'meat', icon: '🍗' },
    { id: 'chicken-liver', name: 'Куриная печень', category: 'meat', icon: '🍗' },
    { id: 'chicken-heart', name: 'Куриные сердца', category: 'meat', icon: '💓' },
    { id: 'chicken-stomach', name: 'Куриные желудки', category: 'meat', icon: '🍗' },
    
    { id: 'beef', name: 'Говядина', category: 'meat', icon: '🥩' },
    { id: 'beef-mince', name: 'Говяжий фарш', category: 'meat', icon: '🥩' },
    { id: 'beef-liver', name: 'Говяжья печень', category: 'meat', icon: '🥩' },
    { id: 'beef-tongue', name: 'Говяжий язык', category: 'meat', icon: '👅' },
    { id: 'beef-heart', name: 'Говяжье сердце', category: 'meat', icon: '💓' },
    { id: 'beef-kidney', name: 'Говяжьи почки', category: 'meat', icon: '🥩' },
    { id: 'steak', name: 'Стейк', category: 'meat', icon: '🥩' },
    { id: 'ribeye', name: 'Рибай', category: 'meat', icon: '🥩' },
    { id: 'tenderloin', name: 'Вырезка', category: 'meat', icon: '🥩' },
    
    { id: 'pork', name: 'Свинина', category: 'meat', icon: '🐷' },
    { id: 'pork-mince', name: 'Свиной фарш', category: 'meat', icon: '🐷' },
    { id: 'bacon', name: 'Бекон', category: 'meat', icon: '🥓' },
    { id: 'ham', name: 'Ветчина', category: 'meat', icon: '🍖' },
    { id: 'pork-ribs', name: 'Свиные ребра', category: 'meat', icon: '🍖' },
    { id: 'pork-loin', name: 'Свиная корейка', category: 'meat', icon: '🥩' },
    { id: 'pork-neck', name: 'Свиная шея', category: 'meat', icon: '🥩' },
    { id: 'pork-shank', name: 'Свиная рулька', category: 'meat', icon: '🍖' },
    { id: 'pork-ear', name: 'Свиные уши', category: 'meat', icon: '👂' },
    { id: 'pork-liver', name: 'Свиная печень', category: 'meat', icon: '🥩' },
    
    { id: 'lamb', name: 'Баранина', category: 'meat', icon: '🐑' },
    { id: 'lamb-shoulder', name: 'Баранина (лопатка)', category: 'meat', icon: '🐑' },
    { id: 'lamb-leg', name: 'Баранина (нога)', category: 'meat', icon: '🐑' },
    { id: 'lamb-ribs', name: 'Бараньи ребра', category: 'meat', icon: '🍖' },
    
    { id: 'duck', name: 'Утка', category: 'meat', icon: '🦆' },
    { id: 'duck-breast', name: 'Утиная грудка', category: 'meat', icon: '🦆' },
    { id: 'duck-leg', name: 'Утиная ножка', category: 'meat', icon: '🦆' },
    { id: 'turkey', name: 'Индейка', category: 'meat', icon: '🦃' },
    { id: 'turkey-breast', name: 'Индейка (грудка)', category: 'meat', icon: '🦃' },
    { id: 'turkey-mince', name: 'Фарш из индейки', category: 'meat', icon: '🦃' },
    { id: 'rabbit', name: 'Кролик', category: 'meat', icon: '🐇' },
    { id: 'quail', name: 'Перепелка', category: 'meat', icon: '🐦' },
    { id: 'goose', name: 'Гусь', category: 'meat', icon: '🦢' },
    { id: 'venison', name: 'Оленина', category: 'meat', icon: '🦌' },
    { id: 'horse-meat', name: 'Конина', category: 'meat', icon: '🐎' },
    
    // Колбасные изделия
    { id: 'sausage', name: 'Колбаса вареная', category: 'meat', icon: '🌭' },
    { id: 'smoked-sausage', name: 'Колбаса копченая', category: 'meat', icon: '🌭' },
    { id: 'salami', name: 'Салями', category: 'meat', icon: '🍖' },
    { id: 'cervelat', name: 'Сервелат', category: 'meat', icon: '🍖' },
    { id: 'doctor-sausage', name: 'Докторская колбаса', category: 'meat', icon: '🌭' },
    { id: 'wieners', name: 'Сосиски', category: 'meat', icon: '🌭' },
    { id: 'frankfurters', name: 'Сардельки', category: 'meat', icon: '🌭' },
    { id: 'bacon-slices', name: 'Бекон ломтиками', category: 'meat', icon: '🥓' },
    { id: 'pancetta', name: 'Панчетта', category: 'meat', icon: '🥓' },
    { id: 'prosciutto', name: 'Прошутто', category: 'meat', icon: '🍖' },
    
    // ============ РЫБА И МОРЕПРОДУКТЫ (30 шт) ============
    // Рыба
    { id: 'fish', name: 'Рыба (филе)', category: 'seafood', icon: '🐟' },
    { id: 'salmon', name: 'Семга/Лосось', category: 'seafood', icon: '🐠' },
    { id: 'trout', name: 'Форель', category: 'seafood', icon: '🐟' },
    { id: 'pink-salmon', name: 'Горбуша', category: 'seafood', icon: '🐟' },
    { id: 'chum-salmon', name: 'Кета', category: 'seafood', icon: '🐟' },
    { id: 'cod', name: 'Треска', category: 'seafood', icon: '🐟' },
    { id: 'pollock', name: 'Минтай', category: 'seafood', icon: '🐟' },
    { id: 'haddock', name: 'Пикша', category: 'seafood', icon: '🐟' },
    { id: 'halibut', name: 'Палтус', category: 'seafood', icon: '🐟' },
    { id: 'flounder', name: 'Камбала', category: 'seafood', icon: '🐟' },
    { id: 'tuna', name: 'Тунец', category: 'seafood', icon: '🐟' },
    { id: 'mackerel', name: 'Скумбрия', category: 'seafood', icon: '🐟' },
    { id: 'herring', name: 'Сельдь', category: 'seafood', icon: '🐟' },
    { id: 'sprats', name: 'Шпроты', category: 'seafood', icon: '🐟' },
    { id: 'carp', name: 'Карп', category: 'seafood', icon: '🐟' },
    { id: 'crucian-carp', name: 'Карась', category: 'seafood', icon: '🐟' },
    { id: 'pike', name: 'Щука', category: 'seafood', icon: '🐟' },
    { id: 'perch', name: 'Окунь', category: 'seafood', icon: '🐟' },
    { id: 'zander', name: 'Судак', category: 'seafood', icon: '🐟' },
    { id: 'catfish', name: 'Сом', category: 'seafood', icon: '🐟' },
    { id: 'eel', name: 'Угорь', category: 'seafood', icon: '🐍' },
    { id: 'red-fish', name: 'Красная рыба', category: 'seafood', icon: '🐠' },
    
    // Морепродукты
    { id: 'shrimp', name: 'Креветки', category: 'seafood', icon: '🦐' },
    { id: 'king-prawns', name: 'Королевские креветки', category: 'seafood', icon: '🦐' },
    { id: 'tiger-prawns', name: 'Тигровые креветки', category: 'seafood', icon: '🦐' },
    { id: 'squid', name: 'Кальмары', category: 'seafood', icon: '🦑' },
    { id: 'octopus', name: 'Осьминог', category: 'seafood', icon: '🐙' },
    { id: 'mussels', name: 'Мидии', category: 'seafood', icon: '🦪' },
    { id: 'oysters', name: 'Устрицы', category: 'seafood', icon: '🦪' },
    { id: 'scallops', name: 'Морские гребешки', category: 'seafood', icon: '🐚' },
    { id: 'crab', name: 'Краб', category: 'seafood', icon: '🦀' },
    { id: 'crab-sticks', name: 'Крабовые палочки', category: 'seafood', icon: '🦀' },
    { id: 'lobster', name: 'Лобстер', category: 'seafood', icon: '🦞' },
    { id: 'crayfish', name: 'Раки', category: 'seafood', icon: '🦞' },
    { id: 'sea-cocktail', name: 'Морской коктейль', category: 'seafood', icon: '🍤' },
    { id: 'caviar', name: 'Икра', category: 'seafood', icon: '🟠' },
    { id: 'red-caviar', name: 'Красная икра', category: 'seafood', icon: '🔴' },
    { id: 'black-caviar', name: 'Черная икра', category: 'seafood', icon: '⚫' },
    
    // ============ БАКАЛЕЯ (45 шт) ============
    { id: 'pasta', name: 'Макароны', category: 'groceries', icon: '🍝' },
    { id: 'spaghetti', name: 'Спагетти', category: 'groceries', icon: '🍝' },
    { id: 'penne', name: 'Пенне', category: 'groceries', icon: '🍝' },
    { id: 'fettuccine', name: 'Феттучини', category: 'groceries', icon: '🍝' },
    { id: 'lasagna', name: 'Лазанья (листы)', category: 'groceries', icon: '🍝' },
    { id: 'vermicelli', name: 'Вермишель', category: 'groceries', icon: '🍝' },
    { id: 'noodles', name: 'Лапша', category: 'groceries', icon: '🍜' },
    { id: 'rice-noodles', name: 'Рисовая лапша', category: 'groceries', icon: '🍜' },
    { id: 'soba', name: 'Гречневая лапша соба', category: 'groceries', icon: '🍜' },
    { id: 'udon', name: 'Лапша удон', category: 'groceries', icon: '🍜' },
    
    { id: 'rice', name: 'Рис', category: 'groceries', icon: '🍚' },
    { id: 'rice-round', name: 'Рис круглозерный', category: 'groceries', icon: '🍚' },
    { id: 'rice-long', name: 'Рис длиннозерный', category: 'groceries', icon: '🍚' },
    { id: 'rice-basmati', name: 'Рис басмати', category: 'groceries', icon: '🍚' },
    { id: 'rice-jasmine', name: 'Рис жасмин', category: 'groceries', icon: '🍚' },
    { id: 'rice-brown', name: 'Рис бурый', category: 'groceries', icon: '🍚' },
    { id: 'rice-wild', name: 'Рис дикий', category: 'groceries', icon: '🍚' },
    { id: 'rice-arborio', name: 'Рис арборио', category: 'groceries', icon: '🍚' },
    
    { id: 'buckwheat', name: 'Гречка', category: 'groceries', icon: '🌾' },
    { id: 'buckwheat-green', name: 'Гречка зеленая', category: 'groceries', icon: '🌾' },
    { id: 'millet', name: 'Пшено', category: 'groceries', icon: '🌾' },
    { id: 'barley', name: 'Перловка', category: 'groceries', icon: '🌾' },
    { id: 'oatmeal', name: 'Овсянка', category: 'groceries', icon: '🥣' },
    { id: 'oat-flakes', name: 'Овсяные хлопья', category: 'groceries', icon: '🥣' },
    { id: 'cereal', name: 'Хлопья кукурузные', category: 'groceries', icon: '🥣' },
    { id: 'muesli', name: 'Мюсли', category: 'groceries', icon: '🥣' },
    { id: 'granola', name: 'Гранола', category: 'groceries', icon: '🥣' },
    { id: 'semolina', name: 'Манка', category: 'groceries', icon: '🌾' },
    { id: 'couscous', name: 'Кускус', category: 'groceries', icon: '🌾' },
    { id: 'bulgur', name: 'Булгур', category: 'groceries', icon: '🌾' },
    { id: 'quinoa', name: 'Киноа', category: 'groceries', icon: '🌾' },
    { id: 'chickpeas', name: 'Нут', category: 'groceries', icon: '🫘' },
    { id: 'lentils', name: 'Чечевица', category: 'groceries', icon: '🫘' },
    { id: 'beans-dry', name: 'Фасоль сухая', category: 'groceries', icon: '🫘' },
    { id: 'peas-dry', name: 'Горох сухой', category: 'groceries', icon: '🫘' },
    
    { id: 'flour', name: 'Мука пшеничная', category: 'groceries', icon: '🫓' },
    { id: 'flour-rye', name: 'Мука ржаная', category: 'groceries', icon: '🫓' },
    { id: 'flour-corn', name: 'Мука кукурузная', category: 'groceries', icon: '🫓' },
    { id: 'flour-rice', name: 'Мука рисовая', category: 'groceries', icon: '🫓' },
    { id: 'flour-buckwheat', name: 'Мука гречневая', category: 'groceries', icon: '🫓' },
    { id: 'flour-almond', name: 'Мука миндальная', category: 'groceries', icon: '🫓' },
    { id: 'starch', name: 'Крахмал', category: 'groceries', icon: '⚪' },
    
    { id: 'sugar', name: 'Сахар', category: 'groceries', icon: '🧁' },
    { id: 'sugar-powder', name: 'Сахарная пудра', category: 'groceries', icon: '🧁' },
    { id: 'vanilla-sugar', name: 'Ванильный сахар', category: 'groceries', icon: '🧁' },
    { id: 'brown-sugar', name: 'Сахар коричневый', category: 'groceries', icon: '🧁' },
    { id: 'honey', name: 'Мед', category: 'groceries', icon: '🍯' },
    
    { id: 'salt', name: 'Соль', category: 'groceries', icon: '🧂' },
    { id: 'sea-salt', name: 'Соль морская', category: 'groceries', icon: '🧂' },
    { id: 'iodized-salt', name: 'Соль йодированная', category: 'groceries', icon: '🧂' },
    
    { id: 'oil', name: 'Масло растительное', category: 'groceries', icon: '🫒' },
    { id: 'olive-oil', name: 'Масло оливковое', category: 'groceries', icon: '🫒' },
    { id: 'sunflower-oil', name: 'Масло подсолнечное', category: 'groceries', icon: '🫒' },
    { id: 'corn-oil', name: 'Масло кукурузное', category: 'groceries', icon: '🫒' },
    { id: 'linseed-oil', name: 'Масло льняное', category: 'groceries', icon: '🫒' },
    { id: 'sesame-oil', name: 'Масло кунжутное', category: 'groceries', icon: '🫒' },
    { id: 'coconut-oil', name: 'Масло кокосовое', category: 'groceries', icon: '🥥' },
    
    { id: 'vinegar', name: 'Уксус', category: 'groceries', icon: '🍶' },
    { id: 'apple-vinegar', name: 'Уксус яблочный', category: 'groceries', icon: '🍶' },
    { id: 'balsamic-vinegar', name: 'Уксус бальзамический', category: 'groceries', icon: '🍶' },
    { id: 'wine-vinegar', name: 'Уксус винный', category: 'groceries', icon: '🍶' },
    { id: 'rice-vinegar', name: 'Уксус рисовый', category: 'groceries', icon: '🍶' },
    
    { id: 'soy-sauce', name: 'Соевый соус', category: 'groceries', icon: '🍶' },
    { id: 'teriyaki', name: 'Соус терияки', category: 'groceries', icon: '🍶' },
    { id: 'oyster-sauce', name: 'Устричный соус', category: 'groceries', icon: '🍶' },
    { id: 'fish-sauce', name: 'Рыбный соус', category: 'groceries', icon: '🍶' },
    { id: 'worcestershire', name: 'Соус Вустерширский', category: 'groceries', icon: '🍶' },
    { id: 'tabasco', name: 'Табаско', category: 'groceries', icon: '🌶️' },
    { id: 'ketchup', name: 'Кетчуп', category: 'groceries', icon: '🍅' },
    { id: 'mayonnaise', name: 'Майонез', category: 'groceries', icon: '🥫' },
    { id: 'mustard', name: 'Горчица', category: 'groceries', icon: '🟡' },
    { id: 'horseradish-sauce', name: 'Хрен', category: 'groceries', icon: '🌶️' },
    { id: 'adjika', name: 'Аджика', category: 'groceries', icon: '🔴' },
    { id: 'tkemali', name: 'Ткемали', category: 'groceries', icon: '🟢' },
    { id: 'pesto', name: 'Песто', category: 'groceries', icon: '🌿' },
    
    { id: 'breadcrumbs', name: 'Панировочные сухари', category: 'groceries', icon: '🥖' },
    { id: 'bread', name: 'Хлеб', category: 'groceries', icon: '🍞' },
    { id: 'white-bread', name: 'Хлеб белый', category: 'groceries', icon: '🍞' },
    { id: 'rye-bread', name: 'Хлеб ржаной', category: 'groceries', icon: '🍞' },
    { id: 'loaf', name: 'Батон', category: 'groceries', icon: '🥖' },
    { id: 'baguette', name: 'Багет', category: 'groceries', icon: '🥖' },
    { id: 'ciabatta', name: 'Чиабатта', category: 'groceries', icon: '🥖' },
    { id: 'pita', name: 'Пита', category: 'groceries', icon: '🫓' },
    { id: 'lavash', name: 'Лаваш', category: 'groceries', icon: '🫓' },
    { id: 'toast-bread', name: 'Хлеб для тостов', category: 'groceries', icon: '🍞' },
    { id: 'buns', name: 'Булочки', category: 'groceries', icon: '🥐' },
    { id: 'croissant', name: 'Круассан', category: 'groceries', icon: '🥐' },
    { id: 'bagel', name: 'Бейгл', category: 'groceries', icon: '🥯' },
    
    // ============ КОНСЕРВЫ (15 шт) ============
    { id: 'peas', name: 'Горошек консервированный', category: 'canned', icon: '🥫' },
    { id: 'corn-canned', name: 'Кукуруза консервированная', category: 'canned', icon: '🥫' },
    { id: 'beans-canned', name: 'Фасоль консервированная', category: 'canned', icon: '🥫' },
    { id: 'olives', name: 'Оливки', category: 'canned', icon: '🫒' },
    { id: 'black-olives', name: 'Маслины', category: 'canned', icon: '🫒' },
    { id: 'pickles', name: 'Огурцы соленые', category: 'canned', icon: '🥒' },
    { id: 'pickled-tomatoes', name: 'Помидоры соленые', category: 'canned', icon: '🍅' },
    { id: 'sauerkraut', name: 'Квашеная капуста', category: 'canned', icon: '🥬' },
    { id: 'lecho', name: 'Лечо', category: 'canned', icon: '🥫' },
    { id: 'canned-tomatoes', name: 'Помидоры консервированные', category: 'canned', icon: '🥫' },
    { id: 'tomato-paste', name: 'Томатная паста', category: 'canned', icon: '🥫' },
    { id: 'tomato-sauce', name: 'Томатный соус', category: 'canned', icon: '🥫' },
    { id: 'canned-fish', name: 'Рыбные консервы', category: 'canned', icon: '🥫' },
    { id: 'sprats-canned', name: 'Шпроты', category: 'canned', icon: '🥫' },
    { id: 'canned-tuna', name: 'Тунец консервированный', category: 'canned', icon: '🥫' },
    { id: 'canned-salmon', name: 'Лосось консервированный', category: 'canned', icon: '🥫' },
    { id: 'canned-sardines', name: 'Сардины', category: 'canned', icon: '🥫' },
    { id: 'canned-meat', name: 'Тушенка', category: 'canned', icon: '🥫' },
    { id: 'pate', name: 'Паштет', category: 'canned', icon: '🥫' },
    { id: 'canned-mushrooms', name: 'Грибы консервированные', category: 'canned', icon: '🥫' },
    { id: 'pickled-mushrooms', name: 'Грибы маринованные', category: 'canned', icon: '🍄' },
    { id: 'jam', name: 'Варенье', category: 'canned', icon: '🍯' },
    { id: 'preserves', name: 'Джем', category: 'canned', icon: '🍯' },
    { id: 'marmalade', name: 'Мармелад', category: 'canned', icon: '🍊' },
    { id: 'condensed-milk', name: 'Сгущенка', category: 'canned', icon: '🥛' },
    
    // ============ СПЕЦИИ И ПРИПРАВЫ (25 шт) ============
    { id: 'pepper-black', name: 'Перец черный молотый', category: 'spices', icon: '⚫' },
    { id: 'pepper-black-peas', name: 'Перец черный горошком', category: 'spices', icon: '⚫' },
    { id: 'pepper-white', name: 'Перец белый', category: 'spices', icon: '⚪' },
    { id: 'pepper-red', name: 'Перец красный', category: 'spices', icon: '🔴' },
    { id: 'paprika', name: 'Паприка', category: 'spices', icon: '🫑' },
    { id: 'cinnamon', name: 'Корица', category: 'spices', icon: '🥨' },
    { id: 'vanilla', name: 'Ваниль', category: 'spices', icon: '🍨' },
    { id: 'vanillin', name: 'Ванилин', category: 'spices', icon: '🍨' },
    { id: 'bay-leaf', name: 'Лавровый лист', category: 'spices', icon: '🌿' },
    { id: 'turmeric', name: 'Куркума', category: 'spices', icon: '🟡' },
    { id: 'ginger', name: 'Имбирь', category: 'spices', icon: '🫚' },
    { id: 'cumin', name: 'Зира (кумин)', category: 'spices', icon: '🌾' },
    { id: 'coriander', name: 'Кориандр', category: 'spices', icon: '🌿' },
    { id: 'coriander-seeds', name: 'Кориандр семена', category: 'spices', icon: '🌿' },
    { id: 'clove', name: 'Гвоздика', category: 'spices', icon: '🌸' },
    { id: 'nutmeg', name: 'Мускатный орех', category: 'spices', icon: '🥜' },
    { id: 'cardamom', name: 'Кардамон', category: 'spices', icon: '🟢' },
    { id: 'saffron', name: 'Шафран', category: 'spices', icon: '🔴' },
    { id: 'star-anise', name: 'Бадьян', category: 'spices', icon: '⭐' },
    { id: 'fennel-seeds', name: 'Семена фенхеля', category: 'spices', icon: '🌿' },
    { id: 'dill-seeds', name: 'Семена укропа', category: 'spices', icon: '🌿' },
    { id: 'caraway', name: 'Тмин', category: 'spices', icon: '🌾' },
    { id: 'sesame', name: 'Кунжут', category: 'spices', icon: '⚪' },
    { id: 'poppy', name: 'Мак', category: 'spices', icon: '⚫' },
    { id: 'mustard-seeds', name: 'Горчица зерна', category: 'spices', icon: '🟡' },
    { id: 'curry', name: 'Карри', category: 'spices', icon: '🟡' },
    { id: 'chili-flakes', name: 'Перец чили хлопья', category: 'spices', icon: '🌶️' },
    { id: 'italian-herbs', name: 'Итальянские травы', category: 'spices', icon: '🌿' },
    { id: 'provencal-herbs', name: 'Прованские травы', category: 'spices', icon: '🌿' },
    { id: 'hops-suneli', name: 'Хмели-сунели', category: 'spices', icon: '🌿' },
    { id: 'adjika-dry', name: 'Аджика сухая', category: 'spices', icon: '🔴' },
    { id: 'seasoning', name: 'Приправа универсальная', category: 'spices', icon: '🧂' },
    { id: 'chicken-seasoning', name: 'Приправа для курицы', category: 'spices', icon: '🍗' },
    { id: 'meat-seasoning', name: 'Приправа для мяса', category: 'spices', icon: '🥩' },
    { id: 'fish-seasoning', name: 'Приправа для рыбы', category: 'spices', icon: '🐟' },
    { id: 'potato-seasoning', name: 'Приправа для картофеля', category: 'spices', icon: '🥔' },
    
    // ============ ОРЕХИ И СУХОФРУКТЫ (15 шт) ============
    { id: 'walnuts', name: 'Грецкие орехи', category: 'nuts', icon: '🥜' },
    { id: 'almonds', name: 'Миндаль', category: 'nuts', icon: '🥜' },
    { id: 'hazelnuts', name: 'Фундук', category: 'nuts', icon: '🥜' },
    { id: 'cashews', name: 'Кешью', category: 'nuts', icon: '🥜' },
    { id: 'pistachios', name: 'Фисташки', category: 'nuts', icon: '🥜' },
    { id: 'peanuts', name: 'Арахис', category: 'nuts', icon: '🥜' },
    { id: 'pine-nuts', name: 'Кедровые орехи', category: 'nuts', icon: '🌲' },
    { id: 'pecans', name: 'Пекан', category: 'nuts', icon: '🥜' },
    { id: 'macadamia', name: 'Макадамия', category: 'nuts', icon: '🥜' },
    { id: 'chestnuts', name: 'Каштаны', category: 'nuts', icon: '🌰' },
    { id: 'coconut', name: 'Кокос', category: 'nuts', icon: '🥥' },
    { id: 'coconut-flakes', name: 'Кокосовая стружка', category: 'nuts', icon: '🥥' },
    
    { id: 'raisins', name: 'Изюм', category: 'nuts', icon: '🍇' },
    { id: 'prunes', name: 'Чернослив', category: 'nuts', icon: '🟣' },
    { id: 'dried-apricots', name: 'Курага', category: 'nuts', icon: '🟠' },
    { id: 'dried-figs', name: 'Инжир сушеный', category: 'nuts', icon: '🟣' },
    { id: 'dates-dried', name: 'Финики сушеные', category: 'nuts', icon: '🌴' },
    { id: 'dried-apples', name: 'Сушеные яблоки', category: 'nuts', icon: '🍎' },
    { id: 'dried-pears', name: 'Сушеные груши', category: 'nuts', icon: '🍐' },
    { id: 'dried-bananas', name: 'Сушеные бананы', category: 'nuts', icon: '🍌' },
    { id: 'candied-fruits', name: 'Цукаты', category: 'nuts', icon: '🍬' },
    
    // ============ ЗАМОРОЗКА (15 шт) ============
    { id: 'frozen-vegetables', name: 'Овощи замороженные', category: 'frozen', icon: '❄️' },
    { id: 'frozen-mixed', name: 'Овощная смесь', category: 'frozen', icon: '❄️' },
    { id: 'frozen-broccoli', name: 'Брокколи замороженная', category: 'frozen', icon: '🥦' },
    { id: 'frozen-cauliflower', name: 'Цветная капуста замороженная', category: 'frozen', icon: '🥦' },
    { id: 'frozen-spinach', name: 'Шпинат замороженный', category: 'frozen', icon: '🍃' },
    { id: 'frozen-peas', name: 'Горошек замороженный', category: 'frozen', icon: '🫛' },
    { id: 'frozen-corn', name: 'Кукуруза замороженная', category: 'frozen', icon: '🌽' },
    { id: 'frozen-beans', name: 'Фасоль стручковая замороженная', category: 'frozen', icon: '🫛' },
    
    { id: 'frozen-berries', name: 'Ягоды замороженные', category: 'frozen', icon: '❄️' },
    { id: 'frozen-strawberries', name: 'Клубника замороженная', category: 'frozen', icon: '🍓' },
    { id: 'frozen-raspberries', name: 'Малина замороженная', category: 'frozen', icon: '🍇' },
    { id: 'frozen-blueberries', name: 'Голубика замороженная', category: 'frozen', icon: '🫐' },
    { id: 'frozen-cherries', name: 'Вишня замороженная', category: 'frozen', icon: '🍒' },
    
    { id: 'frozen-fish', name: 'Рыба замороженная', category: 'frozen', icon: '🐟' },
    { id: 'frozen-shrimp', name: 'Креветки замороженные', category: 'frozen', icon: '🦐' },
    { id: 'frozen-squid', name: 'Кальмары замороженные', category: 'frozen', icon: '🦑' },
    { id: 'frozen-mussels', name: 'Мидии замороженные', category: 'frozen', icon: '🦪' },
    
    { id: 'frozen-dumplings', name: 'Пельмени замороженные', category: 'frozen', icon: '🥟' },
    { id: 'frozen-pelmeni', name: 'Пельмени', category: 'frozen', icon: '🥟' },
    { id: 'frozen-vareniki', name: 'Вареники', category: 'frozen', icon: '🥟' },
    { id: 'frozen-pizza', name: 'Пицца замороженная', category: 'frozen', icon: '🍕' },
    { id: 'frozen-fries', name: 'Картошка фри замороженная', category: 'frozen', icon: '🍟' },
    { id: 'frozen-dough', name: 'Тесто замороженное', category: 'frozen', icon: '🥐' }
];

// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.disableVerticalSwipes();

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
    currentPage = 'recipes';
    
    const selectedNames = Array.from(selectedProducts)
        .map(id => {
            const product = productsDatabase.find(p => p.id === id);
            return product ? product.name : id;
        });
    
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
    
    // Показываем индикатор загрузки
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    // Имитируем небольшую задержку для плавности
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
        
        // Добавляем новые продукты в DOM
        appendProductsToGrid(newProducts);
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        isLoading = false;
        
        // Если загрузили все продукты
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
        productEl.onclick = () => toggleProduct(product.id);
        productEl.innerHTML = `
            <span class="product-icon">${product.icon}</span>
            <span class="product-name">${product.name}</span>
        `;
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
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #64748b;">
            <span>📦 Всего продуктов: ${filteredProducts.length}</span>
            <span>✅ Выбрано: ${selectedProducts.size}</span>
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
        
        // Настраиваем Intersection Observer для бесконечного скролла
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
    
    let recipesHtml = `
        <div class="results-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <button class="back-btn" onclick="showProductsPage()" style="background: #f1f5f9; border: none; padding: 8px 15px; border-radius: 30px; cursor: pointer;">
                ← Назад
            </button>
            <span style="font-weight: 600; color: #475569;">Найдено: ${currentRecipes.length}</span>
        </div>
        
        <div class="filter-chips" style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin-bottom: 15px;">
            <span class="filter-chip active" onclick="filterRecipes(event, 'all')">Все</span>
            <span class="filter-chip" onclick="filterRecipes(event, 'breakfast')">Завтраки</span>
            <span class="filter-chip" onclick="filterRecipes(event, 'soup')">Супы</span>
            <span class="filter-chip" onclick="filterRecipes(event, 'main')">Основные</span>
            <span class="filter-chip" onclick="filterRecipes(event, 'salad')">Салаты</span>
            <span class="filter-chip" onclick="filterRecipes(event, 'baking')">Выпечка</span>
            <span class="filter-chip" onclick="filterRecipes(event, 'dessert')">Десерты</span>
        </div>
        
        <div class="recipes-grid">
    `;
    
    if (currentRecipes.length === 0) {
        recipesHtml += `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <span style="font-size: 48px;">😔</span>
                <p style="margin-top: 20px; font-size: 18px;">Рецептов не найдено</p>
                <p style="font-size: 14px; color: #64748b;">Попробуйте выбрать другие продукты</p>
                <button class="footer-btn primary" onclick="showProductsPage()" style="margin-top: 20px; width: auto; padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 30px;">
                    ← Выбрать продукты
                </button>
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
    event.target.classList.add('active');
    
    const filtered = category === 'all' 
        ? currentRecipes 
        : currentRecipes.filter(r => r.category === categoryMap[category]);
    
    const tempRecipes = currentRecipes;
    currentRecipes = filtered;
    renderRecipesPage();
    currentRecipes = tempRecipes;
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
            
            <div style="background: #f8fafc; border-radius: 20px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-bottom: 15px;">📝 Ингредиенты:</h3>
                <ul style="list-style: none; padding: 0;">
                    ${recipe.ingredients.map(i => `
                        <li style="padding: 10px; background: white; margin: 5px 0; border-radius: 10px; display: flex; justify-content: space-between;">
                            <span>${i.name}</span>
                            <span style="font-weight: 600; color: #667eea;">${i.amount}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h3 style="margin-bottom: 15px;">👨‍🍳 Приготовление:</h3>
                <ol style="padding-left: 20px;">
                    ${recipe.instructions.map((step, index) => `
                        <li style="margin: 15px 0; line-height: 1.6;">
                            <span style="display: inline-block; background: #667eea; color: white; width: 24px; height: 24px; border-radius: 12px; text-align: center; line-height: 24px; font-size: 14px; margin-right: 10px;">${index + 1}</span>
                            ${step}
                        </li>
                    `).join('')}
                </ol>
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

// Обработка фокуса поиска
window.handleSearchFocus = function(focused) {
    isSearchFocused = focused;
    updateFooterVisibility();
    
    if (!focused) {
        setTimeout(() => {
            updateFooterVisibility();
        }, 200);
    }
};

// Переключение продукта
window.toggleProduct = function(productId) {
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
    } else {
        selectedProducts.add(productId);
    }
    
    saveSelectedProducts();
    
    // Обновляем только конкретный элемент
    const productEl = document.querySelector(`.product-item[data-id="${productId}"]`);
    if (productEl) {
        if (selectedProducts.has(productId)) {
            productEl.classList.add('selected');
        } else {
            productEl.classList.remove('selected');
        }
    }
    
    // Обновляем счетчик
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = `Выбрано продуктов: ${selectedProducts.size}`;
    }
    
    // Обновляем состояние кнопок
    const findBtn = document.getElementById('findRecipesBtn');
    const resetBtn = document.getElementById('resetBtn');
    if (findBtn) {
        findBtn.disabled = selectedProducts.size === 0;
    }
    if (resetBtn) {
        resetBtn.disabled = selectedProducts.size === 0;
    }
};

// Обработчики для страницы продуктов
function attachProductsEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value;
                showProductsPage();
            }, 300);
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

// Добавляем стили для анимации загрузки
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedProducts();
    showProductsPage();
    
    window.addEventListener('resize', () => {
        if (!isSearchFocused) {
            updateFooterVisibility();
        }
    });
});

// Сохраняем функции в глобальную область
window.showProductsPage = showProductsPage;
window.showRecipesPage = showRecipesPage;
window.showAllRecipesPage = showAllRecipesPage;
window.handleSearchFocus = handleSearchFocus;
window.toggleProduct = toggleProduct;
window.filterRecipes = filterRecipes;
window.viewRecipe = viewRecipe;