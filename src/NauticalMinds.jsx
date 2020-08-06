import React from 'react';

import AudioBar from './components/AudioBar.jsx';
import UserPanel from './components/UserPanel.jsx';
import ModalForm from './components/ModalForm.jsx';
import About from './components/About.jsx';
import Content from './components/Content.jsx';


var SRC_LIST = [
  {
    src: "/music/nautical_minds_ep/gotta_let_you_know.wav",
    downloadUrl: "/music/nautical_minds_ep/gotta_let_you_know.mp3?download=True",
    title: "Nautical Minds - Gotta Let You Know",
    infoUrl: "/info?song_id=1"
  },
  {
    src: "/music/nautical_minds_ep/aint_gotta_care.wav",
    downloadUrl: "/music/nautical_minds_ep/aint_gotta_care.mp3?download=True",
    title: "Nautical Minds - Ain't Gotta Care",
    infoUrl: "/info?song_id=2"
  },
  {
    src: "/music/nautical_minds_ep/funk1.wav",
    downloadUrl: "/music/nautical_minds_ep/funk1.mp3?download=True",
    title: "Nautical Minds - Funk 1 (ft. B.I.G. Jay)",
    infoUrl: "/info?song_id=3"
  },
  {
    src: "/music/nautical_minds_ep/spacy_stacy.wav",
    downloadUrl: "/music/nautical_minds_ep/spacy_stacy.mp3?download=True",
    title: "Nautical Minds - Spacy Stacy",
    infoUrl: "/info?song_id=4"
  },
  {
    src: "/music/nautical_minds_ep/sidestreet_robbery.wav",
    downloadUrl: "/music/nautical_minds_ep/sidestreet_robbery.mp3?download=True",
    title: "Nautical Minds - Side Street Robbery",
    infoUrl: "/info?song_id=5"
  }, 
  {
    src: "/music/nautical_minds_ep/off_the_clock.wav",
    downloadUrl: "/music/nautical_minds_ep/off_the_clock.mp3?download=True",
    title: "Nautical Minds - Off The Clock",
    infoUrl: "/info?song_id=6"
  },
];

var payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        orderComplete(result.paymentIntent.id);
      }
    });
};

/* ------- UI helpers ------- */
// Shows a success message when the payment is complete
var orderComplete = function(paymentIntentId) {
  loading(false);
  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
};
// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};
// Show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#button-stripe").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text-stripe").classList.add("hidden");
  } else {
    document.querySelector("#button-stripe").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text-stripe").classList.remove("hidden");
  }
};


export default class NauticalMinds extends React.Component {
  constructor(props){
    super(props);
    let timestamp = Math.round(new Date().getTime());
    this.id = {
      stripeCard: `stripe_card_${timestamp}`,
      
    }
    this.joinLoginOnClick = this.joinLoginOnClick.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.aboutOnClick = this.aboutOnClick.bind(this);
    this.setLogin = this.setLogin.bind(this);
    this.setJoin = this.setJoin.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onJoin = this.onJoin.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onProfile = this.onProfile.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.joinOnClick = this.joinOnClick.bind(this);
    this.loginOnClick = this.loginOnClick.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.initStripe = this.initStripe.bind(this);
    
    this.state = {
      userLoggedIn: document.getElementById("_user_authenticated").value === "True" ? true : false,
      userEmail: document.getElementById("_user_email").value,
      isModalOpen: false,
      dropdownOpen: false,
      modalForm: "Join",
      altOnClick: this.setLogin,
      joinLoginText: "Join",
      joinLoginUrl: "/join"
    }
  }
  joinLoginOnClick(clickEvent){
    clickEvent.preventDefault();
    this.setState(()=>{
      return {
        modalForm: this.state.joinLoginText,
        isModalOpen: !this.state.isModalOpen
      }
    });
  }
  joinOnClick(clickEvent){
    clickEvent.preventDefault();
    this.setState(()=>{
      return {
        modalForm: "Join",
        isModalOpen: !this.state.isModalOpen
      }
    });
  }
  loginOnClick(clickEvent){
    clickEvent.preventDefault();
    this.setState(()=>{
      return {
        modalForm: "Login",
        isModalOpen: !this.state.isModalOpen
      }
    });
  }
  aboutOnClick(e){
    e.preventDefault();
    this.setState(()=>{
      return {
        modalForm: "About",
        isModalOpen: true,
      }
    })
  }
  hideForm(){
    this.setState(()=>{
      return {
        isModalOpen: false
      }
    });
  }
  setLogin(e){
    e.preventDefault();
    this.setState(()=>{
      return {
        modalForm: "Login",
        altOnClick: this.setJoin,
        joinLoginText: "Login",
        joinLoginUrl: "/login"
      }
    });
  }
  setJoin(e){
    e.preventDefault();
    this.setState(()=>{
      return {
        modalForm: "Join",
        altOnClick: this.setLogin,
        joinLoginText: "Join",
        joinLoginUrl: "/join"
      }
    });
  }
  onLogin(){
    window.location = "/login"
    this.setState(()=>{
      return {
        isModalOpen: false,
      }
    })
  }

