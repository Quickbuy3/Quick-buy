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
