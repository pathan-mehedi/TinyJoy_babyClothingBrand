// Initialize Swiper
const swiper = new Swiper(".swiper-container", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Close mobile menu when clicking a link
  const menuLinks = mobileMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

// Smooth scroll for anchor links
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Simple Cart Functionality
const cart = [];

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

function updateCartModal() {
  const items = document.getElementById('cart-items');
  let total = 0;
  if (items) {
    items.innerHTML = '';
    cart.forEach(item => {
      total += item.price * item.qty;
      items.innerHTML += `<li class="mb-2 flex justify-between">
        <span>${item.name} x${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </li>`;
    });
  }
  const cartTotal = document.getElementById('cart-total');
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }
}

// Attach event listeners to Add to Cart buttons
function setupCartButtons() {
  const addToCartBtns = document.querySelectorAll('.add-to-cart');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      updateCartCount();
    });
  });
}

// Cart modal open/close
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');

if (cartButton && cartModal && closeCart) {
  cartButton.addEventListener('click', () => {
    updateCartModal();
    cartModal.classList.remove('hidden');
  });
  closeCart.addEventListener('click', () => {
    cartModal.classList.add('hidden');
  });
}

// Product details modal logic
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const modalProductImage = document.getElementById('modal-product-image');
const modalProductTitle = document.getElementById('modal-product-title');
const modalProductDesc = document.getElementById('modal-product-desc');
const modalProductPrice = document.getElementById('modal-product-price');
const modalAddToCart = document.getElementById('modal-add-to-cart');

let modalProductData = {};

function openProductModal(product) {
  modalProductImage.src = product.image;
  modalProductTitle.textContent = product.title;
  modalProductDesc.textContent = product.desc;
  modalProductPrice.textContent = `$${product.price}`;
  modalAddToCart.setAttribute('data-name', product.title);
  modalAddToCart.setAttribute('data-price', product.price);
  productModal.classList.remove('hidden');
  modalProductData = product;
}

if (closeProductModal && productModal) {
  closeProductModal.addEventListener('click', () => {
    productModal.classList.add('hidden');
  });
}

// Attach click event to product cards
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', function (e) {
    // Prevent modal open when clicking Add to Cart button
    if (e.target.classList.contains('add-to-cart')) return;
    const img = card.querySelector('img');
    const title = card.querySelector('h3').textContent;
    const desc = card.querySelector('p').textContent;
    const price = card.querySelector('span.text-purple-600').textContent.replace('$', '');
    openProductModal({
      image: img.src,
      title,
      desc,
      price
    });
  });
});

// Add to cart from modal
if (modalAddToCart) {
  modalAddToCart.addEventListener('click', function () {
    const name = this.getAttribute('data-name');
    const price = parseFloat(this.getAttribute('data-price'));
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCartCount();
    productModal.classList.add('hidden');
  });
}

// Initialize cart buttons on DOMContentLoaded
document.addEventListener('DOMContentLoaded', setupCartButtons);
