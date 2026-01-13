// script.js

const products = [
  "eggs", "milk", "bread", "cheese", "butter",
  "cucumber", "tomato", "onion", "chicken", "pasta",
  "salt", "garlic", "potato", "carrot", "rice",
  "beef", "fish", "lemon", "sugar", "oil"
];

let selected = new Set();

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product-item';
    if (selected.has(p)) el.classList.add('selected');
    el.textContent = p.charAt(0).toUpperCase() + p.slice(1);
    el.onclick = () => {
      if (selected.has(p)) {
        selected.delete(p);
      } else {
        selected.add(p);
      }
      updateUI();
    };
    grid.appendChild(el);
  });
}

function updateUI() {
  renderProducts();
  const btn = document.getElementById('sendBtn');
  btn.disabled = selected.size === 0;
}

function sendData() {
  if (selected.size === 0) return;
  const data = Array.from(selected).join(",");
  Telegram.WebApp.sendData(data);
  Telegram.WebApp.close();
}

// Инициализация
Telegram.WebApp.ready();
Telegram.WebApp.MainButton.text = 'Найти рецепты';
Telegram.WebApp.MainButton.onClick(sendData);

// Но мы используем свою кнопку — так красивее
document.getElementById('sendBtn').onclick = sendData;

renderProducts();