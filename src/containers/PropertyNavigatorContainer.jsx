import React from 'react';
// import '../assets/styles/property-navigator.css';

// redux module
import { connect } from 'react-redux';
import {
  isPropertyNavigatorShowing,
  setDummyNumber,
} from '../redux/actions';

// import icon images
import icEdit from '../assets/images_ms/ic_edit.png';
import icSave from '../assets/images_ms/ic_save.png';
import icClose from '../assets/images_ms/ic_close.png';

// import container component
import PropertyContentsContainer from './PropertyContentsContainer';
import PropertyContentsEditContainer from './PropertyContentsEditContainer';

class PropertyNavigatorContainer extends React.Component {
  state = {
    files: {},
    isEditing: false,
  };

  propertiesRef = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    // edit 도중 다른 노드를 클릭한 경우 edit을 중지한다.
    if (
      prevState.isEditing &&
      prevProps.selectedNode !== this.props.selectedNode
    ) {
      this.setState({
        isEditing: false,
      });
    }
  }

  handleClickEditAndSave = e => {
    if (this.state.isEditing) {
      // 속성값 변경
      this.props.pipelineManager.setPropertyOfNode(
        this.props.selectedNode.getID(),
        this.propertiesRef.state.properties,
      );

      // Linkboard에 변경된 속성을 바로 반영하기
      this.props.onSetDummyNumber();
    }

    this.setState({
      isEditing: !this.state.isEditing,
    });
  };

  handleClickClose = e => {
    this.props.onIsPropertyNavigatorShowing(false, null);
    this.setState({
      isEditing: false,
    });
  };

  getPropertyComponent(node) {
    return this.state.isEditing ? (
      <PropertyContentsEditContainer
        ref={r => (this.propertiesRef = r)}
        properties={node.getProperties()}
        node={node}
      />
    ) : (
      <PropertyContentsContainer properties={node.getProperties()} />
    );
  }

  render() {
    let propertyComponent =
      this.props.selectedNode !== null
        ? this.getPropertyComponent(this.props.selectedNode)
        : null;
    return (
      <div
        id="property-navigator"
        style={this.props.isShowing ? { width: '400px' } : { width: '0px' }}
      >
        <div id="property-navigator-top">
          <button
            className="navigator-button"
            onClick={this.handleClickEditAndSave}
          >
            {this.state.isEditing ? (
              <img src={icSave} alt="save" width="16" height="16" />
            ) : (
              <img src={icEdit} alt="edit" width="16" height="16" />
            )}
          </button>
          <button className="navigator-button" onClick={this.handleClickClose}>
            <img src={icClose} alt="close" width="16" height="16" />
          </button>
        </div>
        <div className="navigator-title">
          {this.props.selectedNode !== null
            ? this.props.selectedNode.getName()
            : ''}
        </div>
        {propertyComponent}
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    isShowing: state.propertyNavigatorManager.get('isShowing'),
    selectedNode: state.propertyNavigatorManager.get('selectedNode'),
    pipelineManager: state.pipelineManager.get('pipelineManager'),
  };
};

let mapDispatchToProps = dispatch => {
  return {
    // 20.02.13
    onIsPropertyNavigatorShowing: (isShowing, selectedNode) =>
      dispatch(isPropertyNavigatorShowing(isShowing, selectedNode)),

    // 20.02.19
    onSetDummyNumber: () => dispatch(setDummyNumber()),
  };
};

PropertyNavigatorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertyNavigatorContainer);
export default PropertyNavigatorContainer;
