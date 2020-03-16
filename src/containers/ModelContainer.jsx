import React from "react";

// redux modules
import { connect } from "react-redux";

class ModelContainer extends React.Component {

  state = {
    modelList: [
      { id: 0, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 1, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 2, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 3, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 4, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 5, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 6, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 7, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 8, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 9, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 10, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
      { id: 11, context: 1, category: 1, model: [0, 0, 0, 0], minif: 2, aif: 3000 },
    ]
  }

  getModelList = () => {
    let modelList = this.state.modelList.map(model => {
      return (
        <li>
          <div style={{backgroundColor: 'gray' }}>
            <p>Context: {model.context}</p>
            <p>Category: {model.category}</p>
            <p>MIN: {model.minif}</p>
            <p>AIF: {model.aif}</p>
          </div>
        </li>
      )
    })

    return modelList;
  }

  render() {
    const modelList = this.getModelList();
    return (
      <div className="model-view-container">
        <div>
          <p style={{color: 'white'}} onClick={this.props.handleOnClickCloseBtn}>X</p>
          <h1 style={{color: 'white'}}>Model View</h1>
        </div>
        <div>
          <ul>
            {modelList}
          </ul>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    pipelineManager: state.pipelineManager.get("pipelineManager")
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

ModelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelContainer);
export default ModelContainer;
