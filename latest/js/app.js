console.log('app.js loaded');

// Set current year in footer
const date = document.getElementById('date');
date.innerHTML = new Date().getFullYear();

// Toggle navbar
const navBtn = document.querySelector('.nav-btn');
const navLinks = document.querySelector('.nav-links');

if (navBtn && navLinks) {
  navBtn.addEventListener('click', function() {
    navLinks.classList.toggle('show-links');
  });
}

// Close navbar when clicking on links
const links = document.querySelectorAll('.nav-link');
links.forEach(function(link) {
  link.addEventListener('click', function() {
    if (navLinks) {
      navLinks.classList.remove('show-links');
    }
  });
});

// Toggle mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

// Close mobile menu when clicking on links
const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
});

// Smooth scrolling
const anchors = document.querySelectorAll('a[href^="#"]');
console.log('Found anchors:', anchors.length);

anchors.forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    // Skip if it's a recipe link
    if (this.closest('.recipe')) {
      console.log('Recipe link clicked');
      return;
    }
    
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Add animation on scroll
const animateOnScroll = function() {
  const elements = document.querySelectorAll('.recipes-list .recipe');
  console.log('Found recipe elements:', elements.length);
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

// Initialize animations
window.addEventListener('load', function() {
  console.log('Window loaded');
  // Add initial animation classes
  const recipes = document.querySelectorAll('.recipes-list .recipe');
  console.log('Found recipes:', recipes.length);
  
  recipes.forEach((recipe, index) => {
    recipe.style.opacity = '0';
    recipe.style.transform = 'translateY(20px)';
    recipe.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    // Add click event listener directly to recipe links
    recipe.addEventListener('click', function(e) {
      console.log('Recipe clicked:', this.href);
      // Allow the link to work normally
    });
  });
  
  // Trigger animations on load
  setTimeout(animateOnScroll, 100);
  
  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);
});

// Form submission with validation
const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    if (!email) return;
    
    // Here you would normally send the data to your server
    // For demonstration, we'll just show an alert
    alert('Thank you for subscribing!');
    this.reset();
  });
}