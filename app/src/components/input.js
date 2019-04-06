import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    margin: 8,
    width: "100%",
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 400,
  },
  cssLabel: {
    color : 'black  !important'
  },

  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `#6DD6E5 !important`,
    }
  },

  cssFocused: {},

  notchedOutline: {
    borderWidth: '1px',
    borderColor: '#FE6B8B !important'
  },
});

class ViewInput extends Component {

	render() {
	  const { classes } = this.props;
	  return (
  		<TextField
          id={this.props.name}
          label= {this.props.name}
          type = {this.props.type}
          placeholder={this.props.placeholder}
          //helperText="Full width!"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
            shrink: true,
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
          className={classNames(classes.textField)}
        />
	  );
	}
}

ViewInput.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	type: PropTypes.string,

};

export default withStyles(styles)(ViewInput);