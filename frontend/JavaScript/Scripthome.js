document.getElementById("logo-nav").addEventListener("click", function () {
    window.scrollTo({
        top:0,
        behavior: "smooth"
    });
});

document.getElementById("logo").addEventListener("click", function () {
    window.scrollTo({
        top:0,
        behavior: "smooth"
    });
});

let index = 1;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const container = document.querySelector('.carousel-slides');

container.style.transform = `translateX(-${index *100}%)`;

function showSlide(i){
    slides.forEach((slide, idx) =>{
        slide.classList.remove('active');
        dots[idx].classList.remove('active');
        const caption = slide.querySelector('.caption');
        if(caption) caption.classList.remove('animate');
    });
    slides[i].classList.add('active');
    dots[i].classList.add('active');
    container.style.transform = `translateX(${-i *100}%)`;

    const activeCaption = slides[i].querySelector('.caption');
    if(activeCaption){
        void activeCaption.offsetWidth;
        activeCaption.classList.add('animate');
    }
}

function nextSlide(){
    if (index >= slides.length -1) return;
    index++;
    updateSlide();
}

function prevSlide(){
    if (index <= 0) return;
    index--;
    updateSlide();
}

nextBtn.addEventListener('click', () =>{
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', () =>{
    prevSlide();
    resetAutoSlide();
});

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        index = i+ 1;
        updateSlide();
        resetAutoSlide();
    });
});

function resetAutoSlide(){
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2000);
}

let autoSlide = setInterval(nextSlide, 2000);

function updateSlide(){
    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
}

function updateDots(){
    dots.forEach(dot => dot.classList.remove('active'));
    let realIndex = index - 1;
    if(realIndex === -1) realIndex = dots.length - 1;
    if(realIndex === dots.length) realIndex = 0;
    dots[realIndex].classList.add('active');
}

function goToSlide(i){
    index = i + 1;
    updateSlide();
}

container.addEventListener('transitionend', () =>{
    if(slides[index].style.backgroundImage === slides[0].style.backgroundImage){
        container.style.transition = 'none';
        index = slides.length - 2;
        container.style.transform = `translateX(-${index * 100}%)`;
    }
    if(slides[index].style.backgroundImage === slides[slides.length -1].style.backgroundImage){
        container.style.transition = 'none';
        index = 1;
        container.style.transform = `translateX(-${index * 100}%)`;
    }
});

window.addEventListener('load', () =>{
    container.style.transform = `translateX(-${index * 100}%)`;
});

let startX = 0;
let isDragging = false;
let isTouch = false;

container.addEventListener('touchstart', e =>{
    isTouch = true;
    startX = e.touches[0].clientX;
    isDragging = true;
});
container.addEventListener('touchmove', e => {
    if(!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    if(Math.abs(diff)>50){
        if(diff > 0) prevSlide();
        else nextSlide();
        isDragging = false;
        resetAutoSlide();
    }
});
container.addEventListener('touchend', () =>{
    isDragging = false;
})

container.addEventListener('mousedown', (e) =>{
    isTouch = false;
    startX = e.clientX;
    isDragging = true;
});

container.addEventListener('mousemove', (e) => {
    if(!isDragging || isTouch) return;
    const diff = e.clientX - startX;
    if(Math.abs(diff) > 50){
        if(diff > 0) prevSlide();
        else nextSlide();
        isDragging = false;
        resetAutoSlide();
    }
});
container.addEventListener('mouseup', () =>{
    isDragging = false;
});