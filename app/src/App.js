import React  from 'react';
import './App.css';
import {startGame, pauseGame, endGame, gui_state, gui_login, gui_register, gui_profile, gui_profile_load, handleStart, handleMove, handleEnd} from './controller.js';
import GameView from './components/game.js';
import InstructionView from './components/instruction.js';
import LoginView from './components/login.js';
import NavView from './components/nav.js';
import ProfileView from './components/profile.js';
import RegisterView from './components/register.js';
import StatsView from './components/stats.js';

class App extends React.Component {
  constructor(props) {
    
    super(props);
    this.state = {
      loggedIn: false,
      pageLogIn: true,
      pageRegister: false,
      pageGame: false,
      pageProfile: false, pageInstruction: false, pageStats: false,
      verifyLogin: false,
      verifyRegister: false

    };
    this.loginButtonClickHandler = this.loginButtonClickHandler.bind(this);
    this.registerButtonClickHandler = this.registerButtonClickHandler.bind(this);
    this.statsButtonClickHandler = this.statsButtonClickHandler.bind(this);
    this.logoutButtonClickHandler = this.logoutButtonClickHandler.bind(this);
    this.profileButtonClickHandler = this.profileButtonClickHandler.bind(this);
    this.instructionButtonClickHandler = this.instructionButtonClickHandler.bind(this);
    this.updateButtonClickHandler = this.updateButtonClickHandler.bind(this);
    this.playButtonClickHandler = this.playButtonClickHandler.bind(this);
    //this.controlButtonClickHandler = this.controlButtonClickHandler.bind(this);

    //this.game = <GameView controlClickHandler={this.controlButtonClickHandler}/>;
    if(this.props.log == true){
      console.log("construct")
      this.setState({loggedIn: true, pageLogIn: false, pageRegister: false, pageGame: true, pageProfile: false, pageInstruction: false, pageStats: false});

    }

  }
  loginButtonClickHandler(e){
    gui_login();
    /*if (login){
      this.setState({loggedIn: true, pageLogIn: false, pageRegister: false, pageGame: true, pageProfile: false, pageInstruction: false, pageStats: false});


    }*/

  }
  registerButtonClickHandler(e){
    if(this.state.pageLogIn){
      this.setState({pageLogIn: false, pageRegister: true, pageGame: false, pageProfile: false, pageInstruction: false, pageStats: false});

    }else if(this.state.pageRegister){
      //this.setState({pageLogIn: true, pageRegister: false, pageGame: false, pageProfile: false, pageInstruction: false, pageStats: false});
      gui_register();
      
    }
    

  }
  updateButtonClickHandler(e){
    gui_profile();
    this.setState({pageLogIn: false, pageRegister: false, pageGame: true, pageProfile: false, pageInstruction: false, pageStats: false});
    startGame();

  }
  logoutButtonClickHandler(e){
    this.setState({loggedIn: false, pageLogIn: true, pageRegister: false, pageGame: false, pageProfile: false, pageInstruction: false, pageStats: false, verifyLogin: false});
    //pauseGame();
    endGame();

  }

  profileButtonClickHandler(e){
    this.setState({pageLogIn: false, pageRegister: false, pageGame: false, pageProfile: true, pageInstruction: false, pageStats: false});
    pauseGame();
    gui_profile_load();

  }
  instructionButtonClickHandler(e){
    this.setState({pageLogIn: false, pageRegister: false, pageGame: false, pageProfile: false, pageInstruction: true, pageStats: false});
    pauseGame();

  }
  statsButtonClickHandler(e){
    this.setState({pageLogIn: false, pageRegister: false, pageGame: false, pageProfile: false, pageInstruction: false, pageStats: true});
    pauseGame();

  }
  playButtonClickHandler(e){
    this.setState({pageLogIn: false, pageRegister: false, pageGame: true, pageProfile: false, pageInstruction: false, pageStats: false});
    startGame();


  }
/*  controlButtonClickHandler(e){


    var up=document.getElementById('keyboard_key_up');
    var left=document.getElementById('keyboard_key_left');
    var down=document.getElementById('keyboard_key_down');
    var right=document.getElementById('keyboard_key_right');
    var canvas=document.getElementById('stage');
    var pick=document.getElementById('pickup');

    if(e.target.id ==="keyboard_key_up"){

      up.addEventListener("touchstart", handleStart, false);
      up.addEventListener("touchmove", handleMove, false);
      up.addEventListener("touchend", handleEnd, false);

    }else if(e.target.id ==="keyboard_key_down"){

      down.addEventListener("touchstart", handleStart, false);
      down.addEventListener("touchmove", handleMove, false);
      down.addEventListener("touchend", handleEnd, false);
    
    }else if(e.target.id ==="keyboard_key_right"){

      right.addEventListener("touchstart", handleStart, false);
      right.addEventListener("touchmove", handleMove, false);
      right.addEventListener("touchend", handleEnd, false);
    
    }else if(e.target.id ==="keyboard_key_left"){

      left.addEventListener("touchstart", handleStart, false);
      left.addEventListener("touchmove", handleMove, false);
      left.addEventListener("touchend", handleEnd, false);
      
    }else if(e.target.id ==="pickup"){
      canvas.addEventListener("touchstart", handleStart, false);
      
    }if(e.target.id ==="stage"){
      pick.addEventListener("touchstart", handleStart, false);
    }




  }*/


  render(){
    let nav = null;
    let view;
    if(this.state.verifyLogin == false){
      if(this.props.loggedin == true){
        this.state.loggedIn = true;
        this.state.pageGame = true;
        this.state.pageLogIn = false;
        this.state.verifyLogin= true;
      }
    }
    if(this.state.verifyRegister == false){
      if(this.props.registered == true){
        this.state.loggedIn = false;
        this.state.pageGame = false;
        this.state.pageLogIn = true;
        this.state.pageRegister = false;
        this.state.verifyRegister = true;
      }
    }
    
      

    let style = {};
    if (!this.state.pageGame){
      style = {display: 'none'};
    }else{
      style = {};
    }

      if(this.state.loggedIn){
        nav = <NavView playHandler={this.playButtonClickHandler}  instructionHandler={this.instructionButtonClickHandler}  statsHandler={this.statsButtonClickHandler}  profileHandler={this.profileButtonClickHandler}  logoutHandler={this.logoutButtonClickHandler} />
    }

      if (this.state.pageLogIn) {
        view = <LoginView loginHandler={this.loginButtonClickHandler} registerHandler={this.registerButtonClickHandler} />;
      } else if (this.state.pageRegister) {
        view = <RegisterView registerHandler={this.registerButtonClickHandler}  />;
      }else if (this.state.pageGame) {

        view = null;
      }else if (this.state.pageProfile) {

        view = <ProfileView updateHandler={this.updateButtonClickHandler}  />;
      }else if (this.state.pageInstruction) {

        view = <InstructionView />;
      }else if (this.state.pageStats) {

        view = <StatsView />;
      }

      return (
        <div>
          <div>
            {nav}
          </div>
          <div>
            {view}
            
          </div>
          <div id="game" style={style}>
            {this.props.game}
          </div>
          
          
        </div>
      );
      
  }
}

export default App;
