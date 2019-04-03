import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {getData} from '../controller.js';
//import changeFormSkill from './updates.js';
import {gui_profile_load} from '../controller.js';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class RadioInput extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 'beginner',
    };
    //this.changeFormSkill = changeFormSkill.bind(this);
  }
  
  

  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  componentDidMount() {
/*    var d = getData();
    console.log("hiii", d.skill);
    if(d.skill != this.state.value){
      this.state.value = d.skill;
    }*/
    var vall = "lll";
    this.callB = callB.bind(this);
    function callB(data) {

        //skilb = data.data.skill;
        
        vall = data.data.skill;
        console.log(vall, "ajohnnlnl");
        this.setState({ value: vall });

    }
    var skii = gui_profile_load(callB);
    console.log("skii",vall);
    this.setState({ value: vall });
  }

  render() {
    const { classes } = this.props;
    console.log("hi", this.state.value);

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" id="skillRadio" ref="skillRadio" form={this.state.value} className={classes.formControl}>
          <FormLabel  component="legend">Skill Level</FormLabel>
          <RadioGroup
            className={classes.group}
            id="changeSkill"
            title={this.state.value}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel id="beginner" value="beginner" control={<Radio />} label="Beginner" />
            <FormControlLabel id="intermediate" value="intermediate" control={<Radio />} label="Intermediate" />
            <FormControlLabel id="advanced" value="advanced" control={<Radio />} label="Advanced" />
 
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

RadioInput.propTypes = {
  classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(RadioInput);
