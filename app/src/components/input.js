import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
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
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

class ViewInput extends Component {
	constructor(props) {
	  super(props);
	}

	render() {
	  const { classes } = this.props;
	  //console.log(this.props.name);
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
		            shrink: true,
		          }}
		          className={classNames(this.props.classes.textField)}
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