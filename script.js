/* ================= Quick Buy — shared app logic (vanilla JS) ================= */

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  { id: 1, name:"Wireless Noise Cancelling Headphones", cat:"Electronics", price:2499, mrp:5999, rating:4.4, reviews:1820, tags:["featured","trending","deal"], img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=70"},
  { id: 2, name:"Smart Fitness Watch with AMOLED Display", cat:"Electronics", price:1899, mrp:4999, rating:4.2, reviews:940, tags:["featured","new"], img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=70"},
  { id: 3, name:"Men's Casual Running Sneakers", cat:"Fashion", price:1299, mrp:2999, rating:4.1, reviews:610, tags:["trending","deal"], img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70"},
  { id: 4, name:"Leather Analog Wrist Watch", cat:"Fashion", price:999, mrp:2499, rating:4.3, reviews:320, tags:["featured"], img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=70"},
  { id: 5, name:"DSLR Camera 24MP with Kit Lens", cat:"Electronics", price:34999, mrp:45999, rating:4.6, reviews:210, tags:["featured","new"], img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=70"},
  { id: 6, name:"Backpack 30L Water Resistant", cat:"Fashion", price:899, mrp:1999, rating:4.0, reviews:480, tags:["deal","new"], img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=70"},
  { id: 7, name:"Bluetooth Speaker Deep Bass", cat:"Electronics", price:1499, mrp:3499, rating:4.2, reviews:1120, tags:["trending","deal"], img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=70"},
  { id: 8, name:"Sunglasses UV400 Polarized", cat:"Fashion", price:599, mrp:1799, rating:3.9, reviews:260, tags:["deal"], img:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=70"},
  { id: 9, name:"Non-Stick Cookware Set of 5", cat:"Home", price:2199, mrp:4499, rating:4.3, reviews:390, tags:["featured","deal"], img:"https://images.unsplash.com/photo-1584990347449-a2d4c2c9ec3f?w=600&q=70"},
  { id: 10, name:"Cotton Bedsheet King Size", cat:"Home", price:799, mrp:1899, rating:4.1, reviews:520, tags:["new"], img:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70"},
];

const CATEGORIES=[
{name:"Electronics",emoji:"📱"},
{name:"Fashion",emoji:"👕"},
{name:"Home",emoji:"🏠"},
{name:"Beauty",emoji:"💄"},
{name:"Sports",emoji:"🏀"},
{name:"Books",emoji:"📚"},
{name:"Toys",emoji:"🧸"},
{name:"Deals",emoji:"🔥"}
];


/* ---------- Local Storage ---------- */

const store={
 get(k,def){
  try{
   return JSON.parse(localStorage.getItem(k)) ?? def;
  }catch{
   return def;
  }
 },

 set(k,v){
  localStorage.setItem(k,JSON.stringify(v));
 }
};


const getCart=()=>store.get("cart",[]);
const setCart=(c)=>{
 store.set("cart",c);
 refreshBadges();
};

const getWish=()=>store.get("wishlist",[]);
const setWish=(w)=>{
 store.set("wishlist",w);
 refreshBadges();
};

const getOrders=()=>store.get("orders",[]);
const setOrders=(o)=>store.set("orders",o);

const getUser=()=>store.get("user",null);
const setUser=(u)=>store.set("user",u);

const getUsers=()=>store.get("users",[]);

const productById=(id)=>
 PRODUCTS.find(p=>p.id===Number(id));

const money=(n)=>
"₹"+Number(n).toLocaleString("en-IN");

const discount=(p)=>
Math.round(((p.mrp-p.price)/p.mrp)*100);



/* ---------- Toast ---------- */

function toast(msg,type="ok"){

let stack=document.querySelector(".toast-stack");

if(!stack){
 stack=document.createElement("div");
 stack.className="toast-stack";
 document.body.appendChild(stack);
}


const icons={
 ok:"✅",
 err:"⚠️",
 info:"🛍️"
};


const el=document.createElement("div");

el.className="toast "+type;

el.innerHTML=
`<span>${icons[type]||""}</span><span>${msg}</span>`;


stack.appendChild(el);


setTimeout(()=>{
 el.classList.add("out");
 setTimeout(()=>el.remove(),250);
},2200);

}



/* ---------- Theme ---------- */

function applyTheme(t){

document.documentElement.setAttribute("data-theme",t);

localStorage.setItem("theme",t);


document.querySelectorAll("[data-theme-icon]")
.forEach(b=>{
 b.textContent=t==="dark"?"☀️":"🌙";
});

}


function toggleTheme(){

const next=
(localStorage.getItem("theme")||"light")==="dark"
?"light":"dark";


applyTheme(next);

toast(
next==="dark"?"Dark mode on":"Light mode on",
"info"
);

}


applyTheme(
localStorage.getItem("theme")||"light"
);



/* ---------- Cart / Wishlist ---------- */

function addToCart(id,qty=1,silent=false){

const cart=getCart();

const item=cart.find(i=>i.id===Number(id));


if(item){
 item.qty+=qty;
}
else{
 cart.push({
  id:Number(id),
  qty
 });
}


setCart(cart);


if(!silent){
 toast(productById(id).name.slice(0,24)+"… added to cart");
}

}



function removeFromCart(id){

setCart(
 getCart().filter(i=>i.id!==Number(id))
);

toast("Removed from cart","info");

}



function changeQty(id,delta){

const cart=getCart();

const item=cart.find(i=>i.id===Number(id));

if(!item)return;


item.qty+=delta;


if(item.qty<1){
 removeFromCart(id);
 return;
}


setCart(cart);

}



function toggleWish(id){

id=Number(id);

let w=getWish();


const exists=w.includes(id);


w=exists
?w.filter(x=>x!==id)
:[...w,id];


setWish(w);


toast(
exists
?"Removed from wishlist"
:"Saved to wishlist ❤️",
exists?"info":"ok"
);


document
.querySelectorAll(`.wish-btn[data-wish="${id}"]`)
.forEach(b=>{
 b.classList.toggle("on",!exists);
});


if(document.body.dataset.page==="wishlist"){
 renderWishlist();
}

}



const cartCount=()=>
getCart().reduce((s,i)=>s+i.qty,0);


const cartTotal=()=>
getCart().reduce(
(s,i)=>
s+(productById(i.id)?.price||0)*i.qty,
0
);



function refreshBadges(){

const c=cartCount();
const w=getWish().length;


document.querySelectorAll("[data-cart-badge]")
.forEach(e=>{
 e.textContent=c;
 e.style.display=c?"grid":"none";
});


document.querySelectorAll("[data-wish-badge]")
.forEach(e=>{
 e.textContent=w;
 e.style.display=w?"grid":"none";
});

}
/* ---------- Shared Chrome ---------- */

function headerHTML(title){
return `
<header class="app-header">
<div class="container">

<div class="header-row">

<a class="logo" href="index.html">
<span class="logo-mark">Q</span>
<span>
Quick Buy
<small>${title || "Shop faster. Save more."}</small>
</span>
</a>


<div class="header-actions">

<button class="icon-btn" data-theme-icon onclick="toggleTheme()">
🌙
</button>


<a class="icon-btn" href="wishlist.html">
❤️
<span class="badge" data-wish-badge style="display:none">0</span>
</a>


<a class="icon-btn" href="cart.html">
🛒
<span class="badge" data-cart-badge style="display:none">0</span>
</a>

</div>

</div>


<div class="search-wrap">
<span class="s-icon">🔍</span>
<input id="globalSearch" type="search"
placeholder="Search products, brands and more">
</div>


</div>
</header>
`;
}



function bottomNavHTML(active){

const items=[
["home","index.html","🏠","Home"],
["categories","categories.html","🗂️","Categories"],
["wishlist","wishlist.html","❤️","Wishlist"],
["cart","cart.html","🛒","Cart"],
["account","profile.html","👤","Account"]
];


return `
<nav class="bottom-nav">

${items.map(([key,href,ico,label])=>{


let badge="";

if(key==="cart"){
badge=`<span class="nav-badge"
data-cart-badge style="display:none">0</span>`;
}

if(key==="wishlist"){
badge=`<span class="nav-badge"
data-wish-badge style="display:none">0</span>`;
}


return `
<a href="${href}"
class="${active===key?"active":""}">

<span class="ico">${ico}</span>

${badge}

<span>${label}</span>

</a>
`;

}).join("")}


</nav>
`;

}



function mountChrome(activeNav,headerTitle){

const h=document.getElementById("header-slot");

if(h){
h.innerHTML=headerHTML(headerTitle);
}


const n=document.getElementById("nav-slot");

if(n){
n.innerHTML=bottomNavHTML(activeNav);
}


refreshBadges();



const s=document.getElementById("globalSearch");


if(s){


const params=new URLSearchParams(location.search);


if(params.get("q")){
s.value=params.get("q");
}


s.addEventListener("input",(e)=>{


if(
document.body.dataset.page==="home" ||
document.body.dataset.page==="categories"
){

renderSearch(e.target.value);

}

});


s.addEventListener("keydown",(e)=>{

if(e.key==="Enter" &&
document.body.dataset.page!=="home"){

location.href=
"index.html?q="+
encodeURIComponent(e.target.value);

}

});


}


}



/* ---------- Product Card ---------- */


function cardHTML(p){

const wished=getWish().includes(p.id);


return `

<article class="card">


<a class="card-img"
href="product.html?id=${p.id}">

<img src="${p.img}" alt="${p.name}">

<span class="off-tag">
${discount(p)}% OFF
</span>

</a>


<button
class="wish-btn ${wished?"on":""}"
data-wish="${p.id}"
onclick="toggleWish(${p.id})">

❤

</button>



<div class="card-body">


<a class="card-name"
href="product.html?id=${p.id}">
${p.name}
</a>


<div class="rating">

<span class="stars">
${p.rating} ★
</span>

<span>
(${p.reviews})
</span>

</div>



<div class="price-row">

<span class="price">
${money(p.price)}
</span>

<span class="mrp">
${money(p.mrp)}
</span>

<span class="off">
${discount(p)}% off
</span>

</div>


<button class="btn block"
onclick="addToCart(${p.id})">

Add to Cart

</button>


</div>


</article>

`;

}



function renderInto(sel,list){

const el=document.querySelector(sel);

if(el){

el.innerHTML=list.map(cardHTML).join("");

}

}


/* ---------- Home ---------- */


function renderHome(){


const cat=document.querySelector("#cats");


if(cat){

cat.innerHTML=CATEGORIES.map(c=>`

<a class="cat"
href="categories.html?cat=${encodeURIComponent(c.name)}">

<div class="emoji">${c.emoji}</div>

<span>${c.name}</span>

</a>

`).join("");

}



renderInto(
"#featured",
PRODUCTS.filter(p=>p.tags.includes("featured"))
);


renderInto(
"#trending",
PRODUCTS.filter(p=>p.tags.includes("trending"))
);


renderInto(
"#arrivals",
PRODUCTS.filter(p=>p.tags.includes("new"))
);


renderInto(
"#deals",
PRODUCTS.filter(p=>p.tags.includes("deal"))
);


const q=new URLSearchParams(location.search).get("q");

if(q){

renderSearch(q);

}


startSlider();


}
function renderSearch(q){

const box=document.getElementById("searchResults");

const rest=document.getElementById("homeSections");


if(!box) return;


q=(q||"").trim().toLowerCase();



if(!q){

box.innerHTML="";

box.style.display="none";

if(rest) rest.style.display="";

return;

}



const hits=PRODUCTS.filter(p=>

(p.name+" "+p.cat)
.toLowerCase()
.includes(q)

);



box.style.display="";

if(rest) rest.style.display="none";



box.innerHTML=`

<div class="section">

<div class="section-head">

<h2>
${hits.length} result${hits.length===1?"":"s"}
for "${q}"
</h2>

</div>


${hits.length ?

`<div class="grid">
${hits.map(cardHTML).join("")}
</div>`

:

`
<div class="empty">

<div class="big">🔍</div>

<p>
No products matched your search.
</p>

</div>

`

}


</div>

`;

}




/* ---------- Slider ---------- */

function startSlider(){

const track=document.querySelector(".slides");


if(!track) return;


const total=track.children.length;


const dots=document.querySelector(".dots");


if(dots){

dots.innerHTML=

Array.from(
{length:total},
(_,i)=>`<i class="${i===0?"on":""}"></i>`
).join("");

}



let i=0;


let timer;


function go(n){

i=(n+total)%total;


track.style.transform=
`translateX(-${i*100}%)`;



if(dots){

[...dots.children]
.forEach((d,k)=>
d.classList.toggle("on",k===i)
);

}

}



function play(){

timer=setInterval(()=>go(i+1),3500);

}


play();



let startX=0;


track.parentElement.addEventListener(
"touchstart",
e=>{

startX=e.touches[0].clientX;

clearInterval(timer);

},
{passive:true}
);



track.parentElement.addEventListener(
"touchend",
e=>{


let dx=
e.changedTouches[0].clientX-startX;



if(Math.abs(dx)>40){

go(i+(dx<0?1:-1));

}


play();


},
{passive:true}
);



}



/* ---------- Categories ---------- */

function renderCategories(){


const params=
new URLSearchParams(location.search);



const active=
params.get("cat") || "All";



const chips=[
"All",
...CATEGORIES.map(c=>c.name)
];



const chipBox=
document.getElementById("catChips");



if(chipBox){

chipBox.innerHTML=
chips.map(c=>`

<a class="chip"
href="categories.html?cat=${encodeURIComponent(c)}">

${c}

</a>

`).join("");

}



let list=PRODUCTS;



if(active==="Deals"){

list=PRODUCTS.filter(
p=>p.tags.includes("deal")
);

}

else if(active!=="All"){

list=PRODUCTS.filter(
p=>p.cat===active
);

}



const title=
document.getElementById("catTitle");


if(title){

title.textContent=
active+" ("+list.length+")";

}



renderInto("#catGrid",list);



}



/* ---------- Product Detail ---------- */


function renderProduct(){


const id=
new URLSearchParams(location.search)
.get("id");



const p=productById(id);



const root=
document.getElementById("pd");



if(!p){

root.innerHTML=`

<div class="empty">

<div class="big">😕</div>

<p>Product not found.</p>

</div>

`;

return;

}



document.title=
p.name+" — Quick Buy";



root.innerHTML=`

<div class="pd-img">

<img src="${p.img}">

</div>


<div class="section">

<h1 class="page-title">
${p.name}
</h1>


<div class="rating">

<span class="stars">
${p.rating} ★
</span>

<span>
${p.reviews} ratings
</span>

</div>



<div class="price-row">

<span class="price">
${money(p.price)}
</span>

<span class="mrp">
${money(p.mrp)}
</span>


<span class="off">
${discount(p)}% off
</span>

</div>



<button class="btn lg"
onclick="addToCart(${p.id})">

Add to Cart

</button>


</div>

`;

}
/* ---------- Cart ---------- */

function renderCart(){

const items=getCart();

const list=document.getElementById("cartList");

const summary=document.getElementById("cartSummary");


if(!items.length){

list.innerHTML=`

<div class="empty">

<div class="big">🛒</div>

<p>Your cart is empty.</p>

<a class="btn" href="index.html">
Start shopping
</a>

</div>

`;

if(summary) summary.innerHTML="";

return;

}



list.innerHTML=items.map(i=>{


const p=productById(i.id);


return `

<div class="row-item">

<img src="${p.img}">


<div class="info">


<a class="card-name"
href="product.html?id=${p.id}">
${p.name}
</a>


<div class="price-row">

<span class="price">
${money(p.price)}
</span>

</div>


<div class="qty">

<button onclick="changeQty(${p.id},-1);renderCart()">
−
</button>


<b>${i.qty}</b>


<button onclick="changeQty(${p.id},1);renderCart()">
+
</button>


</div>


<button class="link-danger"
onclick="removeFromCart(${p.id});renderCart()">

Remove

</button>


</div>

</div>

`;

}).join("");



if(summary){

summary.innerHTML=`

<div class="panel">


<div class="summary-line">

<span>Total</span>

<b>${money(cartTotal())}</b>

</div>


<a class="btn block"
href="checkout.html">

Proceed to Checkout

</a>


</div>

`;

}


}





/* ---------- Wishlist ---------- */

function renderWishlist(){


const ids=getWish();


const el=document.getElementById("wishGrid");


if(!el) return;



if(!ids.length){

el.innerHTML=`

<div class="empty">

<div class="big">❤️</div>

<p>No saved items yet.</p>

<a class="btn" href="index.html">
Browse products
</a>

</div>

`;

return;

}



el.innerHTML=

`<div class="grid">

${
ids
.map(productById)
.filter(Boolean)
.map(cardHTML)
.join("")
}

</div>`;

}





/* ---------- Orders ---------- */

function renderOrders(){


const orders=getOrders();


const el=document.getElementById("ordersList");


if(!el) return;



if(!orders.length){

el.innerHTML=`

<div class="empty">

<div class="big">📦</div>

<p>No orders yet.</p>

</div>

`;

return;

}



el.innerHTML=

orders.map(o=>`

<div class="panel">

<b>
#${o.id}
</b>


<p>
${o.status}
</p>


${o.items.map(i=>`

<div class="row-item">

<img src="${i.img}">

<div>

${i.name}

<br>

Qty: ${i.qty}

</div>

</div>


`).join("")}


<h3>
${money(o.total)}
</h3>


</div>


`).join("");

}






/* ---------- Login ---------- */


function initLogin(){


const form=document.getElementById("loginForm");


if(!form) return;



form.addEventListener("submit",e=>{


e.preventDefault();



const email=
document.getElementById("lgEmail").value.trim();


const pass=
document.getElementById("lgPass").value;
