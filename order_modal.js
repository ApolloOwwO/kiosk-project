// =====================
// Modal Functions
// =====================
let currentItem = {};
let qty = 1;

function openModal(itemName) {
    currentItem = {
        name: itemName,
        price: 150, // default price
    };

    document.getElementById("itemTitle").innerText = itemName;
    document.getElementById("qty").innerText = 1;
    qty = 1;

    document.getElementById("itemModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("itemModal").style.display = "none";
}

// =====================
// Quantity Functions
// =====================
function increaseQty() {
    qty++;
    document.getElementById("qty").innerText = qty;
}

function decreaseQty() {
    if (qty > 1) {
        qty--;
        document.getElementById("qty").innerText = qty;
    }
}

// =====================
// Cart Functions
// =====================
let cart = [];

function addToCart() {
    // get milk + syrup choices
    const milk = document.querySelector('input[name="milk"]:checked').value;
    const syrup = document.querySelector('input[name="syrup"]:checked').value;

    const item = {
        name: currentItem.name,
        milk,
        syrup,
        price: currentItem.price,
        qty,
        total: currentItem.price * qty
    };

    // check if same item with same options already exists
    const existing = cart.find(
        c => c.name === item.name && c.milk === milk && c.syrup === syrup
    );

    if (existing) {
        existing.qty += qty;
        existing.total = existing.price * existing.qty;
    } else {
        cart.push(item);
    }

    renderCart();
    closeModal();
}

function renderCart() {
    const cartContainer = document.querySelector(".cart");
    const emptyMsg = cartContainer.querySelector(".empty");

    // hide empty msg if items exist
    if (cart.length > 0) {
        emptyMsg.style.display = "none";
    } else {
        emptyMsg.style.display = "block";
    }

    // remove old cart items (except summary)
    const oldItems = cartContainer.querySelectorAll(".cart-item");
    oldItems.forEach(el => el.remove());

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.total;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
      <div class="row">
        <span>${item.name} (${item.milk}, ${item.syrup})</span>
        <span>
          <button onclick="updateQty('${item.name}','${item.milk}','${item.syrup}',-1)">−</button>
          ${item.qty}
          <button onclick="updateQty('${item.name}','${item.milk}','${item.syrup}',1)">+</button>
        </span>
      </div>
      <div class="row">
        <span>₱ ${item.price.toFixed(2)}</span>
        <span>₱ ${item.total.toFixed(2)}</span>
      </div>
    `;
        cartContainer.insertBefore(div, cartContainer.querySelector(".summary"));
    });

    // tax + total
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const summary = cartContainer.querySelector(".summary");
    summary.querySelectorAll(".row")[0].children[1].innerText = `₱ ${subtotal.toFixed(2)}`;
    summary.querySelectorAll(".row")[1].children[1].innerText = `₱ ${tax.toFixed(2)}`;
    summary.querySelector(".total span:last-child").innerText = `₱ ${total.toFixed(2)}`;
}

function updateQty(name, milk, syrup, change) {
    const item = cart.find(c => c.name === name && c.milk === milk && c.syrup === syrup);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(c => !(c.name === name && c.milk === milk && c.syrup === syrup));
    } else {
        item.total = item.qty * item.price;
    }

    renderCart();
}

// attach event to "Add" button inside modal
document.querySelector(".modal-actions .add").addEventListener("click", addToCart);

// Open Payment Modal
document.querySelector(".checkout").addEventListener("click", () => {
    document.getElementById("paymentModal").style.display = "flex";
});

// Close Payment Modal
function closePayment() {
    document.getElementById("paymentModal").style.display = "none";
}

// Generate order number if not passed
const params = new URLSearchParams(window.location.search);
const orderParam = params.get("order");

let orderNumber;
if (orderParam) {
    orderNumber = orderParam; // From QR
} else {
    orderNumber = Math.floor(1000 + Math.random() * 9000);
}
document.getElementById("orderNumber").innerText = orderNumber;

// Payment method
if (params.has("payment")) {
    document.getElementById("paymentMethod").innerText = params.get("payment");
}


