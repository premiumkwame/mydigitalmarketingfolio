document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    }));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

/* =========================================
   OUTCOME IMAGE SLIDER
========================================= */

document.querySelectorAll('.outcome-slider').forEach(slider => {

    const slides = slider.querySelectorAll('.outcome-slide');
    const previousBtn = slider.querySelector('.outcome-prev');
    const nextBtn = slider.querySelector('.outcome-next');

    const currentCounter = slider.querySelector('.outcome-current');
    const totalCounter = slider.querySelector('.outcome-total');

    let currentIndex = 0;

    const totalSlides = slides.length;

    totalCounter.textContent = String(totalSlides).padStart(2, '0');

    function showSlide(index) {

        slides[currentIndex].classList.remove('active');

        currentIndex = (index + totalSlides) % totalSlides;

        slides[currentIndex].classList.add('active');

        currentCounter.textContent =
            String(currentIndex + 1).padStart(2, '0');

    }

    // Previous image
    previousBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });

    // Next image
    nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });

});
});