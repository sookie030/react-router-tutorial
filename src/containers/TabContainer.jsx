import React from 'react';
import '../assets/styles/tab.css';

// import constants
import * as EVENT_TYPE from '../constants/EventType';

// redux modules
import { connect } from 'react-redux';
import {
  setToast,
} from '../redux/actions';

// import presentation
import Tabs from '../components/tabPane/Tabs';
import TabPane from '../components/tabPane/TabPanes';

class TabContainer extends React.Component {
  state = {
    selectedIndex: 0,
  };

  /**
   * 탭 선택
   */
  handleTabSelected = (index, e) => {
    this.setState({
      selectedIndex: index,
    });
  };

  render() {
    const selectedIndex = this.state.selectedIndex;
    const onHandleTabSelected = this.handleTabSelected;

    return (
      <React.Fragment>
        <Tabs
          selectedIndex={selectedIndex}
          handleTabSelected={onHandleTabSelected}
        />
        <TabPane selectedIndex={selectedIndex} />
      </React.Fragment>
    );
  }
}

let mapStateToProps = state => {
  return {
    links: state.linksManager.get('links'),
    pipelineManager: state.pipelineManager.get('pipelineManager'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    onSetToast: (timeStamp, message, messageType) =>
      dispatch(setToast(timeStamp, message, messageType)),
  };
};

TabContainer = connect(mapStateToProps, mapDispatchToProps)(TabContainer);
export default TabContainer;
