import $ from "jquery";

let _csrf_token = document.getElementsByName("_csrf_token").valueOf()[0].value;

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", _csrf_token);
        }
    }
});