const PRODUCTS = [
  { id: 1, title: "Смартфон Cataxy X", price: 45990, emoji: "📱" },
  { id: 2, title: "Ноутбук CatBook 15", price: 78990, emoji: "💻" },
  { id: 3, title: "Беспроводные наушники CatAudio", price: 8990, emoji: "🎧" },
  { id: 4, title: "Умные часы CatTrack", price: 12490, emoji: "⌚" },
  { id: 5, title: "Планшет CatLite", price: 24990, emoji: "📲" },
  { id: 6, title: "Клавиатура CAT", price: 5490, emoji: "⌨️" },
  { id: 7, title: "Мышь Gaming Cat", price: 3290, emoji: "🖱️" },
  { id: 8, title: "Монитор CRT Cat", price: 32990, emoji: "🖥️" },
];

let cart = [];

const productsEl = document.getElementById("products");
const cartPanel = document.getElementById("cartPanel");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderModal = document.getElementById("orderModal");
const modalClose = document.getElementById("modalClose");
const orderForm = document.getElementById("orderForm");
const toast = document.getElementById("toast");

function init() {
  loadCart();
  renderProducts();
  renderCart();
  bindEvents();
}

function loadCart() {
  try {
    const saved = localStorage.getItem("techstore_cart");
    cart = saved ? JSON.parse(saved) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("techstore_cart", JSON.stringify(cart));
}

function renderProducts() {
  productsEl.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="product-card">
      <div class="product-card__img">${p.emoji}</div>
      <div class="product-card__body">
        <h3 class="product-card__title">${p.title}</h3>
        <p class="product-card__price">${formatPrice(p.price)}</p>
        <button class="btn btn--primary product-card__btn" data-id="${p.id}">
          Добавить в корзину
        </button>
      </div>
    </article>
  `
  ).join("");
}