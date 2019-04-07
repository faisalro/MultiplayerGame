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

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" id="skillRadio" form={this.state.value} className={classes.formControl}>
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
