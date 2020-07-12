import React from 'react';

import AudioBar from './components/AudioBar.jsx';
import UserPanel from './components/UserPanel.jsx';
import ModalForm from './components/ModalForm.jsx';
import About from './components/About.jsx';

var SRC_LIST = [
  {
    src: "/music/nautical_minds_ep/gotta_let_you_know.mp3",
    title: "Nautical Minds - Gotta Let You Know",
    infoUrl: "/info?song_id=1"
  },
  {
    src: "/music/nautical_minds_ep/aint_gotta_care.mp3",
    title: "Nautical Minds - Ain't Gotta Care",
    infoUrl: "/info?song_id=2"
  },
  {
    src: "/music/nautical_minds_ep/funk1.mp3",
    title: "Nautical Minds - Funk 1 (ft. B.I.G. Jay)",
    infoUrl: "/info?song_id=3"
  },
  {
    src: "/music/nautical_minds_ep/spacy_stacy.mp3",
    title: "Nautical Minds - Spacy Stacy",
    infoUrl: "/info?song_id=4"
  },
  {
    src: "/music/nautical_minds_ep/sidestreet_robbery.mp3",
    title: "Nautical Minds - Side Street Robbery",
    infoUrl: "/info?song_id=5"
  }, 
  {
    src: "/music/nautical_minds_ep/off_the_clock.mp3",
    title: "Nautical Minds - Off The Clock",
    infoUrl: "/info?song_id=6"
  },
];

export default class NauticalMinds extends React.Component {
  constructor(props){
    super(props);
    
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
    window.location = "/login";
    // this.setState(()=>{
    //   return {
    //     isModalOpen: false,
    //     userLoggedIn: true,
    //   }
    // })
  }
  onJoin(){
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
            joinLoginOnClick={this.joinLoginOnClick} 
            joinLoginText={this.state.joinLoginText}
            joinLoginUrl={this.state.joinLoginUrl}/>
        </div>
        <div className="content-container"/>
        <ModalForm display={this.state.isModalOpen} 
          form={this.state.modalForm} 
          onLogin={this.onLogin}
          onJoin={this.onJoin}
          backdropOnClick={this.hideForm}
          altOnClick={this.state.altOnClick}/>
        <AudioBar src={SRC_LIST} id="audioBar" style={{visibility: this.state.userLoggedIn ? "visible" : "hidden"}}/>
      </div>
    )
  }
}