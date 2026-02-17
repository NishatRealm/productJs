const productList = document.getElementById("product-list");
const categoriesDiv = document.getElementById("categories");
const cartCount = document.getElementById("cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

// load productpage
if(productList){
  loadAllProducts();
  loadCategories();
}


// get all products
async function loadAllProducts(){
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  displayProducts(data);
}

//get catagories
async function loadCategories(){
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const data = await res.json();

  categoriesDiv.innerHTML = `<button onclick="loadAllProducts()">All</button>`;

  data.forEach(cat=>{
    categoriesDiv.innerHTML += 
      `<button onclick="loadByCategory('${cat}')">${cat}</button>`;
  });
}

//load through catagory
async function loadByCategory(cat){
  const res = await fetch(`https://fakestoreapi.com/products/category/${cat}`);
  const data = await res.json();
  displayProducts(data);
}

//  {
//     "id": 1,
//     "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
//     "price": 109.95,
//     "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
//     "category": "men's clothing",
//     "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
//     "rating": {
//       "rate": 3.9,
//       "count": 120
//     }
//   },


//display products
function displayProducts(products){
  productList.innerHTML = "";

  products.forEach(p=>{
    productList.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h4>${p.title.substring(0,40)}...</h4>
        <div class="rating">${p.rating.rate} (${p.rating.count})</div>
        <p class="price">$${p.price}</p>
        <button class="details-btn" onclick="showDetails(${p.id})">Details</button>
        <button class="add-btn" onclick='addToCart(${JSON.stringify(p)})'>Add</button>
      </div>
    `;
  });
}

//add to cart
function addToCart(product){
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  if(cartCount){
    cartCount.innerText = cart.length;
  }
}

//details modal
async function showDetails(id){
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const p = await res.json();

  let modal = document.getElementById("modal");

  if(!modal){
    modal = document.createElement("div");
    modal.id = "modal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <img src="${p.image}">
    <h3>${p.title}</h3>
    <p>${p.description}</p>
    <p><strong>$${p.price}</strong></p>
    <button onclick="addToCart(${JSON.stringify(p)})">Add to Cart</button>
    <button onclick="closeModal()">Close</button>
  `;

  modal.style.display = "block";
}

function closeModal(){
  document.getElementById("modal").style.display = "none";
}
