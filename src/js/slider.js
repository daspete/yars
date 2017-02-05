class Slider {
    constructor(settings){
        this.settings = settings;

        this.DOM = {
            slider: document.querySelector(settings.slider),
        };
        this.DOM.container = this.DOM.slider.querySelector(settings.container);
        this.DOM.content = this.DOM.container.querySelector(settings.content);
        this.DOM.thumbnailsContainer = this.DOM.container.querySelector(settings.thumbnailsContainer);
        this.DOM.thumbnailsContent = this.DOM.thumbnailsContainer.querySelector(settings.thumbnailsContent);
        this.DOM.thumbnails = [];
        this.DOM.nextSlideButton = this.DOM.container.querySelector('.slider-navigation--next');
        this.DOM.prevSlideButton = this.DOM.container.querySelector('.slider-navigation--prev');
        this.DOM.slides = [].map.call(this.DOM.container.querySelectorAll('img'), function(slide){ return slide; });
        this.DOM.sliderImages = [];

        this.images = this.DOM.slides.map(function(slide){ return slide.getAttribute('src'); });

        this.currentImageIndex = -1;
        this.currentSliderContent = undefined;
        
        this.DOM.slider.onclick = function(e){
            if(e.target !== this.DOM.slider) return;
            this.DOM.slider.classList.remove('slider-open');
        }.bind(this);

        this.DOM.nextSlideButton.onclick = function(e){
            if(this.currentImageIndex + 1 >= this.images.length) return;
            this.SlideTo(this.currentImageIndex + 1);
        }.bind(this);

        this.DOM.prevSlideButton.onclick = function(e){
            if(this.currentImageIndex - 1 < 0) return;
            this.SlideTo(this.currentImageIndex - 1);
        }.bind(this);

        this.CreateThumbnails();

        this.DOM.slider.classList.add('slider-open');
        
        this.SlideTo(0);
    }

    CreateThumbnails(){
        this.DOM.thumbnails = this.images.map(function(src, index){
            return this.AddThumbnail(src, index);
        }.bind(this));

        this.DOM.thumbnailsContent.style.width = (this.DOM.thumbnails.length * (this.settings.thumbnailWidth + this.settings.thumbnailMargin)) + 'px';
    }

    AddThumbnail(src, index){
        var thumbnail = document.createElement('button');
        thumbnail.setAttribute('data-id', index);
        thumbnail.style.backgroundImage = 'url(' + src + ')';
        thumbnail.onclick = this.OnThumbnailClick.bind(this);
        
        this.DOM.thumbnailsContent.appendChild(thumbnail);

        return thumbnail;
    }

    OnThumbnailClick(e){
        var currentImageIndex = parseInt(e.target.getAttribute('data-id'));
        
        this.SlideTo(currentImageIndex);
    }

    SlideTo(currentImageIndex){
        if(this.currentImageIndex === currentImageIndex) return;

        if(this.currentImageIndex >= 0)
            this.DOM.thumbnails[this.currentImageIndex].classList.remove('active');

        if(this.DOM.sliderImages.length >= 10){
            this.DOM.sliderImages[0].parentNode.removeChild(this.DOM.sliderImages[0]);
            this.DOM.sliderImages.splice(0, 1);
        }

        if(this.DOM.sliderImages.length > 0){
            this.DOM.sliderImages[this.DOM.sliderImages.length - 1].classList.add('slide-fade-out');
        }

        var currentSliderContent = document.createElement('div');
        currentSliderContent.classList.add('slider-content');
        currentSliderContent.classList.add('slider-content--next');

        if(this.currentImageIndex > currentImageIndex){
            currentSliderContent.classList.add('slide-from-left');
        }else{
            currentSliderContent.classList.add('slide-from-right');
        }

        currentSliderContent.style.backgroundImage = 'url(' + this.images[currentImageIndex] + ')';
        this.DOM.container.appendChild(currentSliderContent);

        this.DOM.sliderImages.push(currentSliderContent);
        this.currentImageIndex = currentImageIndex;

        this.DOM.thumbnails[this.currentImageIndex].classList.add('active');
        var thumbWidth = this.settings.thumbnailWidth + this.settings.thumbnailMargin;
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0];

        var thumbCount = Math.floor(windowWidth / thumbWidth) - 1;

        this.DOM.thumbnailsContent.style.marginLeft = (Math.floor(thumbCount * 0.5) * thumbWidth - this.currentImageIndex * thumbWidth) + 'px';
    }
}

var slider = new Slider({
    slider: '.slider',
    container: '.slider-container',
    thumbnailsContainer: '.slider-thumbnails-container',
    thumbnailsContent: '.slider-thumbnails',
    content: '.slider-content',
    thumbnailWidth: 100,
    thumbnailMargin: 20
});