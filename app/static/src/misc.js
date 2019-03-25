import $ from "jquery";

// let img = document.createElement('img');
// img.src = "https://openclipart.org/download/261339/big-rocket-blast-off-fat.svg";
// img.style.height = "50px";
// img.style.width = "auto";

// $(".link").hover(function () {
//     this.prepend(img);
// }, function () {
//     this.removeChild(img);
// });

let _csrf_token = document.getElementsByName("_csrf_token").valueOf()[0].value;

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", _csrf_token);
        }
    }
});

// enable bootstrap tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
