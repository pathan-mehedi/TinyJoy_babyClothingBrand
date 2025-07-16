// Mobile menu toggle
document.getElementById("menu-toggle").addEventListener("click", function () {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
});

// Set minimum date for booking (today)
const today = new Date().toISOString().split("T")[0];
document.getElementById("date").min = today;

// Service selection from service cards
const bookButtons = document.querySelectorAll(".book-btn");
const serviceSelect = document.getElementById("service");

bookButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const service = this.getAttribute("data-service");
    const price = this.getAttribute("data-price");

    // Update the select dropdown
    serviceSelect.value = service;

    // Update the display in the booking section
    const display = document.getElementById("selected-service-display");
    display.innerHTML = `
                    <h4 class="font-bold text-lg">${service}</h4>
                    <p class="text-amber-400">$${price}</p>
                `;

    // Scroll to booking form
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });
});

// Generate available times
function generateTimes() {
  const timeSelect = document.getElementById("time");
  timeSelect.innerHTML =
    '<option value="" disabled selected>Select a time</option>';

  // Generate times from 9am to 7pm in 30 minute increments
  for (let hour = 9; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 19 && minute > 0) break; // Stop at 7pm

      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = `${hour > 12 ? hour - 12 : hour}:${minute
        .toString()
        .padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;

      const option = document.createElement("option");
      option.value = timeString;
      option.textContent = displayTime;
      timeSelect.appendChild(option);
    }
  }
}

generateTimes();

// Booking form submission
document
  .getElementById("booking-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    // Calculate price based on service
    let price = 0;
    if (service.includes("Classic Haircut")) price = 35;
    else if (service.includes("Beard Trim")) price = 25;
    else if (service.includes("Royal Shave")) price = 40;
    else if (service.includes("Hair Coloring")) price = 60;
    else if (service.includes("Deluxe Package")) price = 85;
    else if (service.includes("Kids Cut")) price = 25;

    // Format date for display
    const dateObj = new Date(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);

    // Format time for display
    const [hours, minutes] = time.split(":");
    let displayHours = parseInt(hours);
    const ampm = displayHours >= 12 ? "PM" : "AM";
    displayHours = displayHours % 12;
    displayHours = displayHours ? displayHours : 12; // the hour '0' should be '12'
    const displayTime = `${displayHours}:${minutes} ${ampm}`;

    // Update confirmation modal
    document.getElementById("confirmation-details").innerHTML = `
                <div class="bg-gray-100 p-4 rounded-md mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="font-bold">Service:</span>
                        <span>${service}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="font-bold">Date:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="font-bold">Time:</span>
                        <span>${displayTime}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-bold">Total:</span>
                        <span class="text-amber-600 font-bold">$${price}</span>
                    </div>
                </div>
                <div class="border-t border-gray-200 pt-4 mb-4">
                    <p class="font-bold mb-1">Customer Details</p>
                    <p>${name}</p>
                    <p>${phone}</p>
                    <p>${email}</p>
                </div>
            `;

    // Show confirmation modal
    document.getElementById("confirmation-modal").classList.remove("hidden");

    // Reset form
    this.reset();
  });

// Close modal
document.getElementById("close-modal").addEventListener("click", function () {
  document.getElementById("confirmation-modal").classList.add("hidden");
});

// New booking button
document
  .getElementById("new-booking-btn")
  .addEventListener("click", function () {
    document.getElementById("confirmation-modal").classList.add("hidden");
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });

// Update selected service display when dropdown changes
document.getElementById("service").addEventListener("change", function () {
  const service = this.value;
  let price = 0;

  if (service.includes("Classic Haircut")) price = 35;
  else if (service.includes("Beard Trim")) price = 25;
  else if (service.includes("Royal Shave")) price = 40;
  else if (service.includes("Hair Coloring")) price = 60;
  else if (service.includes("Deluxe Package")) price = 85;
  else if (service.includes("Kids Cut")) price = 25;

  const display = document.getElementById("selected-service-display");
  display.innerHTML = `
                <h4 class="font-bold text-lg">${service}</h4>
                <p class="text-amber-400">$${price}</p>
            `;
});

// Google Reviews Carousel Logic
const googleReviews = [
  {
    author: "Emily R.",
    rating: 5,
    text: "Absolutely loved my experience! The staff is friendly and professional.",
  },
  {
    author: "James K.",
    rating: 5,
    text: "Best barber shop in town. Highly recommend the deluxe package.",
  },
  {
    author: "Sophia L.",
    rating: 4,
    text: "Great service and atmosphere. Will visit again!",
  },
  {
    author: "David M.",
    rating: 5,
    text: "Clean, modern, and the barbers are top-notch. My go-to place.",
  },
  {
    author: "Linda P.",
    rating: 5,
    text: "My son loves his new haircut! Thank you for the patience and care.",
  },
  {
    author: "Chris B.",
    rating: 4,
    text: "Quick service and great results. Booking online is a breeze.",
  }
];

let googleReviewIndex = 0;
const reviewsPerSlide = 3;
let autoSlideInterval = null;

function renderGoogleReview(idx, animate = true, direction = 1) {
  const total = googleReviews.length;
  const carousel = document.getElementById('google-reviews-carousel');
  if (!carousel) return;

  // Build slide HTML
  let html = '<div class="flex w-full">';
  for (let i = 0; i < reviewsPerSlide; i++) {
    const review = googleReviews[(idx + i) % total];
    html += `
      <div class="bg-gray-800 p-6 rounded-lg text-center min-w-0 w-1/3 mx-2 flex-shrink-0">
        <div class="flex justify-center mb-2 text-amber-400">
          ${'<i class="fas fa-star"></i>'.repeat(Math.floor(review.rating))}
          ${review.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
        </div>
        <p class="text-gray-300 mb-4">"${review.text}"</p>
        <div class="font-bold">${review.author}</div>
        <div class="text-xs text-gray-400 mt-1">via Google Reviews</div>
      </div>
    `;
  }
  html += '</div>';

  // Animate out old slide, then animate in new slide
  if (animate && carousel.firstChild) {
    const oldSlide = carousel.firstChild;
    oldSlide.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s';
    oldSlide.style.transform = `translateX(${direction * -100}%)`;
    oldSlide.style.opacity = 0;
    setTimeout(() => {
      carousel.innerHTML = html;
      const newSlide = carousel.firstChild;
      newSlide.style.transform = `translateX(${direction * 100}%)`;
      newSlide.style.opacity = 0;
      setTimeout(() => {
        newSlide.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s';
        newSlide.style.transform = 'translateX(0)';
        newSlide.style.opacity = 1;
      }, 10);
    }, 500);
  } else {
    carousel.innerHTML = html;
    const newSlide = carousel.firstChild;
    if (newSlide) {
      newSlide.style.transition = 'none';
      newSlide.style.transform = 'translateX(0)';
      newSlide.style.opacity = 1;
    }
  }
}

function nextReview() {
  googleReviewIndex = (googleReviewIndex + reviewsPerSlide) % googleReviews.length;
  renderGoogleReview(googleReviewIndex, true, 1);
}
function prevReview() {
  googleReviewIndex = (googleReviewIndex - reviewsPerSlide + googleReviews.length) % googleReviews.length;
  renderGoogleReview(googleReviewIndex, true, -1);
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(nextReview, 5000);
}
function stopAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
}

document.addEventListener('DOMContentLoaded', function() {
  // Footer year
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Google Reviews Carousel
  renderGoogleReview(googleReviewIndex, false);

  const prevBtn = document.getElementById('google-review-prev');
  const nextBtn = document.getElementById('google-review-next');
  if (prevBtn) prevBtn.onclick = prevReview;
  if (nextBtn) nextBtn.onclick = nextReview;

  // Mouse drag/slide support
  const carousel = document.getElementById('google-reviews-carousel');
  let isDown = false;
  let startX = 0;

  if (carousel) {
    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.classList.add('cursor-grabbing');
      startX = e.pageX;
      stopAutoSlide();
    });
    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.classList.remove('cursor-grabbing');
      startAutoSlide();
    });
    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.classList.remove('cursor-grabbing');
      startAutoSlide();
    });
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX;
      if (x - startX > 50) {
        prevReview();
        isDown = false;
      } else if (x - startX < -50) {
        nextReview();
        isDown = false;
      }
    });

    // Touch support for mobile
    let touchStartX = null;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoSlide();
    });
    carousel.addEventListener('touchend', () => {
      startAutoSlide();
      touchStartX = null;
    });
    carousel.addEventListener('touchmove', (e) => {
      if (touchStartX === null) return;
      const touchX = e.touches[0].clientX;
      if (touchX - touchStartX > 50) {
        prevReview();
        touchStartX = null;
      } else if (touchX - touchStartX < -50) {
        nextReview();
        touchStartX = null;
      }
    });
  }

  startAutoSlide();
});
