class slider {
  constructor() {
    // All Element
    this.sliderParentItem = document.querySelector(".slider__items");
    this.sliderItem = document.querySelectorAll(".slider__item");
    this.dotsWrapper = document.querySelector(".slider__dots");
    this.dots;
    this.btnNav;

    // All property of slider
    this.currentSlider = 0;
    this.startPoint = 0;
    this.currentPoint = 0;

    // All event
    this.renderSliderWrapper = this.renderSliderWrapper.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.updateDots = this.updateDots.bind(this);
    this.renderNav = this.renderNav.bind(this);
    this.updateNav = this.updateNav.bind(this);
    this.changeSlider = this.changeSlider.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);

    this.init = this.init.bind(this);

    this.init();
  }

  renderSliderWrapper() {
    //Calc width for sliderParentItem and add it
    const widthItem = this.sliderParentItem.offsetWidth;
    const totalParentWidth = widthItem * this.sliderItem.length;
    this.sliderParentItem.style.width = `${totalParentWidth}px`;
    this.sliderParentItem.style.transform = `translateX(${this.currentSlider * widthItem}px)`;
    //Add width for every slider__Item
    Array.prototype.forEach.call( this.sliderItem, (item, index) => {
      item.style.width = `${widthItem}px`;
    });
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
    let navButtonWrapper = document.querySelector(".slider__nav");
    const classOfPreButton = 'slider__button slider__button--previous js-btnNav';
    const classOfNextButton = 'slider__button slider__button--next js-btnNav';

    const prevButton = this.currentSlider === 0 
      ? `<div class="${classOfPreButton} slider__button--disable" ></div>`
      : `<div class="${classOfPreButton}" data-slide=${this.currentSlider - 1} ></div>` ;

    const nextButton = this.currentSlider === (this.sliderItem.length - 1)
      ? `<div class="${classOfNextButton} slider__button--disable"></div>`
      : `<div class="${classOfNextButton}" data-slide=${this.currentSlider + 1}></div>`;

    navButtonWrapper.innerHTML = prevButton.concat(nextButton);

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

  onPress(event) {
    this.startPoint = event.offsetX;
    this.currentPoint = event.offsetX;
  }
  
  onMove(event) {
    if( this.startPoint > 0 ) {
      if( this.currentSlider = 0 ) {
        this.currentPoint = Math.max(0, event.offsetX - this.startPoint);
      } else if ( this.currentSlider === (this.sliderItem.length - 1) ) {
        this.currentPoint = Math.min(0, event.offsetX - this.startPoint);
      } else {
        this.currentPoint = event.offsetX - this.startPoint;
      }
      console.log(this.currentPoint);
      this.sliderParentItem.style.transform = `translateX(${this.currentPoint}px)`;
    }
  }

  onLeave(event) {
    this.startPoint = -1;
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
    // Add event when user mouse down/move/up
    this.sliderParentItem.addEventListener("mousedown", this.onPress);
    this.sliderParentItem.addEventListener("mousemove", this.onMove);
    this.sliderParentItem.addEventListener("mouseup", this.onLeave);
  } 
  
  init() {
    // Render slide
    this.renderSliderWrapper();
    // Render dots
    this.renderDots();
    // Render nav button
    this.renderNav()
    // Add event
    this.addEventListeners();
  }
}

new slider;