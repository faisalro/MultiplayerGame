import React from 'react';
class InstructionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render(props){
    return (
      <div > 
        <div id="ui_instructions" className="center" >
        <h1>Instructions</h1>
          <div >
            <ul>
            <li> Move with <code>wasd</code></li>
            <li> Boxes restore amunition and health, move next to them and press e</li>
            <li> Aim with your mouse</li>
            <li> Mouse click fires</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default InstructionView;