/* ================= Quick Buy — shared app logic (vanilla JS) ================= */

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  { id: 1,  name: "Wireless Noise Cancelling Headphones", cat: "Electronics", price: 2499, mrp: 5999, rating: 4.4, reviews: 1820, tags: ["featured", "trending", "deal"], img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=70" },
  { id: 2,  name: "Smart Fitness Watch with AMOLED Display", cat: "Electronics", price: 1899, mrp: 4999, rating: 4.2, reviews: 940, tags: ["featured", "new"], img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=70" },
  { id: 3,  name: "Men's Casual Running Sneakers", cat: "Fashion", price: 1299, mrp: 2999, rating: 4.1, reviews: 610, tags: ["trending", "deal"], img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70" },
  { id: 4,  name: "Leather Analog Wrist Watch", cat: "Fashion", price: 999, mrp: 2499, rating: 4.3, reviews: 320, tags: ["featured"], img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=70" },
  { id: 5,  name: "DSLR Camera 24MP with Kit Lens", cat: "Electronics", price: 34999, mrp: 45999, rating: 4.6, reviews: 210, tags: ["featured", "new"], img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=70" },
  { id: 6,  name: "Backpack 30L Water Resistant", cat: "Fashion", price: 899, mrp: 1999, rating: 4.0, reviews: 480, tags: ["deal", "new"], img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=70" },
  { id: 7,  name: "Bluetooth Speaker Deep Bass", cat: "Electronics", price: 1499, mrp: 3499, rating: 4.2, reviews: 1120, tags: ["trending", "deal"], img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=70" },
  { id: 8,  name: "Sunglasses UV400 Polarized", cat: "Fashion", price: 599, mrp: 1799, rating: 3.9, reviews: 260, tags: ["deal"], img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=70" },
  { id: 9,  name: "Non-Stick Cookware Set of 5", cat: "Home", price: 2199, mrp: 4499, rating: 4.3, reviews: 390, tags: ["featured", "deal"], img: "https://images.unsplash.com/photo-1584990347449-a2d4c2c9ec3f?w=600&q=70" },
  { id: 10, name: "Cotton Bedsheet King Size", cat: "Home", price: 799, mrp: 1899, rating: 4.1, reviews: 520, tags: ["new"], img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70" },
  { id: 11, name: "Vitamin C Face Serum 30ml", cat: "Beauty", price: 449, mrp: 999, rating: 4.4, reviews: 2100, tags: ["trending", "new"], img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=70" },
  { id: 12, name: "Professional Hair Dryer 2000W", cat: "Beauty", price: 1099, mrp: 2299, rating: 4.0, reviews: 340, tags: ["deal"], img: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=70" },
  { id: 13, name: "Yoga Mat Anti-Slip 6mm", cat: "Sports", price: 649, mrp: 1499, rating: 4.2, reviews: 700, tags: ["new", "trending"], img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=70" },
  { id: 14, name: "Adjustable Dumbbell Set 20kg", cat: "Sports", price: 3299, mrp: 5999, rating: 4.5, reviews: 180, tags: ["featured"], img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=70" },
  { id: 15, name: "Bestseller Novel Collection (3 Books)", cat: "Books", price: 799, mrp: 1499, rating: 4.7, reviews: 830, tags: ["new"], img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=70" },
  { id: 16, name: "Wooden Building Blocks for Kids", cat: "Toys", price: 549, mrp: 1299, rating: 4.3, reviews: 410, tags: ["trending", "deal"], img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=70" },
];

const CATEGORIES = [
  { name: "Electronics", emoji: "📱" },
  { name: "Fashion", emoji: "👕" },
  { name: "Home", emoji: "🏠" },
  { name: "Beauty", emoji: "💄" },
  { name: "Sports", emoji: "🏀" },
  { name: "Books", emoji: "📚" },
  { name: "Toys", emoji: "🧸" },
  { name: "Deals", emoji: "🔥" },
];

/* ---------- LocalStorage helpers (backwards compatible) ---------- */
const store = {
  get(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};
const getCart = () => store.get("cart", []);
const setCart = (c) => { store.set("cart", c); refreshBadges(); };
const getWish = () => store.get("wishlist", []);
const setWish = (w) => { store.set("wishlist", w); refreshBadges(); };
const getOrders = () => store.get("orders", []);
const setOrders = (o) => store.set("orders", o);
const getUser = () => store.get("user", null);
const setUser = (u) => store.set("user", u);
const getUsers = () => store.get("users", []);
const productById = (id) => PRODUCTS.find((p) => p.id === Number(id));
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
const discount = (p) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

/* ---------- Toasts ---------- */
function toast(msg, type = "ok") {
  let stack = document.querySelector(".toast-stack");
  if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
  const icons = { ok: "✅", err: "⚠️", info: "🛍️" };
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = `<span>${icons[type] || ""}</span><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 250); }, 2200);
}

/* ---------- Theme ---------- */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
  document.querySelectorAll("[data-theme-icon]").forEach((b) => (b.textContent = t === "dark" ? "☀️" : "🌙"));
}
function toggleTheme() {
  const next = (localStorage.getItem("theme") || "light") === "dark" ? "light" : "dark";
  applyTheme(next);
  toast(next === "dark" ? "Dark mode on" : "Light mode on", "info");
}
applyTheme(localStorage.getItem("theme") || "light");

/* ---------- Cart / Wishlist actions ---------- */
function addToCart(id, qty = 1, silent = false) {
  const cart = getCart();
  const line = cart.find((i) => i.id === Number(id));
  if (line) line.qty += qty; else cart.push({ id: Number(id), qty });
  setCart(cart);
  if (!silent) toast(`${productById(id).name.slice(0, 24)}… added to cart`);
}
function removeFromCart(id) { setCart(getCart().filter((i) => i.id !== Number(id))); toast("Removed from cart", "info"); }
function changeQty(id, delta) {
  const cart = getCart();
  const line = cart.find((i) => i.id === Number(id));
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) return removeFromCart(id);
  setCart(cart);
}
function toggleWish(id) {
  id = Number(id);
  let w = getWish();
  const has = w.includes(id);
  w = has ? w.filter((x) => x !== id) : [...w, id];
  setWish(w);
  toast(has ? "Removed from wishlist" : "Saved to wishlist ❤️", has ? "info" : "ok");
  document.querySelectorAll(`.wish-btn[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", !has));
  if (document.body.dataset.page === "wishlist") renderWishlist();
}
const cartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
const cartTotal = () => getCart().reduce((s, i) => s + (productById(i.id)?.price || 0) * i.qty, 0);

function refreshBadges() {
  const c = cartCount(), w = getWish().length;
  document.querySelectorAll("[data-cart-badge]").forEach((e) => { e.textContent = c; e.style.display = c ? "grid" : "none"; });
  document.querySelectorAll("[data-wish-badge]").forEach((e) => { e.textContent = w; e.style.display = w ? "grid" : "none"; });
}

/* ---------- Shared chrome ---------- */
function headerHTML(title) {
  return `
  <header class="app-header">
    <div class="container">
      <div class="header-row">
        <a class="logo" href="index.html">
          <span class="logo-mark">Q</span>
          <span>Quick Buy<small>${title || "Shop faster. Save more."}</small></span>
        </a>
        <div class="header-actions">
          <button class="icon-btn" data-theme-icon onclick="toggleTheme()" aria-label="Toggle dark mode">🌙</button>
          <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">❤️<span class="badge" data-wish-badge style="display:none">0</span></a>
          <a class="icon-btn" href="cart.html" aria-label="Cart">🛒<span class="badge" data-cart-badge style="display:none">0</span></a>
        </div>
      </div>
      <div class="search-wrap">
        <span class="s-icon">🔍</span>
        <input id="globalSearch" type="search" placeholder="Search products, brands and more" />
      </div>
    </div>
  </header>`;
}

function bottomNavHTML(active) {
  const items = [
    ["home", "index.html", "🏠", "Home"],
    ["categories", "categories.html", "🗂️", "Categories"],
    ["wishlist", "wishlist.html", "❤️", "Wishlist"],
    ["cart", "cart.html", "🛒", "Cart"],
    ["account", "profile.html", "👤", "Account"],
  ];
  return `<nav class="bottom-nav">${items
    .map(([key, href, ico, label]) => {
      const badge =
        key === "cart" ? `<span class="nav-badge" data-cart-badge style="display:none">0</span>` :
        key === "wishlist" ? `<span class="nav-badge" data-wish-badge style="display:none">0</span>` : "";
      return `<a href="${href}" class="${active === key ? "active" : ""}"><span class="ico">${ico}</span>${badge}<span>${label}</span></a>`;
    })
    .join("")}</nav>`;
}

function mountChrome(activeNav, headerTitle) {
  const h = document.getElementById("header-slot");
  if (h) h.innerHTML = headerHTML(headerTitle);
  const n = document.getElementById("nav-slot");
  if (n) n.innerHTML = bottomNavHTML(activeNav);
  refreshBadges();
  const s = document.getElementById("globalSearch");
  if (s) {
    const params = new URLSearchParams(location.search);
    if (params.get("q")) s.value = params.get("q");
    s.addEventListener("input", (e) => {
      if (document.body.dataset.page === "home" || document.body.dataset.page === "categories") {
        renderSearch(e.target.value);
      }
    });
    s.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && document.body.dataset.page !== "home") {
        location.href = "index.html?q=" + encodeURIComponent(e.target.value);
      }
    });
  }
}

/* ---------- Product card ---------- */
function cardHTML(p) {
  const wished = getWish().includes(p.id);
  return `
  <article class="card">
    <a class="card-img" href="product.html?id=${p.id}">
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <span class="off-tag">${discount(p)}% OFF</span>
    </a>
    <button class="wish-btn ${wished ? "on" : ""}" data-wish="${p.id}" onclick="toggleWish(${p.id})" aria-label="Wishlist">❤</button>
    <div class="card-body">
      <a class="card-name" href="product.html?id=${p.id}">${p.name}</a>
      <div class="rating"><span class="stars">${p.rating} ★</span><span>(${p.reviews})</span></div>
      <div class="price-row">
        <span class="price">${money(p.price)}</span>
        <span class="mrp">${money(p.mrp)}</span>
        <span class="off">${discount(p)}% off</span>
      </div>
      <button class="btn block" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  </article>`;
}
const renderInto = (sel, list, cls) => {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = list.map(cardHTML).join("");
};

/* ---------- Home ---------- */
function renderHome() {
  document.querySelector("#cats").innerHTML = CATEGORIES.map(
    (c) => `<a class="cat" href="categories.html?cat=${encodeURIComponent(c.name)}"><div class="emoji">${c.emoji}</div><span>${c.name}</span></a>`
  ).join("");
  renderInto("#featured", PRODUCTS.filter((p) => p.tags.includes("featured")));
  renderInto("#trending", PRODUCTS.filter((p) => p.tags.includes("trending")));
  renderInto("#arrivals", PRODUCTS.filter((p) => p.tags.includes("new")));
  renderInto("#deals", PRODUCTS.filter((p) => p.tags.includes("deal")).sort((a, b) => discount(b) - discount(a)));
  const q = new URLSearchParams(location.search).get("q");
  if (q) renderSearch(q);
  startSlider();
}

function renderSearch(q) {
  const box = document.getElementById("searchResults");
  const rest = document.getElementById("homeSections");
  if (!box) return;
  q = (q || "").trim().toLowerCase();
  if (!q) { box.innerHTML = ""; box.style.display = "none"; if (rest) rest.style.display = ""; return; }
  const hits = PRODUCTS.filter((p) => (p.name + " " + p.cat).toLowerCase().includes(q));
  box.style.display = "";
  if (rest) rest.style.display = "none";
  box.innerHTML = `<div class="section"><div class="section-head"><h2>${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”</h2></div>
    ${hits.length ? `<div class="grid">${hits.map(cardHTML).join("")}</div>` : `<div class="empty"><div class="big">🔍</div><p>No products matched your search.</p></div>`}</div>`;
}

/* ---------- Auto slider ---------- */
function startSlider() {
  const track = document.querySelector(".slides");
  if (!track) return;
  const total = track.children.length;
  const dots = document.querySelector(".dots");
  dots.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("");
  let i = 0, timer;
  const go = (n) => {
    i = (n + total) % total;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
  };
  const play = () => (timer = setInterval(() => go(i + 1), 3500));
  play();
  let startX = 0;
  track.parentElement.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  track.parentElement.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    play();
  });
}

/* ---------- Categories page ---------- */
function renderCategories() {
  const params = new URLSearchParams(location.search);
  const active = params.get("cat") || "All";
  const chips = ["All", ...CATEGORIES.map((c) => c.name)];
  document.getElementById("catChips").innerHTML = chips
    .map((c) => `<a class="chip" style="${c === active ? "background:var(--orange);color:#fff" : ""}" href="categories.html?cat=${encodeURIComponent(c)}">${c}</a>`)
    .join("");
  let list = PRODUCTS;
  if (active === "Deals") list = PRODUCTS.filter((p) => p.tags.includes("deal"));
  else if (active !== "All") list = PRODUCTS.filter((p) => p.cat === active);
  document.getElementById("catTitle").textContent = active + " (" + list.length + ")";
  renderInto("#catGrid", list);
}

/* ---------- Product details ---------- */
function renderProduct() {
  const id = new URLSearchParams(location.search).get("id");
  const p = productById(id);
  const root = document.getElementById("pd");
  if (!p) { root.innerHTML = `<div class="empty"><div class="big">😕</div><p>Product not found.</p><a class="btn" href="index.html">Back to home</a></div>`; return; }
  document.title = p.name + " — Quick Buy";
  const wished = getWish().includes(p.id);
  root.innerHTML = `
    <div class="pd-img"><img src="${p.img}" alt="${p.name}" /></div>
    <div class="section">
      <div class="chips"><span class="chip">${p.cat}</span>${p.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      <h1 class="page-title" style="margin-top:10px">${p.name}</h1>
      <div class="rating"><span class="stars">${p.rating} ★</span><span>${p.reviews} ratings</span></div>
      <div class="price-row" style="margin-top:10px">
        <span class="price" style="font-size:24px">${money(p.price)}</span>
        <span class="mrp">${money(p.mrp)}</span>
        <span class="off">${discount(p)}% off</span>
      </div>
      <p class="muted" style="margin-top:10px">Inclusive of all taxes · Free delivery in 2-4 days · 7-day easy return. Genuine product with 1 year warranty, backed by Quick Buy buyer protection.</p>
      <div class="panel" style="margin-top:14px">
        <div class="summary-line"><span>Delivery</span><b>FREE</b></div>
        <div class="summary-line"><span>You save</span><b style="color:var(--green)">${money(p.mrp - p.price)}</b></div>
        <div class="summary-line"><span>In stock</span><b>Yes</b></div>
      </div>
    </div>
    <div class="pd-actions">
      <button class="btn outline lg" onclick="toggleWish(${p.id})">${wished ? "♥ Wishlisted" : "♡ Wishlist"}</button>
      <button class="btn lg" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
    <div class="section">
      <div class="section-head"><h2>Similar products</h2></div>
      <div class="rail">${PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).map(cardHTML).join("") || "<p class='muted'>Nothing similar yet.</p>"}</div>
    </div>`;
}

/* ---------- Cart ---------- */
function renderCart() {
  const items = getCart();
  const list = document.getElementById("cartList");
  const summary = document.getElementById("cartSummary");
  if (!items.length) {
    list.innerHTML = `<div class="empty"><div class="big">🛒</div><p>Your cart is empty.</p><a class="btn" href="index.html">Start shopping</a></div>`;
    summary.innerHTML = "";
    return;
  }
  list.innerHTML = items.map((i) => {
    const p = productById(i.id);
    if (!p) return "";
    return `<div class="row-item">
      <img src="${p.img}" alt="${p.name}" />
      <div class="info">
        <a class="card-name" href="product.html?id=${p.id}">${p.name}</a>
        <div class="price-row"><span class="price">${money(p.price)}</span><span class="mrp">${money(p.mrp)}</span><span class="off">${discount(p)}% off</span></div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
          <div class="qty"><button onclick="changeQty(${p.id},-1);renderCart()">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1);renderCart()">+</button></div>
          <button class="link-danger" onclick="removeFromCart(${p.id});renderCart()">Remove</button>
        </div>
      </div>
    </div>`;
  }).join("");
  const total = cartTotal();
  const mrpTotal = items.reduce((s, i) => s + (productById(i.id)?.mrp || 0) * i.qty, 0);
  summary.innerHTML = `<div class="panel">
    <div class="summary-line"><span>Price (${cartCount()} items)</span><span>${money(mrpTotal)}</span></div>
    <div class="summary-line"><span>Discount</span><span style="color:var(--green)">− ${money(mrpTotal - total)}</span></div>
    <div class="summary-line"><span>Delivery</span><span style="color:var(--green)">FREE</span></div>
    <div class="summary-line total"><span>Total</span><span>${money(total)}</span></div>
    <a class="btn block lg" style="display:block;text-align:center;margin-top:12px" href="checkout.html">Proceed to Checkout</a>
  </div>`;
}

/* ---------- Wishlist ---------- */
function renderWishlist() {
  const ids = getWish();
  const el = document.getElementById("wishGrid");
  if (!ids.length) {
    el.innerHTML = `<div class="empty"><div class="big">❤️</div><p>No saved items yet.</p><a class="btn" href="index.html">Browse products</a></div>`;
    return;
  }
  el.innerHTML = `<div class="grid">${ids.map(productById).filter(Boolean).map(cardHTML).join("")}</div>`;
}

/* ---------- Checkout ---------- */
function renderCheckout() {
  const items = getCart();
  const box = document.getElementById("checkoutSummary");
  if (!items.length) {
    document.getElementById("checkoutBody").innerHTML = `<div class="empty"><div class="big">🧾</div><p>Nothing to checkout.</p><a class="btn" href="index.html">Shop now</a></div>`;
    return;
  }
  box.innerHTML = `<div class="panel">
    ${items.map((i) => { const p = productById(i.id); return `<div class="summary-line"><span>${p.name.slice(0, 26)}… × ${i.qty}</span><span>${money(p.price * i.qty)}</span></div>`; }).join("")}
    <div class="summary-line total"><span>Total payable</span><span>${money(cartTotal())}</span></div>
  </div>`;
  const u = getUser();
  if (u) { document.getElementById("coName").value = u.name || ""; document.getElementById("coEmail").value = u.email || ""; }
  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) { toast("Please fill all required fields", "err"); return; }
    const order = {
      id: "QB" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items: getCart().map((i) => ({ ...i, name: productById(i.id).name, price: productById(i.id).price, img: productById(i.id).img })),
      total: cartTotal(),
      address: document.getElementById("coAddress").value,
      payment: document.getElementById("coPayment").value,
      status: "Confirmed",
    };
    setOrders([order, ...getOrders()]);
    setCart([]);
    toast("Order placed successfully 🎉");
    setTimeout(() => (location.href = "orders.html"), 900);
  });
}

/* ---------- Orders ---------- */
function renderOrders() {
  const orders = getOrders();
  const el = document.getElementById("ordersList");
  if (!orders.length) {
    el.innerHTML = `<div class="empty"><div class="big">📦</div><p>No orders yet.</p><a class="btn" href="index.html">Start shopping</a></div>`;
    return;
  }
  el.innerHTML = orders.map((o) => `
    <div class="panel" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b>#${o.id}</b><span class="status ${o.status === "Delivered" ? "done" : ""}">${o.status}</span>
      </div>
      <p class="muted" style="margin:6px 0 10px">Placed on ${new Date(o.date).toLocaleDateString()} · ${o.payment}</p>
      ${o.items.map((i) => `<div class="row-item" style="margin-bottom:8px">
          <img src="${i.img}" alt="${i.name}" />
          <div class="info"><div class="card-name">${i.name}</div><div class="muted">Qty ${i.qty} · ${money(i.price * i.qty)}</div></div>
        </div>`).join("")}
      <div class="summary-line total"><span>Total</span><span>${money(o.total)}</span></div>
      <p class="muted" style="margin-top:8px">Deliver to: ${o.address}</p>
    </div>`).join("");
}

/* ---------- Auth ---------- */
function initLogin() {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("lgEmail").value.trim().toLowerCase();
    const pass = document.getElementById("lgPass").value;
    const found = getUsers().find((u) => u.email === email && u.password === pass);
    if (!found) return toast("Invalid email or password", "err");
    setUser({ name: found.name, email: found.email });
    toast("Welcome back, " + found.name.split(" ")[0] + "!");
    setTimeout(() => (location.href = "profile.html"), 800);
  });
}
function initRegister() {
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("rgName").value.trim();
    const email = document.getElementById("rgEmail").value.trim().toLowerCase();
    const pass = document.getElementById("rgPass").value;
    if (pass.length < 6) return toast("Password must be at least 6 characters", "err");
    const users = getUsers();
    if (users.some((u) => u.email === email)) return toast("Account already exists. Please login.", "err");
    users.push({ name, email, password: pass });
    store.set("users", users);
    setUser({ name, email });
    toast("Account created 🎉");
    setTimeout(() => (location.href = "profile.html"), 800);
  });
}
function logout() { localStorage.removeItem("user"); toast("Logged out", "info"); setTimeout(() => location.reload(), 700); }

/* ---------- Profile ---------- */
function renderProfile() {
  const u = getUser();
  const el = document.getElementById("profileBox");
  if (!u) {
    el.innerHTML = `<div class="panel center">
      <div class="big" style="font-size:44px">👤</div>
      <h3 style="margin:8px 0">You are not logged in</h3>
      <p class="muted">Login to track orders, save addresses and sync your wishlist.</p>
      <div style="display:grid;gap:10px;margin-top:14px">
        <a class="btn lg" href="login.html">Login</a>
        <a class="btn outline lg" href="register.html">Create account</a>
      </div>
    </div>`;
  } else {
    el.innerHTML = `<div class="panel" style="display:flex;gap:14px;align-items:center">
        <div class="avatar">${u.name.charAt(0).toUpperCase()}</div>
        <div class="info"><b style="font-size:17px">${u.name}</b><div class="muted">${u.email}</div></div>
      </div>`;
  }
  document.getElementById("profileStats").innerHTML = `
    <div class="panel center"><b style="font-size:20px">${getOrders().length}</b><div class="muted">Orders</div></div>
    <div class="panel center"><b style="font-size:20px">${getWish().length}</b><div class="muted">Wishlist</div></div>
    <div class="panel center"><b style="font-size:20px">${cartCount()}</b><div class="muted">In cart</div></div>`;
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.style.display = getUser() ? "flex" : "none";
}
