import React, { Component } from 'react';
import ViewButton from './button';
import ViewInput from './input';
import RadioInput from './radio';
class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkill: 'beginner',
      selectedTime: 'morning'

    };
    this.handleSkillChange = this.handleSkillChange.bind(this);
  }
  handleSkillChange(changeEvent){
    this.setState({
      selectedSkill: changeEvent.target.value
    });
  }
  render(props){
    return (
      <div style={{border:"1px solid black"}} > 
        <h2>Register</h2>
        <div id="ui_register">
          <div name="user">
            <ViewInput name={"user"} placeholder={"User Name"} type={"text"}/>
          </div>
          <div name="password">
            <ViewInput name={"password"} placeholder={"Password"} type={"password"}/>
          </div>
          <div name="confirmpassword">
            <ViewInput name={"confirmpassword"} placeholder={"Confirm Password"} type={"password"}/>
          </div>
          <div>
            <RadioInput />
            </div>
          <div name="birthday">
            <label>Birthday</label>
            <input type="number" min="1900" max="2100" data-name="year" placeholder="year"/>
            <select data-name="month">
              <option value="Jan">Jan</option>
              <option value="Feb">Feb</option>
              <option value="Mar">Mar</option>
              <option value="Apr">Apr</option>
              <option value="May">May</option>
              <option value="Jun">Jun</option>
              <option value="Jul">Jul</option>
              <option value="Aug">Aug</option>
              <option value="Sep">Sep</option>
              <option value="Oct">Oct</option>
              <option value="Nov">Nov</option>
              <option value="Dec">Dec</option>
            </select>
            <input type="number" min="1" max="31" data-name="day" placeholder="day"/>
          </div>
          <div  name="plantoplay">
            <label>I plan to play:</label>
            <input type="checkbox" data-name="playmorning" value="yes" />morning
            <input type="checkbox" data-name="playafternoon" value="yes"  />afternoon
            <input type="checkbox" data-name="playevening" value="yes" />evening
          </div>
          <div >
            <ViewButton clickHandler={this.props.registerHandler} value={"Register"} type={"exit_to_app"} />
          </div>
        </div>
      </div>
    );
  }
}
export default RegisterView;