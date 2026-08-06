const slides = Array.from(document.querySelectorAll('.carousel__slide'));
const dotsContainer = document.querySelector('.carousel__dots');
const nextButton = document.querySelector('.carousel__button--next');
const prevButton = document.querySelector('.carousel__button--prev');
let currentIndex = 0;
let autoAdvance;

function createDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir a la imagen ${index + 1}`);
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentIndex);
    });

    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentIndex);
    });
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function startAutoAdvance() {
    stopAutoAdvance();
    autoAdvance = setInterval(nextSlide, 5000);
}

function stopAutoAdvance() {
    if (autoAdvance) {
        clearInterval(autoAdvance);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createDots();
    showSlide(currentIndex);
    startAutoAdvance();

    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoAdvance();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoAdvance();
    });

    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);
});