  onJoin(e){
    window.location = "/join";
    this.setState(()=>{
      return {
        isModalOpen: false,
      }
    })
  }
  toggleDropdown(){
    this.setState(()=>{
      return {
        dropdownOpen: !this.state.dropdownOpen
      }
    })
  }
  onProfile(){
    // todo: add profile form to ModalForm component
    this.setState(()=>{
      return {
        isModalOpen: true,
        modalForm: "Profile"
      }
    })
  }
  onLogout(){
    window.location = "/logout";
  }
  onDownload(){
    // this.initStripe();
    this.setState(()=>{
      return {
        isModalOpen: true,
        modalForm: "Tip"
      }
    })
  }
  initStripe(){
    this._STRIPE = Stripe("pk_test_IojXqALJX9MfvP9XP4CunfsE00LwC3HO3l");
    fetch("/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({amount: 100})
    })
    .then((result)=>{
      return result.json();
    })
    .then((data)=>{
      var elements = this._STRIPE.elements();
      var style = {
        base: {
          color: "#32325d",
          fontFamily: 'Arial, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#32325d"
          }
        },
        invalid: {
          fontFamily: 'Arial, sans-serif',
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };
      var card = elements.create("card", { style: style });
      // Stripe injects an iframe into the DOM
      card.mount("#card-element-stripe");
      card.on("change", function (event) {
          // Disable the Pay button if there are no card details in the Element
          // document.querySelector("#button-stripe").disabled = event.empty;
          // document.querySelector("#card-element-stripe").textContent = event.error ? event.error.message : "";
      });
      var form = document.querySelector("#payment-form-stripe");
      form.addEventListener("submit", (event)=>{
        event.preventDefault();
        // Complete payment when the submit button is clicked
        payWithCard(stripe, card, data.clientSecret);
      });
    });
  }
  render(){
    return (
      <div>
        <div style={{display: this.state.dropdownOpen ? "block" : "none"}} className="user-dropdown">
          <div className="flex-col">
            {/* <button className="user-container-item no-border" onClick={this.onProfile}>Profile</button> */}
            <button className="user-container-item no-border" onClick={this.onLogout}>Logout</button>
          </div>
        </div>
        <div className="header">
          <About onClick={this.aboutOnClick}/>
          <h1 style={{margin: "7.5px"}} id="nauticalMindsHeader">
            <a href="/" onClick={(e)=>e.preventDefault()}>Nautical Minds</a></h1>
          <UserPanel loggedIn={this.state.userLoggedIn}
            userEmail={this.state.userEmail}
            userOnClick={this.toggleDropdown}
            userIconInverted={this.state.dropdownOpen}
            joinOnClick={this.joinOnClick}
            loginOnClick={this.loginOnClick}
            joinLoginOnClick={this.joinLoginOnClick}
            joinLoginText={this.state.joinLoginText}
            joinLoginUrl={this.state.joinLoginUrl}/>
        </div>
        <Content userLoggedIn={this.state.userLoggedIn} joinLoginOnClick={this.joinLoginOnClick}/>       
        <ModalForm display={this.state.isModalOpen} 
          form={this.state.modalForm} 
          onLogin={this.onLogin}
          onJoin={this.onJoin}
          _STRIPE={this._STRIPE}
          tipMountCallback={this.initStripe}
          backdropOnClick={this.hideForm}
          altOnClick={this.state.altOnClick}/>
        <AudioBar src={SRC_LIST} id="audioBar" 
          // onDownload={this.onDownload}
          style={{visibility: this.state.userLoggedIn ? "visible" : "hidden"}}/>
      </div>
    )
  }
}
