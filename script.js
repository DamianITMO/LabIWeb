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

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
    checkoutBtn.disabled = true;
  } else {
    cartItemsEl.innerHTML = cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        if (!product) return "";
        return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__info">
            <div class="cart-item__title">${product.emoji} ${product.title}</div>
            <div class="cart-item__price">${formatPrice(product.price)} × ${item.qty}</div>
            <div class="cart-item__controls">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
              <button class="btn btn--danger" data-action="remove" data-id="${item.id}">Удалить</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
    checkoutBtn.disabled = false;
  }

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => {
    const p = PRODUCTS.find((pr) => pr.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);

  cartCountEl.textContent = totalQty;
  cartTotalEl.textContent = formatPrice(totalPrice);
}

function addToCart(id) {
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("visible");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
  cartPanel.setAttribute("aria-hidden", "true");
}

function openModal() {
  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
  closeCart();
}

function closeModal() {
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
  orderForm.reset();
}

function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function bindEvents() {
  // Добавление в корзину
  productsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (btn && btn.classList.contains("product-card__btn")) {
      addToCart(Number(btn.dataset.id));
    }
  });

  // Управление корзиной
  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    if (action === "increase") changeQty(id, 1);
    if (action === "decrease") changeQty(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  cartToggle.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  overlay.addEventListener("click", () => {
    closeCart();
    closeModal();
  });

  checkoutBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(orderForm);
    const firstName = formData.get("firstName").trim();
    const lastName = formData.get("lastName").trim();
    const address = formData.get("address").trim();
    const phone = formData.get("phone").trim();

    if (!firstName || !lastName || !address || !phone) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    closeModal();
    clearCart();
    showToast();
  });
}

function formatPrice(num) {
  return num.toLocaleString("ru-RU");
}

// Запуск
init();
