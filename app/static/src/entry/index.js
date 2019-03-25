import '../misc';
import $ from 'jquery';

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
            let container = document.getElementById("form_container");
            let alert = document.createElement("div");
            alert.id = "alert_1";

            alert.className = "my-auto mx-auto";
            alert.style.backgroundColor = "rgba(0,0,0,0.5)";
            alert.innerHTML = "Thanks! We'll be in touch :)";

            container.appendChild(alert);
            // alert.addEventListener('click', () => {
            //     document.removeChild(alert);
            // });
            setTimeout(()=>{
                //formContainer.removeChild(alert);
                $("#alert_1").fadeOut('fast');
            }, 5000);
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
