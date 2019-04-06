import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  button: {
    margin: 9,
    background: '#FE6B8B',
    '&:hover': {
       background: "#6DD6E5",
    },
    
  },
  rightIcon: {
    margin: 5,
    fontSize: 20,
  },
});

class ViewButton extends Component {

	render() {
	  const { classes } = this.props;
	  return (
	      <Button variant="contained" color="primary" onClick={this.props.clickHandler} className={classNames(classes.button)} >
	        {this.props.value}
	        <Icon className={classes.rightIcon}>{this.props.type}</Icon>
	      </Button>
	  );
	}
}

ViewButton.propTypes = {
	classes: PropTypes.object.isRequired,
	value: PropTypes.string,
	type: PropTypes.string,
	clickHandler: PropTypes.func,
};

export default withStyles(styles)(ViewButton);

