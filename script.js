let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {

  let existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " added to cart");
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}
function searchProducts() {

  let input = document.getElementById("search").value.toLowerCase();

  let products = document.querySelectorAll(".product");

  products.forEach(product => {

    let name = product.querySelector("h3").innerText.toLowerCase();

    if (name.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }

  });

}
