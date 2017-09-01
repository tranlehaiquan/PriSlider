// ToDOLIST
// Fix bug for nav button
class slider {
  constructor() {
    // All Element
    this.sliderParent = document.querySelector(".slider");    
    this.sliderItems = document.querySelector(".slider__items");
    this.sliderItem = document.querySelectorAll(".slider__item");
    this.dotsWrapper = document.querySelector(".slider__dots");
    this.dots;
    this.btnNav;

    // All property of slider
    this.currentSlider = 0;
    this.sliderWidth;
    this.startPoint = -1;
    this.distancePoint = 0;
    this.currentTranslate;

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
    this.onTranformEnd = this.onTranformEnd.bind(this);

    this.init = this.init.bind(this);

    this.init();
  }

  renderSliderWrapper() {
    //Calc width for sliderItems and add it
    this.sliderWidth = this.sliderItems.offsetWidth;
    const totalParentWidth = this.sliderWidth * this.sliderItem.length;
    this.sliderItems.style.width = `${totalParentWidth}px`;
    this.sliderItems.style.transform = `translateX(${this.currentSlider * this.sliderWidth}px)`;
    //Add width for every slider__Item
    Array.prototype.forEach.call( this.sliderItem, (item, index) => {
      item.style.width = `${this.sliderWidth}px`;
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
    // Get toslider's number, and toTransition pixel
    let toSlider = Number.parseInt(eventEl.target.getAttribute("data-slide"));
    let toTransition = -(this.sliderWidth * toSlider);

    this.sliderItems.style.transform = `translate(${toTransition}px)`;
    this.sliderItems.style.transition = `.3s transform`;
    this.sliderItems.addEventListener("transitionend", this.onTranformEnd);

    this.currentSlider = toSlider;
    // update dots style
    this.updateDots();
    // update nav
    this.updateNav();
  }

  changeSliderTo(toSlider) {
    let toTransition = -(this.sliderWidth * toSlider);

    this.sliderItems.style.transform = `translate(${toTransition}px)`;
    this.sliderItems.style.transition = `.3s transform`;
    this.sliderItems.addEventListener("transitionend", this.onTranformEnd);

    this.currentSlider = toSlider;
    // update dots style
    this.updateDots();
    // update nav
    this.updateNav();
  } 

  onPress(event) {
    this.startPoint = event.clientX;
    this.distancePoint = event.clientX;
  }
  
  onMove(event) {
    if( this.startPoint > 0 ) {
      // At first slider item, midde, the end
      if( this.currentSlider === 0 ) {
        this.distancePoint = Math.min(0, event.clientX - this.startPoint);
      } else if ( this.currentSlider === (this.sliderItem.length - 1) ) {
        this.distancePoint = Math.max(0, event.clientX - this.startPoint);
      } else {
        this.distancePoint = event.clientX - this.startPoint;
      }

      // Add new translate
      this.currentTranslate = -(this.sliderWidth * this.currentSlider)
      this.sliderItems.style.transform = `translateX(${this.distancePoint + this.currentTranslate}px)`;
    }
  }

  onLeave(event) {
    if ( this.startPoint !== -1 ) {
      // Did user drag enough far? 
      if( Math.abs(this.distancePoint) > (this.sliderParent.offsetWidth / 6) ) {
        if ( this.distancePoint > 0 )
          this.changeSliderTo(this.currentSlider - 1);
        if ( this.distancePoint < 0 )
          this.changeSliderTo(this.currentSlider + 1);
      } else if( this.distancePoint !== 0 ) {
        this.distancePoint = 0;
        this.sliderItems.style.transform = `translateX(${this.currentTranslate}px)`;
        this.sliderItems.style.transition = `.3s transform`;
        // remove transtion when transfrom end
        this.sliderItems.addEventListener("transitionend", this.onTranformEnd);
      }
      // Reset start
      this.startPoint = -1;
    }
  }

  onTranformEnd() {
    this.sliderItems.style.transition = `0s transform`;
    this.sliderItems.removeEventListener("transitionend", this.onTranformEnd);
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
    this.sliderParent.addEventListener("mousedown", this.onPress);
    this.sliderParent.addEventListener("mousemove", this.onMove);
    this.sliderParent.addEventListener("mouseup", this.onLeave);
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