import React from 'react';

// import presentatinal
import DefaultTabPane from './DefaultTabPane';
import TrainingContainer from '../../container/TrainingContainer';

const TabPanes = props => (
  <React.Fragment>
    <DefaultTabPane
      tabIndex={0}
      selectedIndex={props.selectedIndex}
      pipelineManager={props.pipelineManager}
    />

    <TrainingContainer
      tabIndex={1}
      selectedIndex={props.selectedIndex}
    />
  </React.Fragment>
);

export default TabPanes;
