import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
  state = {
    value: 'beginner',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  componentDidMount() {
    var hi = this.refs.skillRadio
    var low = hi.form;
    console.log(this.refs.skillRadio.value, this.state.value);
      if(this.refs.skillRadio.form == this.state.value){

      }else{
        console.log("here");
        
        this.state.value = this.refs.skillRadio.form;
      }
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
