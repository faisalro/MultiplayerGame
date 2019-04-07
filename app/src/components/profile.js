
import React from 'react';
import ViewButton from './button';
import ViewInput from './input';
import {gui_profile_load} from '../controller.js';
class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkill: '',
      selectedMorning: false,
      selectedAfternoon: false,
      selectedEvening: false

    };
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }
  handleSkillChange(changeEvent){
    this.setState({
      selectedSkill: changeEvent.target.value
    });
  }
  handleTimeChange(changeEvent){

    if(changeEvent.target.value === "morning"){
      this.setState({
        selectedMorning: true
      });

    }else if(changeEvent.target.value === "evening"){
      this.setState({
        selectedEvening: true
      });

    }else if(changeEvent.target.value === "afternoon"){
      this.setState({
        selectedAfternoon: true
      });

    }
    

  }

  componentDidMount() {
    gui_profile_load();
  }
  render(props){
    return (
      <div > 
        <div id="ui_profile">
        <h1>Profile</h1>
          <div name="user" className="center">
            <ViewInput name={"user"}  type={"text"}/>
          </div>
          <div name="password" className="center">
            <ViewInput name={"password"} placeholder={"Password"} type={"password"}/>
          </div>
          <div name="confirmpassword" className="center">
            <ViewInput name={"confirmpassword"} placeholder={"Confirm Password"} type={"password"}/>
          </div>
          <div className="center">
            <label className="heading" value={this.state.selectedSkill} >Skill Level</label>
            <div id="radio">
            <ul>
            <li>
              <input type="radio" data-name="skill" value="beginner" id="beginner" checked={this.state.selectedSkill === 'beginner'} onChange={this.handleSkillChange} />
              <label htmlFor="beginner">Beginner</label>
              <div className="check"><div className="inside"></div></div>
            </li>
            <li>
              <input type="radio" data-name="skill" value="intermediate" id="intermediate" checked={this.state.selectedSkill === 'intermediate'} onChange={this.handleSkillChange} />
              <label htmlFor="intermediate">Intermediate</label>
              <div className="check"><div className="inside"></div></div>
            </li>
            <li>
              <input type="radio" data-name="skill" value="advanced" id="advanced" checked={this.state.selectedSkill === 'advanced'} onChange={this.handleSkillChange} />
              <label htmlFor="advanced">Advanced</label>
              <div className="check"><div className="inside"></div></div>
            </li>
            </ul>
            </div>
          </div>
          <div  name="birthday" className="center">
            <label className="heading">Birthday</label>
            <div >
            <input id="year" type="number" min="1900" max="2100" data-name="year" placeholder="year" className="form-control" />
            <select id="month" data-name="month">
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
            <span className="number-wrapper">
            <input id="day" type="number" min="1" max="31" data-name="day" placeholder="day"/>
            </span>
          </div>
          </div>
          <div  id="checkbox" name="plantoplay" className="center">
            <label className="heading">I plan to play:</label>
            <div id="radio">
            <ul>
            <li>
              <input type="checkbox" data-name="playmorning" value="yes" id="playmorning" onChange={this.handleTimeChange} />
              <label htmlFor="playmorning">Morning</label>
              <div className="check"><div className="inside"></div></div>
            </li>
            <li>
              <input type="checkbox" data-name="playafternoon" value="yes" id="playafternoon" onChange={this.handleTimeChange} />
              <label htmlFor="playafternoon">Afternoon</label>
              <div className="check"><div className="inside"></div></div>
            </li>
            <li>
              <input type="checkbox" data-name="playevening" value="yws" id="playevening" onChange={this.handleTimeChange}/>
              <label htmlFor="playevening">Evening</label>
              <div className="check"><div className="inside"></div></div>
            </li>
            </ul>
            </div>
            
          </div>
          <div className="center">
            <ViewButton clickHandler={this.props.updateHandler} value={"Update"} type={"update"}/>
          </div>
        </div>
      </div>
    );
  }
}
export default ProfileView;