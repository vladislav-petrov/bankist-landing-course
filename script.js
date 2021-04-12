'use strict';

// SELECTING ELEMENTS

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const navContainer = document.querySelector('.nav');
const operationsTabsContainer = document.querySelector('.operations__tab-container');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const imgsFeatures = document.querySelectorAll('img[data-src');
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const section3 = document.querySelector('#section--3');
const dotsContainer = document.querySelector('.dots');

// VARIABLES

// const section1Coords = section1.getBoundingClientRect();
let currentSlide = 0;

// FUNCTIONS

const openModal = function(event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHover = function(event) {
  if (!event.target.classList.contains('nav__link')) return;
  const siblings = event.target.closest('.nav').querySelectorAll('.nav__link');
  const logo = event.target.closest('.nav').querySelector('.nav__logo');

  siblings.forEach(element => {
    if (element === event.target) return;
    element.style.opacity = this;
  });

  logo.style.opacity = this;
}

const goToSlide = function(curSlide) {
  slides.forEach((slide, index) => slide.style.transform = `translateX(${100 * (index - curSlide)}%)`);
}

const nextSlide = function() {
  if (currentSlide === slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);

  document.querySelector('.dots__dot--active').classList.remove('dots__dot--active');
  document.querySelector(`.dots__dot[data-slide="${currentSlide}"]`).classList.add('dots__dot--active');
}

const prevSlide = function() {
  if (currentSlide === 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);

  document.querySelector('.dots__dot--active').classList.remove('dots__dot--active');
  document.querySelector(`.dots__dot[data-slide="${currentSlide}"]`).classList.add('dots__dot--active');
}

// EVENT LISTENERS

Array.from(btnsOpenModal).forEach(function(value) {
  value.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function(event) {
  // const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);
  // console.log(event.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // Scrolling
  // window.scrollTo(s1Coords.left + window.pageXOffset, s1Coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  section1.scrollIntoView({behavior: 'smooth'});
});

// navLinks.forEach(function(element) {
//   element.addEventListener('click', function(event) {
//     event.preventDefault();
//     document.querySelector(this.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
//   });
// });

// Event delegation:
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

navLinks.addEventListener('click', function(event) {
  event.preventDefault();

  if (event.target.classList.contains('nav__link') && event.target.getAttribute('href').includes('#section--')) {
    document.querySelector(event.target.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
  }
});

operationsTabsContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn') || event.target.parentElement.classList.contains('btn')) {
    const clickedButton = event.target.closest('.btn');
    document.querySelector('.operations__tab--active').classList.remove('operations__tab--active');
    document.querySelector('.operations__content--active').classList.remove('operations__content--active');
    clickedButton.classList.add('operations__tab--active');
    document.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add('operations__content--active');
  }
});

// Passing "argument" into handler
navContainer.addEventListener('mouseover', handleHover.bind(0.5));

navContainer.addEventListener('mouseout', handleHover.bind(1));

// window.addEventListener('scroll', function() {
//   if (window.pageYOffset > section1Coords.top) {
//     navContainer.classList.add('sticky');
//   } else {
//     navContainer.classList.remove('sticky');
//   }
// });

// INTERSECTION OBSERVER API

// Sticky nav

const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navContainer.classList.add('sticky');
  } else {
    navContainer.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0, rootMargin: `-${navContainer.getBoundingClientRect().height}px`});
headerObserver.observe(header);

// Reveal sections

const revealSection = function(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting && entry.target.classList.contains('section--hidden')) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
}

const sectionObserver = new IntersectionObserver(revealSection, {root: null, threshold: 0.15});

sections.forEach(function(section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images

const loagImg = function(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.setAttribute('src', entry.target.dataset.src);

    entry.target.addEventListener('load', function() {
      this.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }
}

const lazyImgObserver = new IntersectionObserver(loagImg, {root: null, threshold: 0.75, rootMargin: '200px'});

imgsFeatures.forEach(function(element) {
  lazyImgObserver.observe(element);
});

// Slider

goToSlide(currentSlide);

// Next slide
// currentSlide = 0: 0%, 100%, 200%
// currentSlide = 1: -100%, 0%, 100%
// currentSlide = 2: -200%, -100%, 0%

btnSliderRight.addEventListener('click', function() {
  nextSlide();
});

btnSliderLeft.addEventListener('click', function() {
  prevSlide();
});

// Slider with arrow keys

const switchSlide = function(event) {
  if (event.key === 'ArrowRight') {
    nextSlide();
  } else if (event.key === 'ArrowLeft') {
    prevSlide();
  }
}

const holdArrowKeysEvents = function(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    document.addEventListener('keydown', switchSlide);
  } else {
    document.removeEventListener('keydown', switchSlide);
  }
}

const sliderObserver = new IntersectionObserver(holdArrowKeysEvents, {root: null, threshold: 0.5});
sliderObserver.observe(section3);

// Dots in slider

const createDots = function() {
  slides.forEach(function(_, index) {
    const dot = document.createElement('button');
    dot.classList.add('dots__dot');
    dot.dataset.slide = `${index}`;
    if (Number(dot.dataset.slide) === currentSlide) dot.classList.add('dots__dot--active');
    dotsContainer.append(dot);
  });
}

createDots();

dotsContainer.addEventListener('click', function(event) {
  if (!event.target.classList.contains('dots__dot')) return;
  if (event.target.classList.contains('dots__dot--active')) return;
  currentSlide = Number(event.target.dataset.slide);
  document.querySelector('.dots__dot--active').classList.remove('dots__dot--active');
  event.target.classList.add('dots__dot--active');
  goToSlide(currentSlide);
});

