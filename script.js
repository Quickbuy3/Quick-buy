let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {

  let product = {
    name: name,
    price: price
  };

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " added to cart");
}
