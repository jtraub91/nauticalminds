import '../misc';
import $ from '../../node_modules/jquery';

var _csrf_token = document.getElementsByName("_csrf_token").valueOf()[0].value;

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", _csrf_token);
        }
    }
});

$("#subscribe_form").submit(function (e) {
    e.preventDefault();

    let form = {
        email: this.email.value,
    };

    $.ajax({
        type: "POST",
        url: "/",
        contentType: "application/json",
        data: JSON.stringify(form),
        dataType: "json",
        success: (response) => {
            let alert = document.createElement("div");
            alert.id = "subscribe_alert";
            alert.addEventListener('click', () => {
                this.removeChild(alert);
            });
            alert.className = "alert alert-primary text-center";
            alert.innerHTML = response.return_message;
            this.email.value = "";
            this.appendChild(alert);
        },
        error: (e) => {
            console.log("error");
            console.log(e);
            let alert = document.createElement("div");
            alert.className = "alert alert-danger text-center";
            alert.innerHTML = "An error occurred";
            this.appendChild(alert);
        },
    });
});
