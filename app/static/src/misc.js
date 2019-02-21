import $ from "jquery";

let img = document.createElement('img');
img.src = "https://openclipart.org/download/261339/big-rocket-blast-off-fat.svg";
img.style.height = "50px";
img.style.width = "auto";

$(".link").hover(function () {
    this.prepend(img);
}, function () {
    this.removeChild(img);
});
