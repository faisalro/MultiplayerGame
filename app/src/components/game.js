import React from 'react';
import {startGame, pauseGame, gui_state, gui_login, gui_register, gui_profile, gui_profile_load, handleStart, handleMove, handleEnd} from '../controller.js';

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.controlButtonClickHandler = this.controlButtonClickHandler.bind(this);
  }
  controlButtonClickHandler(e){


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




  }
  render(props){
    return (
      <div style={{border:"1px solid black"}} > 
        <div id="ui_play">
          <center>
            <canvas id="stage" width="700" height="350" style={{border:"1px solid black"}} onClick={this.controlButtonClickHandler}> </canvas>
          </center>
          <div id="controls">
            <button id="keyboard_key_up" className="movements_control" onClick={this.controlButtonClickHandler} >W</button>
            <button id="keyboard_key_left" className="movements_control" onClick={this.controlButtonClickHandler} >A</button>
            <button id="keyboard_key_down" className="movements_control" onClick={this.controlButtonClickHandler}>S</button>
            <button id="keyboard_key_right" className="movements_control" onClick={this.controlButtonClickHandler}>D</button>
          </div>
          <div id="pickup_wrapper">
            <button id="pickup" className="movements_control" onClick={this.controlButtonClickHandler}>E</button>
          </div>
        </div>
      </div>
    );
  }
}
export default GameView;