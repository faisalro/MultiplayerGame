import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';

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
	constructor(props) {
	  super(props);
	}

	render() {
	  const { classes } = this.props;
	  return (
	      <Button variant="contained" color="primary" onClick={this.props.clickHandler} className={classNames(this.props.classes.button)} >
	        {this.props.value}
	        <Icon className={this.props.classes.rightIcon}>{this.props.type}</Icon>
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

