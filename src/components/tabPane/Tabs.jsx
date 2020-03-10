import React from 'react';
import icLink from '../../assets/images/ic_link.png';
import icTraining from '../../assets/images/ic_training.png';

const Tabs = props => (
  <div className="tab">

    {/* Default TabPane */}
    <div
      className={`tablinks ${props.selectedIndex === 0 ? 'selected' : ''}`}
      onClick={e => props.handleTabSelected(0, e)}
    >
      <img src={icLink} alt="link" width="16" height="16" />
    </div>


    {/* Training TabPane */}
    <div
      className={`tablinks ${props.selectedIndex === 1 ? 'selected' : ''}`}
      onClick={e => props.handleTabSelected(1, e)}
    >
      <img src={icTraining} alt="training" width="16" height="16" />
    </div>
  </div>
);

export default Tabs;
