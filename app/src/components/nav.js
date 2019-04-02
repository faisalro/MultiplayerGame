import React, { Component } from 'react';
import ViewButton from './button';
class NavView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render(props){
    return (
      <div style={{border:"1px solid black"}} > 
        <div>
          Fortnight
          <div id="ui_nav">
            <ViewButton clickHandler={this.props.playHandler} value={"Play"} type={"videogame_asset"} />
            <ViewButton clickHandler={this.props.instructionHandler} value={"Instructions"} type={"help_outline"}/>
            <ViewButton clickHandler={this.props.statsHandler} value={"Stats"} type={"trending_up"}/>
            <ViewButton clickHandler={this.props.profileHandler} value={"Profile"} type={"account_box"}/>
            <ViewButton clickHandler={this.props.logoutHandler} value={"Logout"} type={"exit_to_app"}/>
          </div>
        </div>
      </div>
    );
  }
}
export default NavView;