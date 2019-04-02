import React, { Component } from 'react';
import ViewButton from './button';
import ViewInput from './input';
class LoginView extends React.Component {
  constructor(props) {
    super(props);
  }
  render(props){
    return (
      <div style={{border:"1px solid black"}} id="ui_login"> 
        <div>
          <ViewInput name={"user"} placeholder={"User Name"} type={"text"}/>
        </div>
        <div>
          <ViewInput name={"password"} placeholder={"Password"} type={"password"}/>
        </div>
        <ViewButton clickHandler={this.props.loginHandler} value={"Login"} type={"exit_to_app"}/>
        <ViewButton clickHandler={this.props.registerHandler} value={"Register"} type={"perm_identity"} />
      </div>
    );
  }
}
export default LoginView;