import React from 'react';
class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render(props){
    return (
      <div style={{border:"1px solid black"}} > 
        <div id="ui_play">
          <center>
            <canvas id="stage" width="700" height="700" style={{border:"1px solid black"}} onClick={this.props.controlClickHandler}> </canvas>
          </center>
          <div id="wrapper">
          <div id="controls">
            <button id="keyboard_key_up" className="movements_control" onClick={this.props.controlClickHandler} ></button>
            <button id="keyboard_key_left" className="movements_control" onClick={this.props.controlClickHandler} ></button>
            <button id="keyboard_key_down" className="movements_control" onClick={this.props.controlClickHandler}></button>
            <button id="keyboard_key_right" className="movements_control" onClick={this.props.controlClickHandler}></button>
          </div>
          <div id="pickup_wrapper">
            <button id="pickup" className="movements_control" onClick={this.props.controlClickHandler}></button>
          </div>
          </div>
        </div>
      </div>
    );
  }
}
export default GameView;