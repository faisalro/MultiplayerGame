import React from 'react';
class StatsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render(props){
    return (
      <div style={{border:"1px solid black"}} > 
        <div id="ui_stats">
        </div>
      </div>
    );
  }
}
export default StatsView;