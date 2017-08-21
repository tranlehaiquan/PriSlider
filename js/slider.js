class slider {
  constructor() {
    this.sliderItem = document.querySelectorAll(".slider__item");
    this.dotsWrapper = document.querySelector(".slider__dots");
    this.dots;
    this.currentSlider = 0;
    this.navButtonWrapper = document.querySelector(".slider__nav");
    this.btnNav;

    this.renderDots = this.renderDots.bind(this);
    this.updateDots = this.updateDots.bind(this);
    this.renderNav = this.renderNav.bind(this);
    this.updateNav = this.updateNav.bind(this);
    this.changeSlider = this.changeSlider.bind(this);

    this.init = this.init.bind(this);

    this.init();
  }

  renderDots() {
    const dotsNumber = this.sliderItem.length;
    let dots = [];

    for( let x = 0; x < dotsNumber; x++ ) {
      const classForActiveDot = (x === this.currentSlider) ? "slider__dot--active" : '';
      const dot = `<div class="slider__dot ${classForActiveDot}" data-slide=${x}></div>`;
      dots.push(dot);
    }
    // Add dots
    this.dotsWrapper.innerHTML = dots.join("");
    // get all dot and addEventListener
    this.dots = document.querySelectorAll(".slider__dot");
  }

  updateDots() {
    Array.prototype.forEach.call(this.dots, (dot, index) => {
      if(index === this.currentSlider) {
        dot.classList.add("slider__dot--active");
      } else {
        dot.classList.remove("slider__dot--active");
      }
    });
  }

  renderNav() {
    const classOfPreButton = 'slider__button slider__button--previous js-btnNav';
    const classOfNextButton = 'slider__button slider__button--next js-btnNav';

    const prevButton = this.currentSlider === 0 
      ? `<div class="${classOfPreButton} slider__button--disable" ></div>`
      : `<div class="${classOfPreButton}" data-slide=${this.currentSlider - 1} ></div>` ;
    const nextButton = this.currentSlider === (this.sliderItem.length - 1)
      ? `<div class="${classOfNextButton} slider__button--disable"></div>`
      : `<div class="${classOfNextButton}" data-slide=${this.currentSlider + 1}></div>`;
    this.navButtonWrapper.innerHTML = prevButton.concat(nextButton);

    this.btnNav = document.querySelectorAll(".js-btnNav");
  }

  updateNav() {
    let prevButton = this.btnNav[0];
    let nextButton = this.btnNav[1];

    if( this.currentSlider === 0 ) {
      prevButton.setAttribute("data-slide", "");
      prevButton.classList.add("slider__button--disable");
    } else {
      prevButton.setAttribute("data-slide", this.currentSlider - 1);
      prevButton.classList.remove("slider__button--disable");
    }

    if( this.currentSlider === (this.sliderItem.length - 1) ) {
      nextButton.setAttribute("data-slide", "");
      nextButton.classList.add("slider__button--disable");
    } else {
      nextButton.setAttribute("data-slide", this.currentSlider + 1);
      nextButton.classList.remove("slider__button--disable");
    }
  }

  changeSlider(eventEl) {
    function onFadeInEnd() {
      domToSlider.classList.remove("slider__item--fadeIn");
      domCurrentSlider.classList.remove("slider__item--fadeOut")
    }
    // get current slider
    let domCurrentSlider = this.sliderItem[this.currentSlider];
    // get to slider
    let toSlider = Number.parseInt(eventEl.target.getAttribute("data-slide"));
    let domToSlider = this.sliderItem[toSlider];
    // add and remove style active of slider item
    domToSlider.classList.add("slider__item--fadeIn", "slider__item--active");
    domToSlider.addEventListener("animationend", onFadeInEnd);

    domCurrentSlider.classList.add("slider__item--fadeOut");
    domCurrentSlider.classList.remove("slider__item--active");
    
    this.currentSlider = toSlider;
    // update dots style
    this.updateDots();
    // update nav
    this.updateNav();

  }

  addEventListeners() {
    // Add event for dots
    Array.prototype.forEach.call(this.dots, (item) => {
      item.addEventListener('click', this.changeSlider);
    });
    // Add event for nav button
    Array.prototype.forEach.call(this.btnNav, (item) => {
      item.addEventListener('click', this.changeSlider);
    });
  } 
  
  init() {
    // Render dots
    this.renderDots();
    // Render nav button
    this.renderNav()
    // Add event
    this.addEventListeners();
  }
}

new slider;