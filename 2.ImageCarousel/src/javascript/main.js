const carouselUl = document.querySelector(".carousel__list");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");

function moveNext(){
    let items = document.querySelectorAll(".carousel__item");

    if(items.length > 1) {
        let currentItem = document.querySelector(".now");
        let next = currentItem.nextElementSibling;

        carouselUl.appendChild(currentItem);
        currentItem.classList.remove('now');
        next.classList.add('now');
    }

    changeTransform();
}

function movePrev(){
    let items = document.querySelectorAll(".carousel__item");
    let currentItem = document.querySelector(".now");
    let lastItem = items[items.length - 1];
    let prev;

    for(let i = 0; i < items.length; i++){
        if(items[i].classList.contains("now")){
            prev = items[i-1];
        }
    }

    if(items.length > 1) {
        if(currentItem){
            if(prev){
                carouselUl.prepend(prev);
                currentItem.classList.remove("now");
                prev.classList.add('now');
            } else {
                carouselUl.prepend(lastItem);
                currentItem.classList.remove("now");
                lastItem.classList.add('now');
            }
        } else {
            lastItem.classList.add('now');
        }
    }

    changeTransform();
}

nextButton.addEventListener("click", moveNext);
prevButton.addEventListener("click", movePrev);

function changeTransform(){
    let items = document.querySelectorAll(".carousel__item");

    items.forEach((e, i) => {
        let degree = 360/items.length;
        if(items.length > 1) {
            if(i == 0) {
                e.style.transform = "rotateY(0deg) translateZ(250px)";
            } else {
                e.style.transform = `rotateY(${degree*i}deg) translateZ(250px) rotateY(-${degree*i}deg)`;
            }
        }
        if(items.length >= 5) {
            e.style.webkitBoxReflect = "below 20px linear-gradient(transparent 45%, rgba(255, 255, 255, 0.25))";
            if(i == 0) {
                e.style.transform = "rotateY(0deg) translateZ(250px)";
            } else if(i == 1) {
                e.style.transform = `rotateY(72deg) translateZ(250px) rotateY(-72deg)`;
            } else if(i == 2) {
                e.style.transform = `rotateY(144deg) translateZ(250px) rotateY(-144deg) translateX(400px)`;
            } else if(i == items.length-2) {
                e.style.transform = `rotateY(216deg) translateZ(250px) rotateY(-216deg) translateX(-400px)`;
            } else if(i == items.length-1) {
                e.style.transform = `rotateY(288deg) translateZ(250px) rotateY(-288deg)`;
            } else {
                e.style.transform = `rotateY(${degree*i}deg) translateZ(250px) rotateY(-${degree*i}deg)`;
                e.style.webkitBoxReflect = "below 20px linear-gradient(transparent, transparent)";
            }
        }
    });
}

// 이미지 로드 후 삽입
function createTag(url) {
    let list = document.createElement("li");
    let img = document.createElement("img");
    list.setAttribute("class", "carousel__item");
    img.src = url;
    list.appendChild(img);
    let items = document.querySelectorAll(".carousel__item");

    if(items.length < 1) {
        list.classList.add("now");
    }

    return list;
}

function uploadImg(value) {
    if(value.files) {
        let reader = new FileReader();

        reader.onload = e => {
            let imgUrl = e.target.result;
            carouselUl.appendChild(createTag(imgUrl));
            changeTransform();
        };
        reader.readAsDataURL(value.files[0]);
    }
}

const imageInput = document.querySelector("#image-upload__input");

imageInput.addEventListener("change", e => {
    uploadImg(e.target);
});

window.onload = function() {
    changeTransform();
}